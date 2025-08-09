'use client';

import { useState } from 'react';
import { 
  Dashboard, 
  CoachChat, 
  FloatingChat,
  StrengthProfile, 
  Strength, 
  ChatMessage, 
  StrengthDomain 
} from './index';

// Sample data for demonstration
const sampleStrengths: Strength[] = [
  {
    id: '1',
    name: 'Strategic',
    domain: StrengthDomain.STRATEGIC_THINKING,
    rank: 1,
    description: 'People who are especially talented in the Strategic theme create alternative ways to proceed. Faced with any given scenario, they can quickly spot the relevant patterns and issues.',
    isTopFive: true
  },
  {
    id: '2', 
    name: 'Achiever',
    domain: StrengthDomain.EXECUTING,
    rank: 2,
    description: 'People who are especially talented in the Achiever theme have a great deal of stamina and work hard. They take great satisfaction from being busy and productive.',
    isTopFive: true
  },
  {
    id: '3',
    name: 'Relator',
    domain: StrengthDomain.RELATIONSHIP_BUILDING,
    rank: 3,
    description: 'People who are especially talented in the Relator theme enjoy close relationships with others. They find deep satisfaction in working hard with friends to achieve a goal.',
    isTopFive: true
  },
  {
    id: '4',
    name: 'Communication',
    domain: StrengthDomain.INFLUENCING,
    rank: 4,
    description: 'People who are especially talented in the Communication theme generally find it easy to put their thoughts into words. They are good conversationalists and presenters.',
    isTopFive: true
  },
  {
    id: '5',
    name: 'Learner',
    domain: StrengthDomain.STRATEGIC_THINKING,
    rank: 5,
    description: 'People who are especially talented in the Learner theme have a great desire to learn and want to continuously improve.',
    isTopFive: true
  }
];

const sampleProfile: StrengthProfile = {
  id: 'profile-1',
  userId: 'user-1',
  strengths: sampleStrengths,
  assessmentDate: new Date('2024-01-15'),
  reportUrl: 'https://example.com/report.pdf'
};

export default function DemoApp() {
  const [profile] = useState<StrengthProfile>(sampleProfile);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedStrength, setSelectedStrength] = useState<Strength | null>(null);

  const handleFileUpload = async (file: File) => {
    // Simulate file processing
    console.log('Processing file:', file.name);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('File processed successfully');
  };

  const handleSendMessage = async (content: string, strengthContext?: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      strengthContext
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const coachMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: strengthContext 
          ? `Great question about your ${strengthContext} strength! This strength is particularly powerful because it allows you to see patterns and create alternative pathways. Here are some ways to leverage it today: 1) Take time to think through multiple scenarios before making decisions, 2) Share your strategic insights with your team, 3) Look for the bigger picture in current projects.`
          : `Thanks for your question! Based on your Top 5 strengths, I can see you have a powerful combination of Strategic thinking and Executing abilities. Your Strategic and Learner strengths help you see possibilities, while your Achiever strength drives you to make things happen. How can I help you apply these strengths in a specific situation?`,
        sender: 'coach',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, coachMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleStrengthClick = (strength: Strength) => {
    setSelectedStrength(strength);
    setChatOpen(true);
    
    // Auto-send a message about this strength
    handleSendMessage(`Tell me more about how I can develop my ${strength.name} strength.`, strength.name);
  };

  const handleStartCoaching = () => {
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Dashboard
        profile={profile}
        onFileUpload={handleFileUpload}
        onStrengthClick={handleStrengthClick}
        onStartCoaching={handleStartCoaching}
      />
      
      {/* Floating Chat Widget */}
      <FloatingChat
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        relatedStrengths={profile.strengths}
      />
    </div>
  );
}

// Alternative embedded chat layout
export function EmbeddedChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content: string, strengthContext?: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      strengthContext
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'd be happy to help you explore that! Can you tell me more about the specific situation you're facing?",
        sender: 'coach',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          PeakPath Coaching Chat Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Strengths Overview</h2>
            <div className="space-y-4">
              {sampleStrengths.map(strength => (
                <div key={strength.id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-medium">#{strength.rank} {strength.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{strength.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">AI Coaching Chat</h2>
            <CoachChat
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              relatedStrengths={sampleStrengths}
              className="h-[600px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}