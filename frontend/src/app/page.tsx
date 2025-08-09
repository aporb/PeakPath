'use client';

import { useState, useCallback } from 'react';
import { StrengthProfile, ChatMessage, Strength } from '../types/strength';
import { Dashboard, CoachChat, FloatingChat, LoadingOverlay } from '../components';

// Types for app state management
type AppState = 'upload' | 'processing' | 'dashboard' | 'error';

interface AppError {
  message: string;
  details?: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8001' : '';

export default function PeakPathApp() {
  // Main application state
  const [appState, setAppState] = useState<AppState>('upload');
  const [strengthProfile, setStrengthProfile] = useState<StrengthProfile | null>(null);
  const [appError, setAppError] = useState<AppError | null>(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [currentStrengthFocus, setCurrentStrengthFocus] = useState<string | undefined>();
  
  // Loading states
  const [uploadProgress, setUploadProgress] = useState(0);

  // API Integration Functions
  const uploadStrengthsReport = async (file: File): Promise<StrengthProfile> => {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  };

  const sendChatMessage = useCallback(async (
    message: string, 
    strengthContext?: string,
    onChunk?: (chunk: string) => void
  ): Promise<ChatMessage> => {
    const requestBody = {
      message,
      strengthContext,
      profileId: strengthProfile?.id,
      conversationHistory: chatMessages.slice(-10), // Send last 10 messages for context
      fullPDFContent: strengthProfile?.fullPDFContent, // Include full PDF text for comprehensive analysis
      strengthsProfile: strengthProfile ? {
        name: strengthProfile.userId, // Using userId as name since that's what we have
        assessmentDate: strengthProfile.assessmentDate,
        format: 'PDF Upload',
        topFive: strengthProfile.strengths.filter(s => s.isTopFive).map(s => ({
          name: s.name,
          rank: s.rank,
          domain: s.domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: s.description
        })),
        strengths: strengthProfile.strengths.map(s => ({
          name: s.name,
          rank: s.rank,
          domain: s.domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: s.description
        })),
        leadingDomain: strengthProfile.strengths[0]?.domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        domainSummary: []
      } : undefined,
    };

    // Use streaming endpoint if onChunk callback is provided
    if (onChunk) {
      const response = await fetch(`${API_BASE_URL}/api/coach/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Streaming chat failed');
      }

      let fullContent = '';
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          onChunk(chunk);
        }
      }

      return {
        id: `coach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: fullContent,
        sender: 'coach',
        timestamp: new Date(),
        strengthContext,
      };
    }

    // Fallback to non-streaming endpoint
    const response = await fetch(`${API_BASE_URL}/api/coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Chat failed');
    }

    const data = await response.json();
    
    // Transform backend response to ChatMessage format
    return {
      id: `coach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: data.coach.response,
      sender: 'coach',
      timestamp: new Date(data.coach.timestamp),
      strengthContext,
    };
  }, [strengthProfile?.id, chatMessages]);

  // File Upload Handler
  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setUploadProgress(0);
      setAppError(null);
      setAppState('processing');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const profile = await uploadStrengthsReport(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Brief pause to show completion
      setTimeout(() => {
        setStrengthProfile(profile);
        setAppState('dashboard');
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      setUploadProgress(0);
      setAppError({
        message: 'Failed to upload and process your strengths report',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      setAppState('error');
    }
  }, [uploadStrengthsReport]);

  // Chat Message Handler
  const handleSendMessage = useCallback(async (messageContent: string, strengthContext?: string) => {
    if (!messageContent.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      strengthContext,
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatTyping(true);

    // Create a streaming coach message that updates in real-time
    const coachMessageId = `coach-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const streamingCoachMessage: ChatMessage = {
      id: coachMessageId,
      content: '',
      sender: 'coach',
      timestamp: new Date(),
      strengthContext,
    };

    // Add the empty coach message that will be updated as we stream
    setChatMessages(prev => [...prev, streamingCoachMessage]);

    try {
      await sendChatMessage(messageContent, strengthContext, (chunk: string) => {
        // Update the streaming message with new chunks
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === coachMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          )
        );
      });
    } catch (error) {
      // Replace the streaming message with an error message
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === coachMessageId 
            ? {
                ...msg,
                content: 'I apologize, but I encountered an error processing your message. Please try again.'
              }
            : msg
        )
      );
    } finally {
      setIsChatTyping(false);
    }
  }, [sendChatMessage]);

  // Strength Click Handler - Opens chat with strength context, doesn't send automatic message
  const handleStrengthClick = useCallback((strength: Strength) => {
    console.log('Strength clicked:', strength.name);
    if (isChatTyping) {
      console.log('Chat is typing, ignoring click');
      return;
    }
    
    console.log('Opening chat with strength context');
    setCurrentStrengthFocus(strength.name);
    setIsChatOpen(true);
  }, [isChatTyping]);

  // Start Coaching Handler
  const handleStartCoaching = useCallback(() => {
    console.log('Start Coaching clicked');
    setIsChatOpen(true);
    if (chatMessages.length === 0) {
      const welcomeMessage = "I'd love to help you develop your strengths! What would you like to work on today?";
      console.log('Sending welcome message:', welcomeMessage);
      handleSendMessage(welcomeMessage);
    }
  }, [chatMessages.length, handleSendMessage]);

  // Reset App Handler
  const handleReset = useCallback(() => {
    setAppState('upload');
    setStrengthProfile(null);
    setAppError(null);
    setChatMessages([]);
    setIsChatOpen(false);
    setIsChatExpanded(false);
    setCurrentStrengthFocus(undefined);
    setUploadProgress(0);
  }, []);

  // Error Recovery
  const handleRetry = useCallback(() => {
    setAppError(null);
    setAppState('upload');
  }, []);

  // Render based on app state
  const renderContent = () => {
    switch (appState) {
      case 'upload':
        return (
          <Dashboard 
            onFileUpload={handleFileUpload}
            onStrengthClick={handleStrengthClick}
            onStartCoaching={handleStartCoaching}
          />
        );

      case 'processing':
        return (
          <>
            <Dashboard 
              isLoading={true}
              onFileUpload={handleFileUpload}
              onStrengthClick={handleStrengthClick}
              onStartCoaching={handleStartCoaching}
            />
            <LoadingOverlay 
              message="Analyzing your strengths report..."
              progress={uploadProgress}
            />
          </>
        );

      case 'dashboard':
        return (
          <div className={`flex h-screen ${isChatExpanded ? 'overflow-hidden' : ''}`}>
            {/* Expanded Chat Panel */}
            {isChatExpanded && (
              <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col">
                <CoachChat
                  messages={chatMessages}
                  onSendMessage={handleSendMessage}
                  isTyping={isChatTyping}
                  relatedStrengths={strengthProfile?.strengths.filter(s => s.isTopFive) || []}
                  isExpanded={true}
                  onToggleExpanded={() => setIsChatExpanded(false)}
                  initialStrengthFocus={currentStrengthFocus}
                  className="h-full"
                />
              </div>
            )}
            
            {/* Main Dashboard Content */}
            <div className={`${isChatExpanded ? 'w-2/3' : 'w-full'} overflow-auto`}>
              <Dashboard 
                profile={strengthProfile || undefined}
                onFileUpload={handleFileUpload}
                onStrengthClick={handleStrengthClick}
                onStartCoaching={handleStartCoaching}
              />
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {appError?.message || 'Something went wrong'}
              </h2>
              
              {appError?.details && (
                <p className="text-sm text-gray-600 mb-6">
                  {appError.details}
                </p>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* Floating Chat Widget - Available when profile is loaded */}
      {strengthProfile && (
        <div>
          {/* Mobile: Full-screen chat overlay */}
          {isChatOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-white">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <h3 className="font-semibold">AI Strengths Coach</h3>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <CoachChat
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    isTyping={isChatTyping}
                    relatedStrengths={strengthProfile?.strengths.filter(s => s.isTopFive) || []}
                    initialStrengthFocus={currentStrengthFocus}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Desktop: Floating chat widget */}
          {!isChatExpanded && (
            <div className="hidden md:block">
              <FloatingChat
                isOpen={isChatOpen}
                onToggle={() => setIsChatOpen(!isChatOpen)}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isTyping={isChatTyping}
                relatedStrengths={strengthProfile?.strengths.filter(s => s.isTopFive) || []}
                isExpanded={false}
                initialStrengthFocus={currentStrengthFocus}
                onToggleExpanded={() => {
                  setIsChatExpanded(true);
                  setIsChatOpen(false);
                }}
              />
            </div>
          )}
          
          {/* Mobile: Floating chat button */}
          {!isChatOpen && !isChatExpanded && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="md:hidden fixed bottom-4 right-4 z-40 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          )}

          {/* Expand Chat Button - when neither floating nor expanded is open */}
          {!isChatOpen && !isChatExpanded && (
            <button
              onClick={() => setIsChatExpanded(true)}
              className="hidden md:block fixed bottom-4 right-20 z-40 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              title="Expand chat to full panel"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
