/**
 * Database Service - SQLite integration for PeakPath
 * Handles user profiles, strength assessments, and chat history
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(__dirname, '../../data/peakpath.db');

export interface User {
  id: string;
  name: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface StrengthAssessment {
  id: string;
  user_id: string;
  assessment_date: string;
  format: 'top5' | 'top10' | 'full34';
  pdf_path?: string;
  strengths_data: string; // JSON string of strengths array
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  assessment_id?: string;
  session_name?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'coach';
  content: string;
  strength_context?: string;
  metadata?: string; // JSON string for additional data
  created_at: string;
}

export class DatabaseService {
  private db: sqlite3.Database;

  constructor() {
    // Ensure data directory exists
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('✅ Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  private initializeTables(): void {
    const createTables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Strength assessments table
      `CREATE TABLE IF NOT EXISTS strength_assessments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        assessment_date DATETIME NOT NULL,
        format TEXT NOT NULL CHECK (format IN ('top5', 'top10', 'full34')),
        pdf_path TEXT,
        strengths_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )`,

      // Chat sessions table
      `CREATE TABLE IF NOT EXISTS chat_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        assessment_id TEXT,
        session_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (assessment_id) REFERENCES strength_assessments (id)
      )`,

      // Chat messages table
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        sender TEXT NOT NULL CHECK (sender IN ('user', 'coach')),
        content TEXT NOT NULL,
        strength_context TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
      )`,

      // Indexes for better performance
      `CREATE INDEX IF NOT EXISTS idx_assessments_user_date 
       ON strength_assessments (user_id, assessment_date DESC)`,
      
      `CREATE INDEX IF NOT EXISTS idx_sessions_user 
       ON chat_sessions (user_id, updated_at DESC)`,
       
      `CREATE INDEX IF NOT EXISTS idx_messages_session_time 
       ON chat_messages (session_id, created_at)`
    ];

    createTables.forEach(query => {
      this.db.run(query, (err) => {
        if (err) {
          console.error('Error creating table:', err);
        }
      });
    });
  }

  // User operations
  async createUser(user: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (id, name, email) VALUES (?, ?, ?)`;
      const self = this; // Capture the correct 'this' reference
      this.db.run(query, [user.id, user.name, user.email], function(err) {
        if (err) {
          reject(err);
        } else {
          // Fetch the created user
          self.getUserById(user.id)
            .then(createdUser => {
              if (createdUser) {
                resolve(createdUser);
              } else {
                reject(new Error('User was created but could not be retrieved'));
              }
            })
            .catch(reject);
        }
      });
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE id = ?`;
      this.db.get(query, [id], (err, row: User) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE email = ?`;
      this.db.get(query, [email], (err, row: User) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  // Assessment operations
  async saveAssessment(assessment: Omit<StrengthAssessment, 'created_at'>): Promise<StrengthAssessment> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO strength_assessments (id, user_id, assessment_date, format, pdf_path, strengths_data)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const self = this; // Capture the correct 'this' reference
      this.db.run(query, [
        assessment.id,
        assessment.user_id,
        assessment.assessment_date,
        assessment.format,
        assessment.pdf_path,
        assessment.strengths_data
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          self.getAssessmentById(assessment.id)
            .then(createdAssessment => {
              if (createdAssessment) {
                resolve(createdAssessment);
              } else {
                reject(new Error('Assessment was created but could not be retrieved'));
              }
            })
            .catch(reject);
        }
      });
    });
  }

  async getAssessmentById(id: string): Promise<StrengthAssessment | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM strength_assessments WHERE id = ?`;
      this.db.get(query, [id], (err, row: StrengthAssessment) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  async getUserAssessments(userId: string): Promise<StrengthAssessment[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM strength_assessments 
        WHERE user_id = ? 
        ORDER BY assessment_date DESC
      `;
      this.db.all(query, [userId], (err, rows: StrengthAssessment[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  // Chat session operations
  async createChatSession(session: Omit<ChatSession, 'created_at' | 'updated_at'>): Promise<ChatSession> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO chat_sessions (id, user_id, assessment_id, session_name)
        VALUES (?, ?, ?, ?)
      `;
      const self = this; // Capture the correct 'this' reference
      this.db.run(query, [
        session.id,
        session.user_id,
        session.assessment_id,
        session.session_name
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          self.getChatSessionById(session.id)
            .then(createdSession => {
              if (createdSession) {
                resolve(createdSession);
              } else {
                reject(new Error('Chat session was created but could not be retrieved'));
              }
            })
            .catch(reject);
        }
      });
    });
  }

  async getChatSessionById(id: string): Promise<ChatSession | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM chat_sessions WHERE id = ?`;
      this.db.get(query, [id], (err, row: ChatSession) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM chat_sessions 
        WHERE user_id = ? 
        ORDER BY updated_at DESC
      `;
      this.db.all(query, [userId], (err, rows: ChatSession[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  // Chat message operations
  async saveChatMessage(message: Omit<ChatMessage, 'created_at'>): Promise<ChatMessage> {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO chat_messages (id, session_id, sender, content, strength_context, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const self = this; // Capture the correct 'this' reference
      this.db.run(query, [
        message.id,
        message.session_id,
        message.sender,
        message.content,
        message.strength_context,
        message.metadata
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          // Update session updated_at timestamp
          self.updateSessionTimestamp(message.session_id);
          
          self.getChatMessageById(message.id)
            .then(createdMessage => {
              if (createdMessage) {
                resolve(createdMessage);
              } else {
                reject(new Error('Chat message was created but could not be retrieved'));
              }
            })
            .catch(reject);
        }
      });
    });
  }

  async getChatMessageById(id: string): Promise<ChatMessage | null> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM chat_messages WHERE id = ?`;
      this.db.get(query, [id], (err, row: ChatMessage) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  async getSessionMessages(sessionId: string, limit: number = 100): Promise<ChatMessage[]> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM chat_messages 
        WHERE session_id = ? 
        ORDER BY created_at ASC 
        LIMIT ?
      `;
      this.db.all(query, [sessionId, limit], (err, rows: ChatMessage[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  async updateSessionTimestamp(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      this.db.run(query, [sessionId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Utility methods
  async getStats(): Promise<{users: number, assessments: number, sessions: number, messages: number}> {
    return new Promise((resolve, reject) => {
      const queries = [
        'SELECT COUNT(*) as count FROM users',
        'SELECT COUNT(*) as count FROM strength_assessments',
        'SELECT COUNT(*) as count FROM chat_sessions',
        'SELECT COUNT(*) as count FROM chat_messages'
      ];
      
      const results: number[] = [];
      let completed = 0;
      
      queries.forEach((query, index) => {
        this.db.get(query, [], (err, row: {count: number}) => {
          if (err) {
            reject(err);
            return;
          }
          
          results[index] = row.count;
          completed++;
          
          if (completed === queries.length) {
            resolve({
              users: results[0],
              assessments: results[1],
              sessions: results[2],
              messages: results[3]
            });
          }
        });
      });
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

// Singleton instance
let dbInstance: DatabaseService | null = null;

export const getDatabaseService = (): DatabaseService => {
  if (!dbInstance) {
    dbInstance = new DatabaseService();
  }
  return dbInstance;
};

export default DatabaseService;