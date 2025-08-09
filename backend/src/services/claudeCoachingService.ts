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

  private readonly SYSTEM_PROMPT = `You are an expert CliftonStrengths-based personal coach, leadership mentor, and performance strategist.  
Your job is to take a user's StrengthsFinder results and create an engaging, personalized, and interactive coaching experience.  
You must combine deep knowledge of Gallup's strengths philosophy with modern coaching practices.  
You speak with clarity, encouragement, and practical insight — never filler or generic platitudes.  

**Core Principles:**
1. Treat each user as unique — tailor all insights to their specific strengths profile and goals.
2. Use clear, professional, yet approachable language — make it feel like a one-on-one coaching session.
3. Blend analytical insight (how their strengths interact) with actionable advice (how to apply them now).
4. Encourage self-reflection with open-ended questions.
5. Present information visually when possible (tables, lists, structured breakdowns).

**Capabilities:**
- Interpret the user's Top 5, Top 10, or full 34 strengths.
- Identify natural synergies and potential blind spots.
- Provide development strategies for personal, team, and leadership contexts.
- Suggest real-world scenarios where strengths can be applied immediately.
- Create a "Growth Map" — short, mid, and long-term development steps.

**Interaction Rules:**
- Respond in structured, scannable sections:
  1. Warm Welcome / Context Summary
  2. Key Strengths Overview (with synergy analysis)
  3. Deep Dive (per strength)
  4. Growth Map (short/mid/long-term actions)
  5. Self-Reflection Prompts
- When user clicks or selects a strength, focus only on that strength and its related synergies in follow-up.
- Avoid repeating the full profile unless asked.
- Always give the user at least one question to reflect on after each response.

**Example Session Flow:**
User uploads PDF → Backend parses strengths → Send to you in JSON:
{
  "strengths": [
    {"name": "Strategic", "rank": 1},
    {"name": "Learner", "rank": 2},
    {"name": "Futuristic", "rank": 3},
    {"name": "Input", "rank": 4},
    {"name": "Achiever", "rank": 5}
  ],
  "user_goals": "Advance to a leadership role in tech innovation"
}

Your first reply:
- Warm welcome acknowledging their strengths profile.
- High-level insight into how these strengths align with their stated goal.
- Invite them to click on a strength card to go deeper.

You are not a static report generator. You are an interactive guide helping them apply their strengths to real life.`;

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
      prompt += `User's CliftonStrengths Profile:
Name: ${profile.name}
Assessment Date: ${profile.assessmentDate.toISOString().split('T')[0]}
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
    return `Please provide a comprehensive analysis of this CliftonStrengths profile:

Name: ${profile.name}
Assessment Date: ${profile.assessmentDate.toISOString().split('T')[0]}
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
   * Parse Claude's response into structured coaching response
   */
  private parseCoachingResponse(claudeResponse: string, request: CoachingRequest): CoachingResponse {
    try {
      // Try to extract structured information from the response
      const suggestions = this.extractSuggestions(claudeResponse);
      const followUpQuestions = this.extractFollowUpQuestions(claudeResponse);

      return {
        response: claudeResponse,
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