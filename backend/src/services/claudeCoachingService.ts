/**
 * Claude Coaching Service
 * Integrates with Anthropic's Claude API for personalized strengths-based coaching
 */

import Anthropic from '@anthropic-ai/sdk';
import { 
  CoachingRequest, 
  CoachingResponse, 
  AnalysisRequest, 
  AnalysisResponse,
  CoachingRequestType,
  ClaudeServiceConfig,
  ServiceError,
  StrengthInsight,
  DomainAnalysis,
  CoachingSession
} from '../types/coaching';
import { UserProfile, StrengthDomain } from '../types/clifton-strengths';

export class ClaudeCoachingService {
  private anthropic: Anthropic;
  private config: ClaudeServiceConfig;
  private rateLimitTracker: Map<string, number[]> = new Map();

  private readonly SYSTEM_PROMPT = `You are an expert CliftonStrengths coach with 15+ years of experience. You help people unlock their potential through personalized, strengths-based coaching conversations.

CRITICAL: You must ALWAYS stay in character as a coach. NEVER include any meta-commentary, coaching strategy explanations, or bracketed notes about your approach in your responses. Your responses should read like natural conversation with a skilled coach.

Your deep expertise includes:
- Intimate knowledge of all 34 CliftonStrengths themes and their interactions
- Understanding how different combinations create unique patterns and potential
- Ability to spot patterns in how someone's strengths show up in their life
- Experience helping people apply their strengths to real challenges

Your coaching approach:
- Be genuinely curious and interested in their unique story
- Ask insightful questions that help them discover new perspectives about their strengths
- Reference their specific strengths by name and ranking
- Connect their strengths to their actual life and work situations  
- Help them see how their themes work together as a system
- Guide them toward practical actions they can take

Conversation style:
- Natural, warm, and conversational - like talking to a trusted mentor
- Ask follow-up questions based on what they share
- Reference details from earlier in the conversation
- Vary your sentence structure and avoid formulaic responses
- Balance encouragement with gentle challenges
- End with thoughtful questions that deepen the exploration

Remember: You are having a conversation, not giving a lecture. Keep responses concise, engaging, and focused on THEIR story and growth. Never break character or explain your coaching methodology.`;

  constructor(config: ClaudeServiceConfig) {
    this.config = {
      model: 'claude-3-5-sonnet-20241022',
      maxTokens: 4096,
      temperature: 0.7,
      rateLimiting: {
        requestsPerMinute: 50,
        requestsPerHour: 1000
      },
      ...config
    };

    this.anthropic = new Anthropic({
      apiKey: config.apiKey
    });
  }

