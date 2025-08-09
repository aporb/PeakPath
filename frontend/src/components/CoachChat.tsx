'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, Strength } from '../types/strength';
import LoadingSpinner from './LoadingSpinner';

interface CoachChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string, strengthContext?: string) => Promise<void>;
  isTyping?: boolean;
  className?: string;
  relatedStrengths?: Strength[];
}

export default function CoachChat({ 
  messages, 
  onSendMessage, 
  isTyping = false, 
  className = '',
  relatedStrengths = []
}: CoachChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedStrength, setSelectedStrength] = useState<string | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageToSend = inputMessage.trim();
    setInputMessage('');
    
    try {
      await onSendMessage(messageToSend, selectedStrength);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Could show error state here
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleQuickAction = async (action: string) => {
    await onSendMessage(action, selectedStrength);
  };

  const quickActions = [
    "How can I leverage my top strengths today?",
    "What are some blind spots I should be aware of?", 
    "Help me with a career development plan",
    "How do my strengths complement my team?",
    "What are some practical development activities?"
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg backdrop-blur-sm bg-opacity-95 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Strengths Coach</h3>
            <p className="text-xs text-gray-500">
              {isTyping ? 'Typing...' : 'Ready to help you grow'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg 
            className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Strength Context Selector */}
      {relatedStrengths.length > 0 && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <label className="text-xs font-medium text-gray-700 mb-2 block">
            Focus on specific strength (optional):
          </label>
          <select
            value={selectedStrength || ''}
            onChange={(e) => setSelectedStrength(e.target.value || undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All strengths</option>
            {relatedStrengths.map((strength) => (
              <option key={strength.id} value={strength.name}>
                {strength.name} (#{strength.rank})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isExpanded ? 'h-96' : 'h-64'}`}>
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 mb-2">Ready to unlock your potential?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Ask me anything about your strengths, career development, or how to apply your talents.
            </p>
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Quick starters:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickActions.slice(0, 3).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.strengthContext && (
                <div className="text-xs opacity-75 mb-1">
                  💪 {message.strengthContext}
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[80%]">
              <LoadingSpinner size="sm" className="my-1" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions (when chat has messages) */}
      {messages.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 2).map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={selectedStrength ? `Ask about ${selectedStrength}...` : "Ask about your strengths..."}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

// Floating chat widget that can be embedded anywhere
interface FloatingChatProps extends CoachChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function FloatingChat({ isOpen, onToggle, ...chatProps }: FloatingChatProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-96 h-[600px] mb-4">
          <CoachChat {...chatProps} className="h-full" />
        </div>
      ) : null}
      
      <button
        onClick={onToggle}
        className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700' 
            : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:shadow-xl transform hover:scale-105'
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}