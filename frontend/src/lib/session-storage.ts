import { StrengthProfile, ChatMessage } from '@/types/strength';

// localStorage keys
export const STORAGE_KEYS = {
  USER_SESSION: 'peakpath_user_session',
  CHAT_HISTORY: 'peakpath_chat_history',
  SESSION_METADATA: 'peakpath_session_meta'
} as const;

// Session data structure
export interface UserSession {
  profile: StrengthProfile;
  isDemoMode: boolean;
  createdAt: string;
  lastAccessedAt: string;
  sessionId: string;
}

export interface ChatSession {
  messages: ChatMessage[];
  sessionId: string;
  lastUpdatedAt: string;
}

export interface SessionMetadata {
  currentSessionId: string | null;
  allSessions: Array<{
    sessionId: string;
    userId: string;
    isDemoMode: boolean;
    createdAt: string;
    lastAccessedAt: string;
  }>;
}

// Utility functions
export class SessionManager {
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Save user session
  static saveSession(profile: StrengthProfile, isDemoMode: boolean = false): string {
    const sessionId = this.generateSessionId();
    const now = new Date().toISOString();
    
    const session: UserSession = {
      profile,
      isDemoMode,
      createdAt: now,
      lastAccessedAt: now,
      sessionId
    };

    try {
      // Save the session
      localStorage.setItem(`${STORAGE_KEYS.USER_SESSION}_${sessionId}`, JSON.stringify(session));
      
      // Update metadata
      this.updateSessionMetadata(sessionId, profile.userId, isDemoMode, now);
      
      console.log('Session saved:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to save session:', error);
      throw new Error('Unable to save session to localStorage');
    }
  }

