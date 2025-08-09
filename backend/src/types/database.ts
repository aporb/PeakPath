/**
 * Database Types
 * Type definitions for SQLite database entities
 */

import { UserProfile } from './clifton-strengths';

// Local ChatMessage interface (should match frontend interface)
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  strengthContext?: string; // Related strength name
}

// Database entity interfaces
export interface DbUser {
  id: string;
  name: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface DbStrengthAssessment {
  id: string;
  user_id: string;
  assessment_date: string;
  format: 'top5' | 'top10' | 'full34';
  pdf_path?: string;
  strengths_data: string; // JSON string of UserProfile
  created_at: string;
}

export interface DbChatSession {
  id: string;
  user_id: string;
  assessment_id?: string;
  session_name?: string;
  created_at: string;
  updated_at: string;
}

export interface DbChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'coach';
  content: string;
  strength_context?: string;
  metadata?: string; // JSON string for additional data like coaching response details
  created_at: string;
}

// Utility functions to convert between database and application types
export const convertUserProfileToDb = (profile: UserProfile, userId: string, pdfPath?: string): Omit<DbStrengthAssessment, 'created_at'> => {
  return {
    id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    assessment_date: profile.assessmentDate.toISOString(),
    format: profile.format,
    pdf_path: pdfPath,
    strengths_data: JSON.stringify(profile)
  };
};

export const convertDbToUserProfile = (dbAssessment: DbStrengthAssessment): UserProfile => {
  const profile = JSON.parse(dbAssessment.strengths_data) as UserProfile;
  // Ensure dates are Date objects, not strings
  profile.assessmentDate = new Date(profile.assessmentDate);
  return profile;
};

export const convertFrontendChatToDb = (
  message: ChatMessage, 
  sessionId: string, 
  metadata?: any
): Omit<DbChatMessage, 'created_at'> => {
  return {
    id: message.id,
    session_id: sessionId,
    sender: message.sender,
    content: message.content,
    strength_context: message.strengthContext,
    metadata: metadata ? JSON.stringify(metadata) : undefined
  };
};

export const convertDbToFrontendChat = (dbMessage: DbChatMessage): ChatMessage => {
  return {
    id: dbMessage.id,
    content: dbMessage.content,
    sender: dbMessage.sender,
    timestamp: new Date(dbMessage.created_at),
    strengthContext: dbMessage.strength_context
  };
};

export interface DatabaseStats {
  users: number;
  assessments: number;
  sessions: number;
  messages: number;
}

export interface CreateUserRequest {
  name: string;
  email?: string;
}

export interface CreateSessionRequest {
  userId: string;
  assessmentId?: string;
  sessionName?: string;
}