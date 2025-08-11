import { StrengthProfile, ChatMessage } from '@/types/strength';

// Enhanced storage interfaces
export interface StorageOptions {
  storage?: 'local' | 'session' | 'auto';
  compress?: boolean;
  encrypt?: boolean;
  ttl?: number; // Time to live in milliseconds
  crossTab?: boolean;
}

export interface StoredData<T> {
  version: string;
  timestamp: number;
  ttl?: number;
  data: T;
  metadata: {
    compressed: boolean;
    encrypted: boolean;
    sessionId: string;
    checksum: string;
  };
}

export interface UploadState {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  chunks: UploadChunk[];
  status: 'uploading' | 'paused' | 'processing' | 'completed' | 'failed';
  resumeToken: string;
  error?: string;
  createdAt: number;
}

export interface UploadChunk {
  index: number;
  size: number;
  uploaded: boolean;
  checksum: string;
}

export interface UIState {
  chatOpen: boolean;
  chatExpanded: boolean;
  selectedStrength?: string;
  activeView: 'all' | 'top5';
  selectedDomain?: string;
  theme: 'light' | 'dark' | 'auto';
  preferences: {
    autoSave: boolean;
    notifications: boolean;
    animationsEnabled: boolean;
  };
}

export interface MigrationScript {
  version: string;
  description: string;
  migrate: (data: any) => any;
  rollback?: (data: any) => any;
  validate?: (data: any) => boolean;
}

// Enhanced PersistenceManager class
export class EnhancedPersistenceManager {
  private static readonly VERSION = '2.0.0';
  private static readonly STORAGE_PREFIX = 'peakpath_v2';
  private static readonly COMPRESSION_THRESHOLD = 1000; // bytes
  
  private static migrations: MigrationScript[] = [
    {
      version: '2.0.0',
      description: 'Migrate from SessionManager to EnhancedPersistenceManager',
      migrate: (data: any) => ({
        ...data,
        version: '2.0.0',
        metadata: {
          compressed: false,
          encrypted: false,
          sessionId: data.sessionId || this.generateId(),
          checksum: this.generateChecksum(JSON.stringify(data))
        }
      }),
      validate: (data: any) => data.version === '2.0.0'
    }
  ];

  // Generate unique ID
  private static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate data checksum
  private static generateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Compress data using simple string compression
  private static compress(data: string): string {
    try {
      // Simple compression - in production, use a proper compression library
      return btoa(data).replace(/(.)\1+/g, (match, char) => `${char}${match.length}`);
    } catch {
      return data;
    }
  }

  // Decompress data
  private static decompress(data: string): string {
    try {
      const expanded = data.replace(/(.)\d+/g, (match, char) => {
        const count = parseInt(match.slice(1));
        return char.repeat(count);
      });
      return atob(expanded);
    } catch {
      return data;
    }
  }

  // Get appropriate storage
  private static getStorage(type: 'local' | 'session'): Storage {
    return type === 'session' ? sessionStorage : localStorage;
  }