  // Load user session
  static loadSession(sessionId?: string): UserSession | null {
    try {
      // Use current session if no sessionId provided
      const targetSessionId = sessionId || this.getCurrentSessionId();
      if (!targetSessionId) return null;

      const sessionData = localStorage.getItem(`${STORAGE_KEYS.USER_SESSION}_${targetSessionId}`);
      if (!sessionData) return null;

      const session: UserSession = JSON.parse(sessionData);
      
      // Update last accessed time
      session.lastAccessedAt = new Date().toISOString();
      localStorage.setItem(`${STORAGE_KEYS.USER_SESSION}_${targetSessionId}`, JSON.stringify(session));
      
      // Update metadata
      this.updateCurrentSession(targetSessionId);
      
      return session;
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  }

  // Save chat messages
  static saveChatHistory(sessionId: string, messages: ChatMessage[]): void {
    try {
      const chatSession: ChatSession = {
        messages,
        sessionId,
        lastUpdatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`${STORAGE_KEYS.CHAT_HISTORY}_${sessionId}`, JSON.stringify(chatSession));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }

  // Load chat messages
  static loadChatHistory(sessionId: string): ChatMessage[] {
    try {
      const chatData = localStorage.getItem(`${STORAGE_KEYS.CHAT_HISTORY}_${sessionId}`);
      if (!chatData) return [];

      const chatSession: ChatSession = JSON.parse(chatData);
      return chatSession.messages || [];
    } catch (error) {
      console.error('Failed to load chat history:', error);
      return [];
    }
  }

  // Get current active session ID
  static getCurrentSessionId(): string | null {
    try {
      const metadata = this.getSessionMetadata();
      return metadata.currentSessionId;
    } catch (error) {
      console.error('Failed to get current session ID:', error);
      return null;
    }
  }

  // Set current active session
  static updateCurrentSession(sessionId: string): void {
    try {
      const metadata = this.getSessionMetadata();
      metadata.currentSessionId = sessionId;
      localStorage.setItem(STORAGE_KEYS.SESSION_METADATA, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to update current session:', error);
    }
  }

  // Get all sessions metadata
  static getSessionMetadata(): SessionMetadata {
    try {
      const metadataString = localStorage.getItem(STORAGE_KEYS.SESSION_METADATA);
      if (!metadataString) {
        return { currentSessionId: null, allSessions: [] };
      }
      return JSON.parse(metadataString);
    } catch (error) {
      console.error('Failed to get session metadata:', error);
      return { currentSessionId: null, allSessions: [] };
    }
  }

  // Update session metadata
  private static updateSessionMetadata(sessionId: string, userId: string, isDemoMode: boolean, timestamp: string): void {
    try {
      const metadata = this.getSessionMetadata();
      
      // Remove existing session with same ID if exists
      metadata.allSessions = metadata.allSessions.filter(s => s.sessionId !== sessionId);
      
      // Add new session
      metadata.allSessions.push({
        sessionId,
        userId,
        isDemoMode,
        createdAt: timestamp,
        lastAccessedAt: timestamp
      });

      // Set as current session
      metadata.currentSessionId = sessionId;
      
      localStorage.setItem(STORAGE_KEYS.SESSION_METADATA, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to update session metadata:', error);
    }
  }

  // List all saved sessions
  static getAllSessions(): SessionMetadata['allSessions'] {
    try {
      const metadata = this.getSessionMetadata();
      return metadata.allSessions.sort((a, b) => 
        new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
      );
    } catch (error) {
      console.error('Failed to get all sessions:', error);
      return [];
    }
  }

  // Delete a specific session
  static deleteSession(sessionId: string): void {
    try {
      // Remove session data
      localStorage.removeItem(`${STORAGE_KEYS.USER_SESSION}_${sessionId}`);
      localStorage.removeItem(`${STORAGE_KEYS.CHAT_HISTORY}_${sessionId}`);
      
      // Update metadata
      const metadata = this.getSessionMetadata();
      metadata.allSessions = metadata.allSessions.filter(s => s.sessionId !== sessionId);
      
      // Clear current session if it was the deleted one
      if (metadata.currentSessionId === sessionId) {
        metadata.currentSessionId = metadata.allSessions[0]?.sessionId || null;
      }
      
      localStorage.setItem(STORAGE_KEYS.SESSION_METADATA, JSON.stringify(metadata));
      console.log('Session deleted:', sessionId);
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  // Clear current session (logout)
  static clearCurrentSession(): void {
    try {
      const metadata = this.getSessionMetadata();
      metadata.currentSessionId = null;
      localStorage.setItem(STORAGE_KEYS.SESSION_METADATA, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to clear current session:', error);
    }
  }

  // Clean up expired sessions (older than 30 days)
  static cleanupExpiredSessions(maxAgeInDays: number = 30): void {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - maxAgeInDays);
      
      const metadata = this.getSessionMetadata();
      const expiredSessions = metadata.allSessions.filter(
        session => new Date(session.lastAccessedAt) < cutoffDate
      );
      
      // Delete expired sessions
      expiredSessions.forEach(session => {
        localStorage.removeItem(`${STORAGE_KEYS.USER_SESSION}_${session.sessionId}`);
        localStorage.removeItem(`${STORAGE_KEYS.CHAT_HISTORY}_${session.sessionId}`);
      });
      
      // Update metadata
      metadata.allSessions = metadata.allSessions.filter(
        session => new Date(session.lastAccessedAt) >= cutoffDate
      );
      
      localStorage.setItem(STORAGE_KEYS.SESSION_METADATA, JSON.stringify(metadata));
      
      if (expiredSessions.length > 0) {
        console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
    }
  }

  // Get storage usage info
  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let totalUsed = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith('peakpath_')) {
          totalUsed += localStorage[key].length;
        }
      }
      
      // Estimate available space (5MB typical limit)
      const estimatedLimit = 5 * 1024 * 1024; // 5MB in bytes
      const percentage = (totalUsed / estimatedLimit) * 100;
      
      return {
        used: totalUsed,
        available: estimatedLimit - totalUsed,
        percentage: Math.round(percentage * 100) / 100
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  // Check if localStorage is available
  static isAvailable(): boolean {
    try {
      const testKey = 'peakpath_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Auto-cleanup on page load
if (typeof window !== 'undefined') {
  // Run cleanup when the module loads
  try {
    SessionManager.cleanupExpiredSessions();
  } catch (error) {
    console.error('Auto-cleanup failed:', error);
  }
}