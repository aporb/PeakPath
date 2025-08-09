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
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  initialStrengthFocus?: string; // Add prop for initial strength context
}

export default function CoachChat({ 
  messages, 
  onSendMessage, 
  isTyping = false, 
  className = '',
  relatedStrengths = [],
  isExpanded = false,
  onToggleExpanded,
  initialStrengthFocus
}: CoachChatProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedStrength, setSelectedStrength] = useState<string | undefined>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  // Set initial strength focus when provided
  useEffect(() => {
    if (initialStrengthFocus && initialStrengthFocus !== selectedStrength) {
      setSelectedStrength(initialStrengthFocus);
    }
  }, [initialStrengthFocus, selectedStrength]);

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

  // Clean and readable message formatting
  const formatCoachMessage = (content: string): string => {
    return content
      // Bold text - keep simple
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      // Simple bullet points
      .replace(/^[\-\*]\s+(.+)$/gm, '<div class="flex items-start mb-2"><div class="w-1 h-1 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></div><span>$1</span></div>')
      // Numbered lists
      .replace(/^\d+\.\s+(.+)$/gm, '<div class="flex items-start mb-2"><span class="text-gray-500 text-sm mr-2 mt-0.5 font-medium">$&</span><span>$1</span></div>')
      // Questions - subtle highlighting
      .replace(/^(.+\?)$/gm, '<div class="bg-blue-50 rounded-lg p-3 my-3"><p class="text-gray-800">$1</p></div>')
      // Line breaks
      .replace(/\n\n/g, '<div class="my-4"></div>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg backdrop-blur-sm bg-opacity-95 flex flex-col ${className}`}>
      {/* Minimal Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 text-sm">AI Strengths Coach</h3>
            {selectedStrength && (
              <p className="text-xs text-purple-600 font-medium">💪 {selectedStrength}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {onToggleExpanded && (
            <button
              onClick={onToggleExpanded}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              title={isExpanded ? "Collapse chat" : "Expand chat"}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isExpanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6l-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg 
              className={`w-4 h-4 text-gray-500 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-3 space-y-3 ${isCollapsed ? 'h-16' : isExpanded ? 'min-h-[500px]' : 'h-80'}`}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-medium text-gray-800 mb-1 text-sm">Start a conversation</h4>
            <p className="text-xs text-gray-600 mb-4 max-w-xs">
              {selectedStrength 
                ? `Let's explore your ${selectedStrength} strength together.`
                : 'Ask me anything about your strengths or development.'
              }
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
          >
            {message.sender === 'coach' && (
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 mt-1">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
                </svg>
              </div>
            )}
            
            <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[90%]`}>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}
              >
                <div 
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: message.sender === 'coach' 
                      ? formatCoachMessage(message.content)
                      : message.content.replace(/\n/g, '<br/>')
                  }}
                />
              </div>
              
              {message.strengthContext && message.sender === 'user' && (
                <div className="mt-1 px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                  💪 {message.strengthContext}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 mt-1">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01" />
              </svg>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="text-gray-500 text-xs">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>


      {/* Compact Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={selectedStrength ? `Ask about ${selectedStrength}...` : "Ask about your strengths..."}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all duration-200 placeholder-gray-500 text-sm"
              disabled={isTyping}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isTyping ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Strength Context Display */}
        {selectedStrength && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">💪 Focusing on {selectedStrength}</span>
            <button 
              type="button"
              onClick={() => setSelectedStrength(undefined)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          </div>
        )}
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