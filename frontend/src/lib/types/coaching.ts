/**
 * Coaching Types
 * Defines interfaces for Claude-powered coaching functionality
 */

import { UserProfile } from './clifton-strengths';

export enum CoachingRequestType {
  SUMMARY = 'summary',
  DEEP_DIVE = 'deep_dive',
  GROWTH_PLANNING = 'growth_planning',
  GENERAL_CHAT = 'general_chat'
}

export interface CoachingRequest {
  /** Type of coaching request */
  type: CoachingRequestType;
  
  /** User's message or question */
  message: string;
  
  /** User's strengths profile for context */
  strengthsProfile?: UserProfile;
  
  /** Session ID for conversation continuity */
  sessionId?: string;
  
  /** Additional context or previous conversation history */
  context?: string;
  
  /** Optional focus area for coaching */
  focusArea?: string;
  
  /** Full PDF content for comprehensive analysis with 200K context */
  fullPDFContent?: string;
}

export interface CoachingResponse {
  /** AI-generated coaching response */
  response: string;
  
  /** Actionable suggestions based on strengths */
  suggestions: string[];
  
  /** Session ID for tracking conversation */
  sessionId: string;
  
  /** Timestamp of the response */
  timestamp: string;
  
  /** Type of coaching provided */
  type: CoachingRequestType;
  
  /** Optional follow-up questions */
  followUpQuestions?: string[];
  
  /** Confidence score of the response (0-1) */
  confidence?: number;
}

export interface AnalysisRequest {
  /** File ID from uploaded PDF */
  fileId: string;
  
  /** Type of analysis to perform */
  analysisType?: 'comprehensive' | 'quick' | 'domain_focus';
  
  /** Optional focus on specific domains */
  focusDomains?: string[];
}

export interface AnalysisResponse {
  /** Extracted strengths analysis */
  strengths: StrengthInsight[];
  
  /** Overall summary of the profile */
  summary: string;
  
  /** Personalized recommendations */
  recommendations: string[];
  
  /** Dominant domain analysis */
  dominantDomains: DomainAnalysis[];
  
  /** Potential growth areas */
  growthOpportunities: string[];
  
  /** Timestamp of analysis */
  analyzedAt: string;
}

export interface StrengthInsight {
  /** Name of the strength */
  name: string;
  
  /** Rank in user's profile */
  rank: number;
  
  /** Domain category */
  domain: string;
  
  /** AI-generated personalized description */
  personalizedDescription: string;
  
  /** How to leverage this strength */
  leverageStrategy: string;
  
  /** Potential blind spots or overuse risks */
  potentialBlindSpots: string[];
  
  /** Confidence score for this insight */
  confidence: number;
}

export interface DomainAnalysis {
  /** Domain name */
  domain: string;
  
  /** Number of top strengths in this domain */
  strengthCount: number;
  
  /** Percentage of top strengths */
  percentage: number;
  
  /** Domain-specific insights */
  insights: string;
  
  /** How this domain shows up in leadership */
  leadershipStyle: string;
}

export interface CoachingSession {
  /** Unique session identifier */
  sessionId: string;
  
  /** User's strengths profile */
  profile: UserProfile;
  
  /** Conversation history */
  history: CoachingExchange[];
  
  /** Session start time */
  startedAt: string;
  
  /** Last activity timestamp */
  lastActivity: string;
  
  /** Session metadata */
  metadata?: {
    focusArea?: string;
    goals?: string[];
    preferences?: CoachingPreferences;
  };
}

export interface CoachingExchange {
  /** User's input */
  userMessage: string;
  
  /** AI coach response */
  coachResponse: CoachingResponse;
  
  /** Timestamp of exchange */
  timestamp: string;
  
  /** Type of coaching provided */
  type: CoachingRequestType;
}

export interface CoachingPreferences {
  /** Preferred communication style */
  communicationStyle?: 'direct' | 'supportive' | 'challenging' | 'balanced';
  
  /** Areas of focus */
  focusAreas?: string[];
  
  /** Goal timeframe */
  timeframe?: 'immediate' | 'short_term' | 'long_term';
  
  /** Preferred coaching approach */
  approach?: 'strength_based' | 'development_focused' | 'balanced';
}

export interface ClaudeServiceConfig {
  /** Anthropic API key */
  apiKey: string;
  
  /** Claude model to use */
  model?: string;
  
  /** Maximum tokens for responses */
  maxTokens?: number;
  
  /** Temperature for response generation */
  temperature?: number;
  
  /** Rate limiting configuration */
  rateLimiting?: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export class ServiceError extends Error {
  public code: 'API_ERROR' | 'RATE_LIMIT' | 'INVALID_INPUT' | 'CONFIG_ERROR' | 'PARSING_ERROR';
  public statusCode?: number;
  public details?: any;

  constructor(
    message: string, 
    code: 'API_ERROR' | 'RATE_LIMIT' | 'INVALID_INPUT' | 'CONFIG_ERROR' | 'PARSING_ERROR',
    details?: any,
    statusCode?: number
  ) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.details = details;
    this.statusCode = statusCode;
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ServiceError.prototype);
  }
}