  /**
   * Generate personalized coaching insights based on strengths profile and user query
   */
  async generateCoachingResponse(request: CoachingRequest): Promise<CoachingResponse> {
    try {
      await this.checkRateLimit();

      const contextualPrompt = this.buildContextualPrompt(request);
      
      const response = await this.anthropic.messages.create({
        model: this.config.model!,
        max_tokens: this.config.maxTokens!,
        temperature: this.config.temperature,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: contextualPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new ServiceError('Unexpected response format from Claude API', 'API_ERROR');
      }

      return this.parseCoachingResponse(content.text, request);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generate streaming coaching response
   */
  async generateStreamingCoachingResponse(request: CoachingRequest): Promise<AsyncIterable<string>> {
    try {
      await this.checkRateLimit();

      const contextualPrompt = this.buildContextualPrompt(request);
      
      const stream = this.anthropic.messages.stream({
        model: this.config.model!,
        max_tokens: this.config.maxTokens!,
        temperature: this.config.temperature,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: contextualPrompt
          }
        ]
      });

      // Return async generator that yields text chunks
      return this.createTextStreamGenerator(stream);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create an async generator that yields text chunks from the stream
   */
  private async* createTextStreamGenerator(stream: any): AsyncGenerator<string, void, unknown> {
    try {
      let buffer = '';
      let isInBracket = false;
      
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
          const text = chunk.delta.text;
          buffer += text;
          
          // Simple streaming filter to catch obvious meta-commentary
          for (const char of text) {
            if (char === '[') {
              isInBracket = true;
              continue;
            }
            if (char === ']') {
              isInBracket = false;
              continue;
            }
            
            // Only yield characters that are not inside brackets
            if (!isInBracket) {
              yield char;
            }
          }
        }
      }
      
      // At the end, apply full cleaning to any remaining content in case we missed something
      const cleaned = this.cleanCoachingResponse(buffer);
      if (cleaned !== buffer) {
        // If we had to clean more content, it means some meta-commentary slipped through
        // This is a backup - the system prompt should prevent this
        console.warn('Meta-commentary detected in streaming response - cleaned');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Analyze strengths profile and generate comprehensive insights
   */
  async analyzeStrengthsProfile(request: AnalysisRequest, profile: UserProfile): Promise<AnalysisResponse> {
    try {
      await this.checkRateLimit();

      const analysisPrompt = this.buildAnalysisPrompt(profile, request.analysisType || 'comprehensive');

      const response = await this.anthropic.messages.create({
        model: this.config.model!,
        max_tokens: this.config.maxTokens!,
        temperature: 0.5, // Lower temperature for more consistent analysis
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new ServiceError('Unexpected response format from Claude API', 'API_ERROR');
      }

      return this.parseAnalysisResponse(content.text, profile);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Build contextual prompt based on coaching request type and user profile
   */
  private buildContextualPrompt(request: CoachingRequest): string {
    let prompt = '';

    // Add strengths profile context if available
    if (request.strengthsProfile) {
      const profile = request.strengthsProfile;
      const assessmentDate = profile.assessmentDate instanceof Date 
        ? profile.assessmentDate.toISOString().split('T')[0]
        : new Date(profile.assessmentDate).toISOString().split('T')[0];
      
      prompt += `User's CliftonStrengths Profile:
Name: ${profile.name}
Assessment Date: ${assessmentDate}
Format: ${profile.format}
Leading Domain: ${profile.leadingDomain}

Top 5 Strengths:
${profile.topFive.map((s, i) => `${i + 1}. ${s.name} (${s.domain})`).join('\n')}

Domain Distribution:
${profile.domainSummary.map(d => `${d.domain}: ${d.count} strengths`).join('\n')}

`;
    }

    // Add request-specific context
    switch (request.type) {
      case CoachingRequestType.SUMMARY:
        prompt += `Please provide a comprehensive summary of this person's strengths profile, highlighting their key themes, dominant domains, and how their strengths work together.`;
        break;
      
      case CoachingRequestType.DEEP_DIVE:
        prompt += `Please provide a deep dive analysis focusing on: "${request.message}". 
        
Include:
- How their top strengths relate to this topic
- Specific strategies leveraging their strengths
- Potential blind spots to watch for
- Actionable next steps`;
        break;
      
      case CoachingRequestType.GROWTH_PLANNING:
        prompt += `Help create a growth plan based on their strengths profile. Focus area: "${request.message}"
        
Please include:
- Strength-based development opportunities
- Specific goals aligned with their top themes
- Practical action steps
- Ways to leverage existing strengths for growth`;
        break;
      
      case CoachingRequestType.GENERAL_CHAT:
      default:
        prompt += `User question: "${request.message}"
        
Please provide personalized coaching advice based on their strengths profile.`;
        break;
    }

    // Add additional context if provided
    if (request.context) {
      prompt += `\n\nAdditional Context: ${request.context}`;
    }

    return prompt;
  }

  /**
   * Build analysis prompt for comprehensive strengths analysis
   */
  private buildAnalysisPrompt(profile: UserProfile, analysisType: string): string {
    const assessmentDate = profile.assessmentDate instanceof Date 
      ? profile.assessmentDate.toISOString().split('T')[0]
      : new Date(profile.assessmentDate).toISOString().split('T')[0];
    
    return `Please provide a comprehensive analysis of this CliftonStrengths profile:

Name: ${profile.name}
Assessment Date: ${assessmentDate}
Format: ${profile.format}

All Strengths (in order):
${profile.strengths.map((s, i) => `${i + 1}. ${s.name} (${s.domain})`).join('\n')}

Domain Distribution:
${profile.domainSummary.map(d => `${d.domain}: ${d.count} strengths (${((d.count / profile.strengths.length) * 100).toFixed(1)}%)`).join('\n')}

Analysis Type: ${analysisType}

Please provide:
1. Personalized insights for each top 5 strength
2. Overall profile summary and key themes
3. Domain-specific analysis and leadership style
4. Growth opportunities and development recommendations
5. Potential blind spots or areas to watch

Format your response as structured JSON with the following fields:
- strengthInsights: array of insights for each top 5 strength
- summary: overall profile summary
- recommendations: array of development recommendations
- dominantDomains: array of domain analyses
- growthOpportunities: array of growth opportunities`;
  }

  /**
   * Clean response to remove any meta-commentary or coaching explanations
   */
  private cleanCoachingResponse(response: string): string {
    // Remove any content in brackets that looks like meta-commentary
    let cleaned = response.replace(/\[.*?\]/gs, '');
    
    // Remove any lines that start with coaching strategy explanations
    cleaned = cleaned.replace(/^(This response aims to|I'm keeping|My approach here|The strategy is).*$/gm, '');
    
    // Remove multiple consecutive newlines
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Trim whitespace
    return cleaned.trim();
  }

  /**
   * Parse Claude's response into structured coaching response
   */
  private parseCoachingResponse(claudeResponse: string, request: CoachingRequest): CoachingResponse {
    try {
      // Clean the response first to remove any meta-commentary
      const cleanedResponse = this.cleanCoachingResponse(claudeResponse);
      
      // Try to extract structured information from the response
      const suggestions = this.extractSuggestions(cleanedResponse);
      const followUpQuestions = this.extractFollowUpQuestions(cleanedResponse);

      return {
        response: cleanedResponse,
        suggestions: suggestions,
        sessionId: request.sessionId || this.generateSessionId(),
        timestamp: new Date().toISOString(),
        type: request.type,
        followUpQuestions: followUpQuestions.length > 0 ? followUpQuestions : undefined,
        confidence: 0.85 // Default confidence score
      };
    } catch (error) {
      throw new ServiceError('Failed to parse coaching response', 'PARSING_ERROR', error);
    }
  }

  /**
   * Parse Claude's analysis response into structured format
   */
  private parseAnalysisResponse(claudeResponse: string, profile: UserProfile): AnalysisResponse {
    try {
      // Try to parse as JSON first, fall back to text parsing
      let parsedData;
      try {
        parsedData = JSON.parse(claudeResponse);
      } catch {
        // Fallback: parse from text structure
        parsedData = this.parseAnalysisFromText(claudeResponse, profile);
      }

      return {
        strengths: parsedData.strengthInsights || this.generateDefaultStrengthInsights(profile),
        summary: parsedData.summary || 'Comprehensive strengths analysis completed.',
        recommendations: parsedData.recommendations || [],
        dominantDomains: parsedData.dominantDomains || this.generateDomainAnalysis(profile),
        growthOpportunities: parsedData.growthOpportunities || [],
        analyzedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new ServiceError('Failed to parse analysis response', 'PARSING_ERROR', error);
    }
  }

  /**
   * Extract actionable suggestions from Claude's response
   */
  private extractSuggestions(response: string): string[] {
    const suggestions = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[\-\*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
        const suggestion = trimmed.replace(/^[\-\*•\d\.\s]+/, '').trim();
        if (suggestion.length > 0) {
          suggestions.push(suggestion);
        }
      }
    }

    return suggestions.slice(0, 5); // Limit to top 5 suggestions
  }

  /**
   * Extract follow-up questions from Claude's response
   */
  private extractFollowUpQuestions(response: string): string[] {
    const questions = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.endsWith('?') && trimmed.length > 10) {
        questions.push(trimmed);
      }
    }

    return questions.slice(0, 3); // Limit to 3 questions
  }

  /**
   * Generate default strength insights if parsing fails
   */
  private generateDefaultStrengthInsights(profile: UserProfile): StrengthInsight[] {
    return profile.topFive.map(strength => ({
      name: strength.name,
      rank: strength.rank,
      domain: strength.domain,
      personalizedDescription: strength.description || `Your ${strength.name} strength is in the ${strength.domain} domain.`,
      leverageStrategy: `Focus on applying your ${strength.name} strength in your daily activities.`,
      potentialBlindSpots: [`Overusing ${strength.name} without considering other perspectives.`],
      confidence: 0.7
    }));
  }

  /**
   * Generate domain analysis based on profile
   */
  private generateDomainAnalysis(profile: UserProfile): DomainAnalysis[] {
    return profile.domainSummary.map(domain => ({
      domain: domain.domain,
      strengthCount: domain.count,
      percentage: (domain.count / profile.strengths.length) * 100,
      insights: `You have ${domain.count} strengths in the ${domain.domain} domain.`,
      leadershipStyle: this.getLeadershipStyleForDomain(domain.domain)
    }));
  }

  /**
   * Get leadership style description for domain
   */
  private getLeadershipStyleForDomain(domain: string): string {
    switch (domain) {
      case StrengthDomain.EXECUTING:
        return 'Task-oriented leadership focused on getting things done';
      case StrengthDomain.INFLUENCING:
        return 'Inspirational leadership that motivates and directs others';
      case StrengthDomain.RELATIONSHIP_BUILDING:
        return 'People-focused leadership that builds strong teams';
      case StrengthDomain.STRATEGIC_THINKING:
        return 'Visionary leadership that provides direction and focus';
      default:
        return 'Balanced leadership approach';
    }
  }

  /**
   * Parse analysis from unstructured text
   */
  private parseAnalysisFromText(text: string, profile: UserProfile): any {
    // Fallback parsing logic for when JSON parsing fails
    return {
      strengthInsights: this.generateDefaultStrengthInsights(profile),
      summary: text.substring(0, 500) + '...',
      recommendations: this.extractSuggestions(text),
      dominantDomains: this.generateDomainAnalysis(profile),
      growthOpportunities: []
    };
  }

  /**
   * Rate limiting implementation
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const minute = Math.floor(now / 60000);
    const hour = Math.floor(now / 3600000);
    
    const minuteKey = `minute_${minute}`;
    const hourKey = `hour_${hour}`;
    
    const minuteRequests = this.rateLimitTracker.get(minuteKey) || [];
    const hourRequests = this.rateLimitTracker.get(hourKey) || [];
    
    if (minuteRequests.length >= this.config.rateLimiting!.requestsPerMinute) {
      throw new ServiceError('Rate limit exceeded: too many requests per minute', 'RATE_LIMIT');
    }
    
    if (hourRequests.length >= this.config.rateLimiting!.requestsPerHour) {
      throw new ServiceError('Rate limit exceeded: too many requests per hour', 'RATE_LIMIT');
    }
    
    minuteRequests.push(now);
    hourRequests.push(now);
    
    this.rateLimitTracker.set(minuteKey, minuteRequests);
    this.rateLimitTracker.set(hourKey, hourRequests);
    
    // Clean up old entries
    this.cleanupRateLimitTracker();
  }

  /**
   * Clean up rate limit tracking data
   */
  private cleanupRateLimitTracker(): void {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    for (const [key, timestamps] of this.rateLimitTracker.entries()) {
      const validTimestamps = timestamps.filter(ts => ts > oneHourAgo);
      if (validTimestamps.length === 0) {
        this.rateLimitTracker.delete(key);
      } else {
        this.rateLimitTracker.set(key, validTimestamps);
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Handle and format errors
   */
  private handleError(error: any): ServiceError {
    if (error instanceof ServiceError) {
      return error;
    }

    if (error.name === 'RateLimitError') {
      return new ServiceError('Rate limit exceeded', 'RATE_LIMIT', error);
    }

    if (error.name === 'AuthenticationError') {
      return new ServiceError('Invalid API key', 'CONFIG_ERROR', error);
    }

    if (error.name === 'APIError') {
      return new ServiceError('Claude API error', 'API_ERROR', error);
    }

    return new ServiceError('Unexpected error occurred', 'API_ERROR', error);
  }

  /**
   * Update system prompt (useful for testing or customization)
   */
  public updateSystemPrompt(newPrompt: string): void {
    // This method allows updating the system prompt
    // Note: This would require modifying the private readonly SYSTEM_PROMPT
    // For now, this is a placeholder for future extensibility
    console.warn('System prompt update requested. This feature requires service restart to take effect.');
  }
}

// Utility function to create service instance
export function createClaudeCoachingService(apiKey: string, config?: Partial<ClaudeServiceConfig>): ClaudeCoachingService {
  return new ClaudeCoachingService({
    apiKey,
    ...config
  });
}