  // Check if storage is available
  private static isStorageAvailable(type: 'local' | 'session'): boolean {
    try {
      const storage = this.getStorage(type);
      const testKey = `${this.STORAGE_PREFIX}_test`;
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Generate storage key
  private static getKey(key: string): string {
    return `${this.STORAGE_PREFIX}_${key}`;
  }

  // Validate stored data integrity
  private static validateData<T>(stored: StoredData<T>): boolean {
    if (!stored.data || !stored.metadata) return false;
    
    const dataString = JSON.stringify(stored.data);
    const expectedChecksum = this.generateChecksum(dataString);
    
    return stored.metadata.checksum === expectedChecksum;
  }

  // Apply migrations
  private static applyMigrations(data: any, currentVersion: string): any {
    const migrations = this.migrations.filter(m => m.version > currentVersion);
    
    let migratedData = data;
    for (const migration of migrations) {
      try {
        migratedData = migration.migrate(migratedData);
        if (migration.validate && !migration.validate(migratedData)) {
          throw new Error(`Migration ${migration.version} validation failed`);
        }
      } catch (error) {
        console.error(`Migration ${migration.version} failed:`, error);
        throw error;
      }
    }
    
    return migratedData;
  }

  // Save data with enhanced options
  static async save<T>(
    key: string, 
    data: T, 
    options: StorageOptions = {}
  ): Promise<void> {
    const opts = {
      storage: 'auto' as const,
      compress: false,
      encrypt: false,
      crossTab: true,
      ...options
    };

    try {
      const dataString = JSON.stringify(data);
      const shouldCompress = opts.compress || dataString.length > this.COMPRESSION_THRESHOLD;
      
      const storedData: StoredData<T> = {
        version: this.VERSION,
        timestamp: Date.now(),
        ttl: opts.ttl,
        data,
        metadata: {
          compressed: shouldCompress,
          encrypted: opts.encrypt,
          sessionId: this.generateId(),
          checksum: this.generateChecksum(dataString)
        }
      };

      let serializedData = JSON.stringify(storedData);
      
      if (shouldCompress) {
        serializedData = this.compress(serializedData);
      }

      // Determine storage type
      let storageType: 'local' | 'session' = 'local';
      if (opts.storage === 'session') {
        storageType = 'session';
      } else if (opts.storage === 'auto') {
        // Use localStorage for persistent data, sessionStorage for temporary
        storageType = key.includes('temp_') || key.includes('upload_') ? 'session' : 'local';
      }

      // Try primary storage, fallback if needed
      const storage = this.getStorage(storageType);
      if (!this.isStorageAvailable(storageType)) {
        const fallbackType = storageType === 'local' ? 'session' : 'local';
        if (this.isStorageAvailable(fallbackType)) {
          this.getStorage(fallbackType).setItem(this.getKey(key), serializedData);
        } else {
          throw new Error('No storage available');
        }
      } else {
        storage.setItem(this.getKey(key), serializedData);
      }

      // Cross-tab synchronization
      if (opts.crossTab && storageType === 'local') {
        window.dispatchEvent(new CustomEvent('peakpath:storage', {
          detail: { key, action: 'save', timestamp: Date.now() }
        }));
      }

    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      throw new Error(`Storage operation failed: ${error.message}`);
    }
  }

  // Load data with migration support
  static async load<T>(
    key: string, 
    defaultValue?: T,
    options: { storage?: 'local' | 'session' | 'auto' } = {}
  ): Promise<T | null> {
    const opts = { storage: 'auto' as const, ...options };

    try {
      let data: string | null = null;
      let storageType: 'local' | 'session' = 'local';

      // Determine storage type and try to load
      if (opts.storage === 'session') {
        storageType = 'session';
        data = sessionStorage.getItem(this.getKey(key));
      } else if (opts.storage === 'local') {
        storageType = 'local';
        data = localStorage.getItem(this.getKey(key));
      } else {
        // Auto mode - try both storages
        data = localStorage.getItem(this.getKey(key));
        if (!data) {
          data = sessionStorage.getItem(this.getKey(key));
          storageType = 'session';
        }
      }

      if (!data) {
        return defaultValue || null;
      }

      // Try to decompress if needed
      let parsedData: StoredData<T>;
      try {
        parsedData = JSON.parse(data);
      } catch {
        // Try decompression first
        const decompressed = this.decompress(data);
        parsedData = JSON.parse(decompressed);
      }

      // Check TTL
      if (parsedData.ttl && Date.now() > parsedData.timestamp + parsedData.ttl) {
        this.remove(key, { storage: storageType });
        return defaultValue || null;
      }

      // Validate data integrity
      if (!this.validateData(parsedData)) {
        console.warn(`Data integrity check failed for ${key}`);
        return defaultValue || null;
      }

      // Apply migrations if needed
      if (parsedData.version !== this.VERSION) {
        const migratedData = this.applyMigrations(parsedData, parsedData.version);
        // Save migrated data
        await this.save(key, migratedData.data, { storage: storageType });
        return migratedData.data;
      }

      return parsedData.data;

    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue || null;
    }
  }

  // Remove data
  static async remove(
    key: string,
    options: { storage?: 'local' | 'session' | 'auto' } = {}
  ): Promise<void> {
    const opts = { storage: 'auto' as const, ...options };

    try {
      if (opts.storage === 'auto') {
        localStorage.removeItem(this.getKey(key));
        sessionStorage.removeItem(this.getKey(key));
      } else {
        this.getStorage(opts.storage).removeItem(this.getKey(key));
      }

      // Cross-tab notification
      window.dispatchEvent(new CustomEvent('peakpath:storage', {
        detail: { key, action: 'remove', timestamp: Date.now() }
      }));
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  }

  // Upload recovery methods
  static async saveUploadState(uploadState: UploadState): Promise<void> {
    await this.save(`upload_${uploadState.id}`, uploadState, {
      storage: 'session',
      crossTab: false
    });
  }

  static async loadUploadState(uploadId: string): Promise<UploadState | null> {
    return await this.load<UploadState>(`upload_${uploadId}`, null, {
      storage: 'session'
    });
  }

  static async getActiveUploads(): Promise<UploadState[]> {
    const uploads: UploadState[] = [];
    const keys = Object.keys(sessionStorage)
      .filter(key => key.startsWith(`${this.STORAGE_PREFIX}_upload_`));
    
    for (const key of keys) {
      const uploadId = key.replace(`${this.STORAGE_PREFIX}_upload_`, '');
      const uploadState = await this.loadUploadState(uploadId);
      if (uploadState && uploadState.status !== 'completed') {
        uploads.push(uploadState);
      }
    }
    
    return uploads;
  }

  // UI State persistence
  static async saveUIState(uiState: Partial<UIState>): Promise<void> {
    const current = await this.loadUIState();
    const merged = { ...current, ...uiState };
    await this.save('ui_state', merged, { ttl: 30 * 24 * 60 * 60 * 1000 }); // 30 days
  }

  static async loadUIState(): Promise<UIState> {
    return await this.load<UIState>('ui_state', {
      chatOpen: true,
      chatExpanded: false,
      activeView: 'top5',
      theme: 'light',
      preferences: {
        autoSave: true,
        notifications: true,
        animationsEnabled: true
      }
    });
  }

  // Storage analytics
  static getStorageInfo(): {
    used: number;
    available: number;
    percentage: number;
    keys: string[];
  } {
    let totalUsed = 0;
    const keys: string[] = [];

    try {
      // Check localStorage
      for (const key in localStorage) {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          totalUsed += localStorage[key].length;
          keys.push(key);
        }
      }

      // Check sessionStorage
      for (const key in sessionStorage) {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          totalUsed += sessionStorage[key].length;
          keys.push(key);
        }
      }

      const estimatedLimit = 5 * 1024 * 1024; // 5MB
      const percentage = (totalUsed / estimatedLimit) * 100;

      return {
        used: totalUsed,
        available: estimatedLimit - totalUsed,
        percentage: Math.round(percentage * 100) / 100,
        keys
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { used: 0, available: 0, percentage: 0, keys: [] };
    }
  }

  // Cross-tab synchronization setup
  static setupCrossTabSync(callback: (event: { key: string; action: string; timestamp: number }) => void): () => void {
    const handler = (event: CustomEvent) => {
      callback(event.detail);
    };

    window.addEventListener('peakpath:storage', handler as EventListener);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('peakpath:storage', handler as EventListener);
    };
  }

  // Migration from old SessionManager
  static async migrateFromSessionManager(): Promise<void> {
    try {
      // Get all old sessions
      const sessionMetaData = localStorage.getItem('peakpath_session_meta');
      if (!sessionMetaData) return;

      const metadata = JSON.parse(sessionMetaData);
      
      for (const session of metadata.allSessions) {
        const oldSessionKey = `peakpath_user_session_${session.sessionId}`;
        const oldChatKey = `peakpath_chat_history_${session.sessionId}`;
        
        const sessionData = localStorage.getItem(oldSessionKey);
        const chatData = localStorage.getItem(oldChatKey);
        
        if (sessionData) {
          const parsedSession = JSON.parse(sessionData);
          await this.save(`session_${session.sessionId}`, parsedSession);
          localStorage.removeItem(oldSessionKey);
        }
        
        if (chatData) {
          const parsedChat = JSON.parse(chatData);
          await this.save(`chat_${session.sessionId}`, parsedChat.messages || []);
          localStorage.removeItem(oldChatKey);
        }
      }

      // Clean up old metadata
      localStorage.removeItem('peakpath_session_meta');
      
      console.log('Migration from SessionManager completed');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
}

// Initialize on module load
if (typeof window !== 'undefined') {
  // Auto-migrate on first load
  EnhancedPersistenceManager.migrateFromSessionManager().catch(console.error);
}