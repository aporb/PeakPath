import { ChatMessage } from '@/types/strength';
import { 
  findRelevantResponses, 
  selectBestResponse, 
  DemoResponse, 
  FALLBACK_RESPONSES 
} from './demo-chat-responses';

export interface SimulationOptions {
  typingSpeed?: number; // Characters per chunk
  minDelay?: number; // Minimum delay between chunks (ms)
  maxDelay?: number; // Maximum delay between chunks (ms)
  initialThinkingTime?: number; // Delay before starting to type (ms)
  onChunk?: (chunk: string) => void; // Callback for each chunk
  strengthContext?: string;
}

export class ChatSimulator {
  private static readonly DEFAULT_OPTIONS: Required<SimulationOptions> = {
    typingSpeed: 2, // 2 characters per chunk for realistic typing
    minDelay: 30, // 30ms minimum between chunks
    maxDelay: 80, // 80ms maximum between chunks  
    initialThinkingTime: 1500, // 1.5 seconds thinking time
    onChunk: () => {}, // No-op default
    strengthContext: undefined
  };

  /**
   * Simulates a realistic chat response with streaming behavior
   */
  static async simulateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
    options: SimulationOptions = {}
  ): Promise<ChatMessage> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Find and select the best response
    const relevantResponses = findRelevantResponses(
      userMessage, 
      opts.strengthContext, 
      conversationHistory
    );
    
    const selectedResponse = selectBestResponse(relevantResponses);
    
    // Create the response message
    const responseMessage: ChatMessage = {
      id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: selectedResponse.content,
      sender: 'coach',
      timestamp: new Date(),
      strengthContext: opts.strengthContext
    };

    // Simulate initial "thinking" time
    await this.delay(opts.initialThinkingTime);

    // Stream the response character by character
    await this.streamContent(selectedResponse.content, opts);

    return responseMessage;
  }

  /**
   * Streams content character by character with realistic delays
   */
  private static async streamContent(
    content: string, 
    options: Required<SimulationOptions>
  ): Promise<void> {
    const { typingSpeed, minDelay, maxDelay, onChunk } = options;
    
    let currentIndex = 0;
    
    while (currentIndex < content.length) {
      // Determine chunk size (usually typingSpeed, but adjust for punctuation)
      let chunkSize = typingSpeed;
      
      // Slow down at punctuation for more realistic typing
      const currentChar = content[currentIndex];
      if (['.', '!', '?', '\n'].includes(currentChar)) {
        chunkSize = 1; // Single character chunks for punctuation
      }
      
      // Get the next chunk
      const chunk = content.slice(currentIndex, currentIndex + chunkSize);
      currentIndex += chunkSize;
      
      // Send chunk to callback
      onChunk(chunk);
      
      // Calculate delay based on content type
      let delay = this.randomBetween(minDelay, maxDelay);
      
      // Add extra delay for natural pauses
      if (chunk.includes('.')) delay += 200; // Pause after sentences
      if (chunk.includes('\n\n')) delay += 300; // Pause between paragraphs
      if (chunk.includes('**')) delay += 100; // Slight pause for emphasis
      
      // Wait before next chunk
      if (currentIndex < content.length) {
        await this.delay(delay);
      }
    }
  }

  /**
   * Simulates a complete conversation flow for first-time users
   */
  static async simulateWelcomeFlow(
    options: SimulationOptions = {}
  ): Promise<ChatMessage[]> {
    const messages: ChatMessage[] = [];
    
    // Welcome message
    const welcomeMessage = await this.simulateResponse(
      'hello', 
      [], 
      { ...options, initialThinkingTime: 500 }
    );
    messages.push(welcomeMessage);
    
    return messages;
  }

  /**
   * Get contextual follow-up suggestions based on response
   */
  static getFollowUpSuggestions(response: DemoResponse): string[] {
    return response.followUpSuggestions || [
      'Tell me more about this',
      'How does this apply to my situation?',
      'What should I do next?'
    ];
  }

  /**
   * Simulate thinking time before response (just delay, no streaming)
   */
  static async simulateThinking(thinkingTime: number = 1500): Promise<void> {
    await this.delay(thinkingTime);
  }

  /**
   * Get demo-appropriate quick actions based on current context
   */
  static getDemoQuickActions(strengthContext?: string): string[] {
    const baseActions = [
      "How can I leverage my top strengths today?",
      "What are some development opportunities for me?",
      "Help me understand how my strengths work together",
      "What career paths fit my strengths profile?"
    ];

    if (strengthContext) {
      const strengthSpecificActions = {
        'Strategic': [
          "How can I improve my strategic thinking?",
          "What if others don't value my strategic input?",
          "How do I communicate my strategic ideas better?"
        ],
        'Achiever': [
          "How do I avoid burnout with my high drive?",
          "How can I help my team become more productive?",
          "What goals should I set to leverage my Achiever strength?"
        ],
        'Learner': [
          "What learning approach fits my other strengths?",
          "How do I balance learning with getting work done?",
          "What should I learn next for my career?"
        ],
        'Focus': [
          "How do I maintain focus in a chaotic environment?",
          "How can I help others become more focused?",
          "What if my priorities keep changing?"
        ],
        'Responsibility': [
          "How do I avoid over-committing?",
          "How can I develop others' sense of responsibility?",
          "What if others take advantage of my reliability?"
        ]
      };

      const contextActions = strengthSpecificActions[strengthContext as keyof typeof strengthSpecificActions];
      if (contextActions) {
        return [...contextActions, ...baseActions.slice(0, 2)];
      }
    }

    return baseActions;
  }

  /**
   * Utility function for random delays
   */
  private static randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Utility function for delays
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if a message seems like a greeting or first interaction
   */
  static isGreetingMessage(message: string): boolean {
    const greetingWords = ['hello', 'hi', 'hey', 'start', 'begin', 'help'];
    const messageLower = message.toLowerCase().trim();
    
    return greetingWords.some(greeting => 
      messageLower.includes(greeting) || messageLower.startsWith(greeting)
    ) || messageLower.length < 10; // Very short messages are likely greetings
  }

  /**
   * Get conversation starters for demo mode
   */
  static getConversationStarters(): string[] {
    return [
      "How do my top 5 strengths work together?",
      "What are some blind spots I should be aware of?",
      "Help me create a development plan using my strengths",
      "How can I use my Strategic strength more effectively?",
      "What makes me unique compared to other profiles?",
      "How do I leverage my Achiever drive without burning out?",
      "What career opportunities fit my strengths combination?"
    ];
  }

  /**
   * Simulate error scenarios for testing
   */
  static async simulateError(errorType: 'network' | 'timeout' | 'generic' = 'generic'): Promise<never> {
    await this.delay(this.randomBetween(2000, 5000)); // Simulate delay before error
    
    const errors = {
      network: new Error('Demo mode: Simulated network error'),
      timeout: new Error('Demo mode: Simulated timeout error'), 
      generic: new Error('Demo mode: Simulated generic error')
    };
    
    throw errors[errorType];
  }
}