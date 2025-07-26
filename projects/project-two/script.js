const { useState, useEffect } = React;

// Icon components using Font Awesome
const Icon = ({ name, className = "w-4 h-4" }) => {
  const iconMap = {
    'plus': 'fas fa-plus',
    'user': 'fas fa-user',
    'calendar': 'fas fa-calendar',
    'message-circle': 'fas fa-comment',
    'check': 'fas fa-check',
    'x': 'fas fa-times',
    'edit': 'fas fa-edit',
    'search': 'fas fa-search',
    'users': 'fas fa-users',
    'brain': 'fas fa-brain',
    'clock': 'fas fa-clock',
    'tag': 'fas fa-tag'
  };
  
  return React.createElement('i', {
    className: `${iconMap[name] || 'fas fa-circle'} ${className}`
  });
};

const ContextualApp = () => {
  const [contacts, setContacts] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [unassignedInsights, setUnassignedInsights] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedContact, setSelectedContact] = useState(null);
  const [newInteractionText, setNewInteractionText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingInsights, setPendingInsights] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data initialization
  useEffect(() => {
    const sampleContacts = [
      { 
        id: 1, 
        name: 'Alex Johnson', 
        facts: [
          { id: 1, type: 'Profile', fact: 'Plays guitar', detail: 'Started learning ~August 2023', date: '2023-11-15' },
          { id: 2, type: 'Preference', fact: 'Dog person', detail: 'Mentioned preference for dogs over cats', date: '2023-10-20' }
        ],
        lastInteraction: '2023-11-15'
      },
      { 
        id: 2, 
        name: 'Sarah Chen', 
        facts: [
          { id: 3, type: 'Profile', fact: 'Project Manager at Acme Corp', detail: 'Started new role ~November 2023', date: '2023-11-10' }
        ],
        lastInteraction: '2023-11-10'
      }
    ];
    
    const sampleInteractions = [
      {
        id: 1,
        contactId: 1,
        date: '2023-11-15',
        text: `Did you see how late the train was yesterday?\nYeah, I wasn't even there, I was stuck at my guitar lesson.\nYou play guitar?\nYeah, been learning for a few months now. I just wanted to try something new after school, you know?`,
        extractedInsights: ['Plays guitar', 'Attended guitar lesson']
      }
    ];

    setContacts(sampleContacts);
    setInteractions(sampleInteractions);
  }, []);

  // NLP Processing Function
  const processInteractionText = (text) => {
    const insights = [];
    const currentDate = new Date();
    
    // Guitar detection
    if (text.toLowerCase().includes('guitar')) {
      if (text.toLowerCase().includes('learning') || text.toLowerCase().includes('been')) {
        const timeMatch = text.match(/for a few months/i);
        if (timeMatch) {
          const startDate = new Date(currentDate);
          startDate.setMonth(startDate.getMonth() - 3);
          insights.push({
            id: Date.now() + Math.random(),
            type: 'Profile',
            fact: 'Plays guitar',
            detail: `Started learning ~${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
            confidence: 0.9,
            speaker: 'Speaker 2'
          });
        }
        
        if (text.toLowerCase().includes('lesson')) {
          insights.push({
            id: Date.now() + Math.random() + 1,
            type: 'Event',
            fact: 'Attended guitar lesson',
            detail: 'Yesterday',
            confidence: 0.85,
            speaker: 'Speaker 2'
          });
        }
      }
    }

    // Job detection
    if (text.toLowerCase().includes('new role') || text.toLowerCase().includes('new job')) {
      const jobMatch = text.match(/as a? ([\w\s]+) at ([\w\s]+)/i);
      if (jobMatch) {
        insights.push({
          id: Date.now() + Math.random(),
          type: 'Profile',
          fact: `${jobMatch[1]} at ${jobMatch[2]}`,
          detail: `Started ~${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
          confidence: 0.95,
          speaker: 'Speaker 1'
        });
      }
    }

    // Family/relationship detection
    const familyMatch = text.match(/my (sister|brother|mom|dad|mother|father)[,\s]+(\w+)/i);
    if (familyMatch) {
      insights.push({
        id: Date.now() + Math.random(),
        type: 'Relationship',
        fact: `Has a ${familyMatch[1]} named ${familyMatch[2]}`,
        detail: 'Family relationship',
        confidence: 0.9,
        speaker: 'Speaker 1'
      });
    }

    // Preference detection
    if (text.toLowerCase().includes('dog person') || text.toLowerCase().includes('cat person')) {
      const preference = text.toLowerCase().includes('dog') ? 'dog' : 'cat';
      insights.push({
        id: Date.now() + Math.random(),
        type: 'Preference',
        fact: `Is a ${preference} person`,
        detail: 'Stated preference',
        confidence: 0.8,
        speaker: 'Speaker 1'
      });
    }

    return insights;
  };

  const handleProcessInteraction = () => {
    if (!newInteractionText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const insights = processInteractionText(newInteractionText);
      setPendingInsights(insights);
      setIsProcessing(false);
      setCurrentView('confirm-insights');
    }, 1500);
  };

  const confirmInsight = (insight, contactId = null) => {
    if (contactId) {
      // Add to contact's facts
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { 
              ...contact, 
              facts: [...contact.facts, { ...insight, date: new Date().toISOString().split('T')[0] }],
              lastInteraction: new Date().toISOString().split('T')[0]
            }
          : contact
      ));
      
      // Add interaction
      const newInteraction = {
        id: Date.now(),
        contactId,
        date: new Date().toISOString().split('T')[0],
        text: newInteractionText,
        extractedInsights: [insight.fact]
      };
      setInteractions(prev => [...prev, newInteraction]);
    } else {
      // Add to unassigned insights
      setUnassignedInsights(prev => [...prev, { 
        ...insight, 
        originalText: newInteractionText,
        date: new Date().toISOString().split('T')[0]
      }]);
    }
    
    // Remove from pending
    setPendingInsights(prev => prev.filter(i => i.id !== insight.id));
  };

  const createNewContact = (name) => {
    const newContact = {
      id: Date.now(),
      name,
      facts: [],
      lastInteraction: new Date().toISOString().split('T')[0]
    };
    setContacts(prev => [...prev, newContact]);
    return newContact.id;
  };

  const assignInsightToContact = (insight, contactId) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, facts: [...contact.facts, { ...insight, date: new Date().toISOString().split('T')[0] }] }
        : contact
    ));
    setUnassignedInsights(prev => prev.filter(i => i.id !== insight.id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Profile': return React.createElement(Icon, { name: 'user' });
      case 'Event': return React.createElement(Icon, { name: 'calendar' });
      case 'Preference': return React.createElement(Icon, { name: 'tag' });
      case 'Relationship': return React.createElement(Icon, { name: 'users' });
      default: return React.createElement(Icon, { name: 'message-circle' });
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Profile': return 'bg-blue-100 text-blue-800';
      case 'Event': return 'bg-green-100 text-green-800';
      case 'Preference': return 'bg-purple-100 text-purple-800';
      case 'Relationship': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.facts.some(fact => 
      fact.fact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fact.detail.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return React.createElement('div', { className: 'min-h-screen bg-gray-50' },
    // Header
    React.createElement('header', { className: 'bg-white shadow-sm border-b' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex justify-between items-center py-4' },
          React.createElement('div', { className: 'flex items-center space-x-3' },
            React.createElement(Icon, { name: 'brain', className: 'w-8 h-8 text-blue-600' }),
            React.createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, 'Contextual'),
            React.createElement('span', { className: 'text-sm text-gray-500' }, 'Personal Relations Management')
          ),
          React.createElement('nav', { className: 'flex space-x-4' },
            React.createElement('button', {
              onClick: () => setCurrentView('dashboard'),
              className: `px-4 py-2 rounded-lg ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
            }, 'Dashboard'),
            React.createElement('button', {
              onClick: () => setCurrentView('add-interaction'),
              className: `px-4 py-2 rounded-lg ${currentView === 'add-interaction' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
            }, 'Add Interaction'),
            React.createElement('button', {
              onClick: () => setCurrentView('contacts'),
              className: `px-4 py-2 rounded-lg ${currentView === 'contacts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
            }, 'Contacts')
          )
        )
      )
    ),

    React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
      // Dashboard View
      currentView === 'dashboard' && React.createElement('div', { className: 'space-y-6' },
        // Stats
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-4 gap-6' },
          React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' },
            React.createElement('div', { className: 'flex items-center' },
              React.createElement(Icon, { name: 'users', className: 'w-8 h-8 text-blue-600' }),
              React.createElement('div', { className: 'ml-4' },
                React.createElement('p', { className: 'text-2xl font-semibold text-gray-900' }, contacts.length),
                React.createElement('p', { className: 'text-gray-600' }, 'Contacts')
              )
            )
          ),
          React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' },
            React.createElement('div', { className: 'flex items-center' },
              React.createElement(Icon, { name: 'message-circle', className: 'w-8 h-8 text-green-600' }),
              React.createElement('div', { className: 'ml-4' },
                React.createElement('p', { className: 'text-2xl font-semibold text-gray-900' }, interactions.length),
                React.createElement('p', { className: 'text-gray-600' }, 'Interactions')
              )
            )
          ),
          React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' },
            React.createElement('div', { className: 'flex items-center' },
              React.createElement(Icon, { name: 'brain', className: 'w-8 h-8 text-purple-600' }),
              React.createElement('div', { className: 'ml-4' },
                React.createElement('p', { className: 'text-2xl font-semibold text-gray-900' },
                  contacts.reduce((total, contact) => total + contact.facts.length, 0)
                ),
                React.createElement('p', { className: 'text-gray-600' }, 'Insights')
              )
            )
          ),
          React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' },
            React.createElement('div', { className: 'flex items-center' },
              React.createElement(Icon, { name: 'clock', className: 'w-8 h-8 text-orange-600' }),
              React.createElement('div', { className: 'ml-4' },
                React.createElement('p', { className: 'text-2xl font-semibold text-gray-900' }, unassignedInsights.length),
                React.createElement('p', { className: 'text-gray-600' }, 'Unassigned')
              )
            )
          )
        ),

        // Unassigned Insights
        unassignedInsights.length > 0 && React.createElement('div', { className: 'bg-white rounded-lg shadow' },
          React.createElement('div', { className: 'px-6 py-4 border-b' },
            React.createElement('h2', { className: 'text-lg font-medium text-gray-900' }, `Unassigned Insights (${unassignedInsights.length})`)
          ),
          React.createElement('div', { className: 'p-6 space-y-4' },
            unassignedInsights.map((insight) =>
              React.createElement('div', { key: insight.id, className: 'flex items-center justify-between p-4 bg-gray-50 rounded-lg' },
                React.createElement('div', { className: 'flex items-center space-x-3' },
                  getTypeIcon(insight.type),
                  React.createElement('div', null,
                    React.createElement('p', { className: 'font-medium text-gray-900' }, insight.fact),
                    React.createElement('p', { className: 'text-sm text-gray-600' }, insight.detail),
                    React.createElement('p', { className: 'text-xs text-gray-500' }, `From interaction on ${insight.date}`)
                  )
                ),
                React.createElement('div', { className: 'flex space-x-2' },
                  React.createElement('select', {
                    onChange: (e) => e.target.value && assignInsightToContact(insight, parseInt(e.target.value)),
                    className: 'px-3 py-1 border rounded text-sm'
                  },
                    React.createElement('option', { value: '' }, 'Assign to Contact'),
                    contacts.map(contact =>
                      React.createElement('option', { key: contact.id, value: contact.id }, contact.name)
                    )
                  ),
                  React.createElement('button', {
                    onClick: () => setUnassignedInsights(prev => prev.filter(i => i.id !== insight.id)),
                    className: 'text-red-600 hover:text-red-800'
                  },
                    React.createElement(Icon, { name: 'x' })
                  )
                )
              )
            )
          )
        )
      ),

      // Add Interaction View
      currentView === 'add-interaction' && React.createElement('div', { className: 'max-w-2xl mx-auto' },
        React.createElement('div', { className: 'bg-white rounded-lg shadow' },
          React.createElement('div', { className: 'px-6 py-4 border-b' },
            React.createElement('h2', { className: 'text-lg font-medium text-gray-900' }, 'Add New Interaction'),
            React.createElement('p', { className: 'text-sm text-gray-600 mt-1' },
              'Paste your conversation text below and let our AI extract meaningful insights.'
            )
          ),
          React.createElement('div', { className: 'p-6' },
            React.createElement('textarea', {
              value: newInteractionText,
              onChange: (e) => setNewInteractionText(e.target.value),
              className: 'w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              placeholder: 'Paste your conversation here...\n\nExample:\nDid you see how late the train was yesterday?\nYeah, I wasn\'t even there, I was stuck at my guitar lesson.\nYou play guitar?\nYeah, been learning for a few months now. I just wanted to try something new after school, you know?'
            }),
            React.createElement('div', { className: 'mt-4 flex justify-end' },
              React.createElement('button', {
                onClick: handleProcessInteraction,
                disabled: !newInteractionText.trim() || isProcessing,
                className: 'px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2'
              },
                isProcessing ? [
                  React.createElement('div', { key: 'spinner', className: 'animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent' }),
                  React.createElement('span', { key: 'text' }, 'Processing...')
                ] : [
                  React.createElement(Icon, { key: 'icon', name: 'brain' }),
                  React.createElement('span', { key: 'text' }, 'Analyze Interaction')
                ]
              )
            )
          )
        )
      ),

      // Confirm Insights View
      currentView === 'confirm-insights' && React.createElement('div', { className: 'max-w-4xl mx-auto' },
        React.createElement('div', { className: 'bg-white rounded-lg shadow' },
          React.createElement('div', { className: 'px-6 py-4 border-b' },
            React.createElement('h2', { className: 'text-lg font-medium text-gray-900' }, 'New Interaction Analysis')
          ),
          React.createElement('div', { className: 'p-6' },
            React.createElement('div', { className: 'mb-6' },
              React.createElement('h3', { className: 'text-sm font-medium text-gray-700 mb-2' }, 'Original Text:'),
              React.createElement('div', { className: 'p-4 bg-gray-50 rounded-lg text-sm text-gray-700' },
                newInteractionText.split('\n').map((line, idx) =>
                  React.createElement('p', { key: idx, className: 'mb-1' }, line)
                )
              )
            ),

            React.createElement('div', { className: 'mb-6' },
              React.createElement('h3', { className: 'text-sm font-medium text-gray-700 mb-4' }, 'Suggested Insights:'),
              React.createElement('div', { className: 'space-y-4' },
                pendingInsights.map((insight) =>
                  React.createElement('div', { key: insight.id, className: 'border rounded-lg p-4' },
                    React.createElement('div', { className: 'flex items-start justify-between' },
                      React.createElement('div', { className: 'flex items-start space-x-3' },
                        React.createElement('span', { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(insight.type)}` },
                          getTypeIcon(insight.type),
                          React.createElement('span', { className: 'ml-1' }, `[${insight.type}]`)
                        ),
                        React.createElement('div', null,
                          React.createElement('p', { className: 'font-medium text-gray-900' }, insight.fact),
                          React.createElement('p', { className: 'text-sm text-gray-600' }, insight.detail),
                          React.createElement('p', { className: 'text-xs text-gray-500 mt-1' },
                            `Confidence: ${Math.round(insight.confidence * 100)}% | Speaker: ${insight.speaker}`
                          )
                        )
                      ),
                      React.createElement('div', { className: 'flex items-center space-x-2' },
                        React.createElement('select', {
                          className: 'px-3 py-1 border rounded text-sm',
                          onChange: (e) => {
                            if (e.target.value === 'new') {
                              const name = prompt('Enter new contact name:');
                              if (name) {
                                const newContactId = createNewContact(name);
                                confirmInsight(insight, newContactId);
                              }
                            } else if (e.target.value === 'unassigned') {
                              confirmInsight(insight);
                            } else if (e.target.value) {
                              confirmInsight(insight, parseInt(e.target.value));
                            }
                          }
                        },
                          React.createElement('option', { value: '' }, 'Select Action'),
                          contacts.map(contact =>
                            React.createElement('option', { key: contact.id, value: contact.id }, `Assign to ${contact.name}`)
                          ),
                          React.createElement('option', { value: 'new' }, 'Create New Contact'),
                          React.createElement('option', { value: 'unassigned' }, 'Save as Unassigned')
                        ),
                        React.createElement('button', {
                          onClick: () => setPendingInsights(prev => prev.filter(i => i.id !== insight.id)),
                          className: 'text-red-600 hover:text-red-800',
                          title: 'Delete insight'
                        },
                          React.createElement(Icon, { name: 'x' })
                        )
                      )
                    )
                  )
                )
              )
            ),

            React.createElement('div', { className: 'flex justify-between' },
              React.createElement('button', {
                onClick: () => {
                  setCurrentView('add-interaction');
                  setPendingInsights([]);
                },
                className: 'px-4 py-2 text-gray-600 hover:text-gray-800'
              }, '← Back to Edit'),
              React.createElement('button', {
                onClick: () => {
                  setCurrentView('dashboard');
                  setPendingInsights([]);
                  setNewInteractionText('');
                },
                disabled: pendingInsights.length > 0,
                className: 'px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50'
              },
                pendingInsights.length > 0 ? `${pendingInsights.length} insights pending` : 'Complete'
              )
            )
          )
        )
      ),

      // Contacts View
      currentView === 'contacts' && React.createElement('div', null,
        React.createElement('div', { className: 'mb-6' },
          React.createElement('div', { className: 'flex justify-between items-center' },
            React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Contacts'),
            React.createElement('div', { className: 'flex items-center space-x-4' },
              React.createElement('div', { className: 'relative' },
                React.createElement(Icon, { name: 'search', className: 'w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' }),
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Search contacts...',
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  className: 'pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                })
              )
            )
          )
        ),

        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' },
          filteredContacts.map((contact) =>
            React.createElement('div', { key: contact.id, className: 'bg-white rounded-lg shadow hover:shadow-md transition-shadow' },
              React.createElement('div', { className: 'p-6' },
                React.createElement('div', { className: 'flex items-center justify-between mb-4' },
                  React.createElement('h3', { className: 'text-lg font-medium text-gray-900' }, contact.name),
                  React.createElement('span', { className: 'text-xs text-gray-500' },
                    `Last: ${contact.lastInteraction}`
                  )
                ),
                
                React.createElement('div', { className: 'space-y-3' },
                  React.createElement('div', { className: 'text-sm text-gray-600' },
                    React.createElement('strong', null, `Key Facts (${contact.facts.length}):`)
                  ),
                  contact.facts.slice(0, 3).map((fact) =>
                    React.createElement('div', { key: fact.id, className: 'flex items-start space-x-2 text-sm' },
                      React.createElement('span', { className: `inline-flex items-center px-2 py-1 rounded-full text-xs ${getTypeColor(fact.type)}` },
                        getTypeIcon(fact.type),
                        React.createElement('span', { className: 'ml-1' }, fact.type)
                      ),
                      React.createElement('div', null,
                        React.createElement('p', { className: 'text-gray-900' }, fact.fact),
                        React.createElement('p', { className: 'text-gray-600 text-xs' }, fact.detail)
                      )
                    )
                  ),
                  contact.facts.length > 3 && React.createElement('p', { className: 'text-xs text-gray-500' },
                    `+${contact.facts.length - 3} more insights`
                  )
                )
              )
            )
          )
        ),

        filteredContacts.length === 0 && React.createElement('div', { className: 'text-center py-12' },
          React.createElement(Icon, { name: 'users', className: 'w-12 h-12 text-gray-400 mx-auto mb-4' }),
          React.createElement('h3', { className: 'text-lg font-medium text-gray-900 mb-2' },
            searchTerm ? 'No contacts found' : 'No contacts yet'
          ),
          React.createElement('p', { className: 'text-gray-600' },
            searchTerm 
              ? 'Try adjusting your search terms.' 
              : 'Start by adding an interaction to create your first contact.'
          )
        )
      )
    )
  );
};

// Render the app
ReactDOM.render(React.createElement(ContextualApp), document.getElementById('root'));