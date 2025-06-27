var canvas, ctx, noteLabels, triadLabels, midiPlayer;

$(function(){
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  noteLabels = document.getElementById("note-labels");
  triadLabels = document.getElementById("triad-labels");
  $(triadLabels).hide();

  storage.init();
  colorscheme.init('default');
  audio.init();
  tonnetz.init();
  midi.init();
  keyboard.init('piano');

  $('#midi-file').change(function(event) {
    var file = event.target.files[0];
    if (!file) return;
    if(!file.name.toLowerCase().match(/\.midi?$/)) {
      showError('Please select a MIDI file.');
      $(this).val('');
      return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        if (midiPlayer && midiPlayer.isPlaying()) {
          midiPlayer.stop();
        }
        midiPlayer = new MidiPlayer.Player(function(evt) {
          if (evt.name === 'Note on' && evt.velocity > 0) {
            tonnetz.noteOn(0, evt.noteNumber);
          } else if (evt.name === 'Note off' || (evt.name === 'Note on' && evt.velocity === 0)) {
            tonnetz.noteOff(0, evt.noteNumber);
          }
        });
        midiPlayer.on('endOfFile', function(){
          showSuccess('Playback finished.');
        });
        midiPlayer.loadArrayBuffer(e.target.result);
        midiPlayer.play();
        showSuccess('Playing ' + file.name);
      } catch(err) {
        console.error(err);
        showError('Failed to load MIDI file.');
      }
    };
    reader.readAsArrayBuffer(file);
  });

  $('#tonnetz').mousewheel(function(event) {
    tonnetz.setDensity(tonnetz.density - event.deltaY);
    return false;
  });
  $(window).keypress(function(event) {
    if (somethingHasFocus()) return;

    var c = String.fromCharCode(event.which);
    if (c == '+') {
      tonnetz.setDensity(tonnetz.density - 2);
    } else if (c == '-') {
      tonnetz.setDensity(tonnetz.density + 2);
    }
  });

  $('#navbar a[data-toggle="tab"]').on('shown.bs.tab', function() {
    if ($(this).attr('href') != "#")
      $('#tabs').collapse('show');
      collapseNav();
  });

  $('#navbar a[data-toggle="tab"]').click(function() {
    if ($(this).parent().hasClass('active')) {
      $('#tabs').collapse('hide');
    }
  });

  $('.tab-link').click(function(event) {
    event.preventDefault();
    var href = $(this).attr('href');
    $('#navbar a[data-toggle="tab"][href="' + href + '"]').tab('show');
  });

  $('#tabs').on('hidden.bs.collapse', noTab);
  $('#tonnetz').click(collapseNavAndTabs);
  $('.navbar-brand').click(function(event) {
    event.preventDefault();
    collapseNavAndTabs();
  });

  $('#panic').click(function() { tonnetz.panic(); });
  $('#enable-sustain').click(function() { tonnetz.toggleSustainEnabled(); });
  $('#show-note-names').click(function() { $(noteLabels).toggle(); });
  $('#show-triad-names').click(function() { $(triadLabels).toggle(); });
  $('#show-unit-cell').click(function() { tonnetz.toggleUnitCell(); });
  $('#ghost-duration').on('input change propertychange paste', function() {
    if(!tonnetz.setGhostDuration($(this).val())) {
      $(this).closest('.form-group').addClass('has-error');
    } else {
      $(this).closest('.form-group').removeClass('has-error');
    }
  });
  $('input[type=radio][name=layout]').change(function() {
    tonnetz.setLayout($(this).val());
  });
  $('input[type=radio][name=kbd-layout]').change(function() {
    keyboard.layout = $(this).val();
    tonnetz.panic();
  });

  $('[data-toggle="tooltip"]').tooltip();

  // Open links with data-popup="true" in a new window.
  $('body').on('click', 'a[data-popup]', function(event) {
    window.open($(this)[0].href);
    event.preventDefault();
  });
});

function collapseNav() {
  if($('.navbar-toggle').is(':visible') && $('.navbar-collapse').hasClass('in')) {
    $('.navbar-toggle').click();
  }
}

function collapseNavAndTabs() {
  $('#tabs').collapse('hide');
  collapseNav();
}

function noTab() {
  $('#dummy-tab').tab('show');
}

function somethingHasFocus() {
  return $(':focus').is('input, select, button, textarea');
}

function showAlert(text, type) {
  var a = $('<div class="alert alert-'+type+' alert-dismissible fade" role="alert">' +
           '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
           '<span aria-hidden="true">×</span></button></div>');
  a.append(document.createTextNode(text));
  $('#messages').append(a);
  a.addClass('in');

  var numMessages = $('#messages').children().length;
  if (numMessages > 3) {
    $('#messages').children().slice(0, numMessages-3).alert('close');
  }
}

function showWarning(text) { showAlert(text, 'warning'); }
function showError(text) { showAlert(text, 'danger'); }
function showSuccess(text) { showAlert(text, 'success'); }
