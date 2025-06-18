import React, { useState } from 'react';
import { Bot, Zap, Router as Route, TrendingUp, FileText, Send } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you with donation prioritization, route optimization, and generating insights. What would you like me to help you with today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const aiSuggestions = [
    {
      icon: Zap,
      title: 'Urgent Donation Priority',
      description: '3 high-priority donations need immediate attention',
      action: 'Show me urgent donations that expire in the next 2 hours',
      color: 'bg-red-100 text-red-700'
    },
    {
      icon: Route,
      title: 'Optimize Collection Routes',
      description: 'Generate efficient pickup routes for today',
      action: 'Create optimized pickup routes for all pending donations',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: TrendingUp,
      title: 'Weekly Trends Analysis',
      description: 'Analyze donation patterns and predict peak times',
      action: 'Analyze this week\'s donation trends and predict tomorrow\'s volumes',
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: FileText,
      title: 'Generate Impact Report',
      description: 'Create summary for international funders',
      action: 'Generate monthly impact report for stakeholders',
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    // Simulate AI response
    const aiResponse = {
      type: 'ai' as const,
      content: generateAIResponse(message),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputMessage('');
  };

  const generateAIResponse = (message: string): string => {
    if (message.toLowerCase().includes('urgent') || message.toLowerCase().includes('priority')) {
      return '🚨 **Urgent Donations Analysis:**\n\n• **Mario\'s Restaurant** - 50 prepared meals (expires in 1.5 hours)\n• **Corporate Cafeteria** - 40 lunch meals (expires in 1 hour)\n• **Grand Bakery** - 30 pastries (expires in 2 hours)\n\n**Recommended Action:** Dispatch volunteers to Corporate Cafeteria first (closest & most urgent), then Mario\'s, then Grand Bakery. Estimated total pickup time: 45 minutes.';
    }
    
    if (message.toLowerCase().includes('route') || message.toLowerCase().includes('pickup')) {
      return '🗺️ **Optimized Pickup Routes:**\n\n**Route A (High Priority):**\n1. Corporate Cafeteria (5 min)\n2. Mario\'s Restaurant (8 min)\n3. Fresh Market (12 min)\nTotal time: 25 minutes\n\n**Route B (Standard):**\n1. Grand Bakery (15 min)\n2. Event Hall (10 min)\n3. School Cafeteria (18 min)\nTotal time: 43 minutes\n\nSaving 35% travel time vs. individual trips!';
    }
    
    if (message.toLowerCase().includes('trend') || message.toLowerCase().includes('analysis')) {
      return '📊 **Weekly Trends Analysis:**\n\n• **Peak donation time:** 2-4 PM (lunch surplus)\n• **Highest volume day:** Friday (35% more donations)\n• **Most common type:** Prepared meals (45%)\n• **Average response time:** 23 minutes\n\n**Tomorrow\'s Prediction:** Expected 28 donations (based on historical patterns). Recommend having 6 volunteers available during peak hours.';
    }
    
    if (message.toLowerCase().includes('report') || message.toLowerCase().includes('impact')) {
      return '📋 **Monthly Impact Report Generated:**\n\n• **Total meals rescued:** 3,247\n• **CO2 emissions saved:** 1,623 kg\n• **Families served:** 892\n• **Partner organizations:** 67\n• **Volunteer hours:** 1,445\n\n**Key Achievements:** 23% increase in donations, 87% collection success rate. Full report has been generated and is ready for stakeholder review.';
    }
    
    return 'I can help you with donation prioritization, route optimization, trend analysis, and report generation. What specific task would you like assistance with?';
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* AI Suggestions */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Suggestions</h3>
        {aiSuggestions.map((suggestion, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleSendMessage(suggestion.action)}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${suggestion.color}`}>
                <suggestion.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{suggestion.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{suggestion.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Assistant</h3>
              <p className="text-sm text-gray-500">Smart insights and automation</p>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleInputSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask AI for insights, route optimization, or reports..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;