import React, { useState, useEffect } from 'react';
import { Plus, User, Calendar, MessageCircle, Check, X, Edit, Search, Users, Brain, Clock, Tag } from 'lucide-react';

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
        text: `Did you see how late the train was yesterday?
Yeah, I wasn't even there, I was stuck at my guitar lesson.
You play guitar?
Yeah, been learning for a few months now. I just wanted to try something new after school, you know?`,
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
      case 'Profile': return <User className="w-4 h-4" />;
      case 'Event': return <Calendar className="w-4 h-4" />;
      case 'Preference': return <Tag className="w-4 h-4" />;
      case 'Relationship': return <Users className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Contextual</h1>
              <span className="text-sm text-gray-500">Personal Relations Management</span>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg ${currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('add-interaction')}
                className={`px-4 py-2 rounded-lg ${currentView === 'add-interaction' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Add Interaction
              </button>
              <button
                onClick={() => setCurrentView('contacts')}
                className={`px-4 py-2 rounded-lg ${currentView === 'contacts' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Contacts
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{contacts.length}</p>
                    <p className="text-gray-600">Contacts</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{interactions.length}</p>
                    <p className="text-gray-600">Interactions</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">
                      {contacts.reduce((total, contact) => total + contact.facts.length, 0)}
                    </p>
                    <p className="text-gray-600">Insights</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-2xl font-semibold text-gray-900">{unassignedInsights.length}</p>
                    <p className="text-gray-600">Unassigned</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Unassigned Insights */}
            {unassignedInsights.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">Unassigned Insights ({unassignedInsights.length})</h2>
                </div>
                <div className="p-6 space-y-4">
                  {unassignedInsights.map((insight) => (
                    <div key={insight.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(insight.type)}
                        <div>
                          <p className="font-medium text-gray-900">{insight.fact}</p>
                          <p className="text-sm text-gray-600">{insight.detail}</p>
                          <p className="text-xs text-gray-500">From interaction on {insight.date}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <select 
                          onChange={(e) => e.target.value && assignInsightToContact(insight, parseInt(e.target.value))}
                          className="px-3 py-1 border rounded text-sm"
                        >
                          <option value="">Assign to Contact</option>
                          {contacts.map(contact => (
                            <option key={contact.id} value={contact.id}>{contact.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setUnassignedInsights(prev => prev.filter(i => i.id !== insight.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {interactions.slice(-5).reverse().map((interaction) => {
                  const contact = contacts.find(c => c.id === interaction.contactId);
                  return (
                    <div key={interaction.id} className="py-3 border-b last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{contact?.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {interaction.text.length > 100 
                              ? interaction.text.substring(0, 100) + '...' 
                              : interaction.text}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            {interaction.extractedInsights.map((insight, idx) => (
                              <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                {insight}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{interaction.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Add Interaction View */}
        {currentView === 'add-interaction' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">Add New Interaction</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Paste your conversation text below and let our AI extract meaningful insights.
                </p>
              </div>
              <div className="p-6">
                <textarea
                  value={newInteractionText}
                  onChange={(e) => setNewInteractionText(e.target.value)}
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Paste your conversation here...&#10;&#10;Example:&#10;Did you see how late the train was yesterday?&#10;Yeah, I wasn't even there, I was stuck at my guitar lesson.&#10;You play guitar?&#10;Yeah, been learning for a few months now. I just wanted to try something new after school, you know?"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleProcessInteraction}
                    disabled={!newInteractionText.trim() || isProcessing}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4" />
                        <span>Analyze Interaction</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Insights View */}
        {currentView === 'confirm-insights' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-medium text-gray-900">New Interaction Analysis</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Original Text:</h3>
                  <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                    {newInteractionText.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-1">{line}</p>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Suggested Insights:</h3>
                  <div className="space-y-4">
                    {pendingInsights.map((insight) => (
                      <div key={insight.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(insight.type)}`}>
                              {getTypeIcon(insight.type)}
                              <span className="ml-1">[{insight.type}]</span>
                            </span>
                            <div>
                              <p className="font-medium text-gray-900">{insight.fact}</p>
                              <p className="text-sm text-gray-600">{insight.detail}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Confidence: {Math.round(insight.confidence * 100)}% | Speaker: {insight.speaker}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <select 
                              className="px-3 py-1 border rounded text-sm"
                              onChange={(e) => {
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
                              }}
                            >
                              <option value="">Select Action</option>
                              {contacts.map(contact => (
                                <option key={contact.id} value={contact.id}>Assign to {contact.name}</option>
                              ))}
                              <option value="new">Create New Contact</option>
                              <option value="unassigned">Save as Unassigned</option>
                            </select>
                            <button
                              onClick={() => setPendingInsights(prev => prev.filter(i => i.id !== insight.id))}
                              className="text-red-600 hover:text-red-800"
                              title="Delete insight"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setCurrentView('add-interaction');
                      setPendingInsights([]);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ← Back to Edit
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      setPendingInsights([]);
                      setNewInteractionText('');
                    }}
                    disabled={pendingInsights.length > 0}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {pendingInsights.length > 0 ? `${pendingInsights.length} insights pending` : 'Complete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contacts View */}
        {currentView === 'contacts' && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                      <span className="text-xs text-gray-500">
                        Last: {contact.lastInteraction}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>Key Facts ({contact.facts.length}):</strong>
                      </div>
                      {contact.facts.slice(0, 3).map((fact) => (
                        <div key={fact.id} className="flex items-start space-x-2 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getTypeColor(fact.type)}`}>
                            {getTypeIcon(fact.type)}
                            <span className="ml-1">{fact.type}</span>
                          </span>
                          <div>
                            <p className="text-gray-900">{fact.fact}</p>
                            <p className="text-gray-600 text-xs">{fact.detail}</p>
                          </div>
                        </div>
                      ))}
                      {contact.facts.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{contact.facts.length - 3} more insights
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No contacts found' : 'No contacts yet'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Try adjusting your search terms.' 
                    : 'Start by adding an interaction to create your first contact.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextualApp;