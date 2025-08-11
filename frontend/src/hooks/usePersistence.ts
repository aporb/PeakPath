import { useState, useEffect, useCallback, useRef } from 'react';
import { EnhancedPersistenceManager, StorageOptions, UIState, UploadState } from '@/lib/enhanced-persistence';
import { StrengthProfile, ChatMessage } from '@/types/strength';

// Custom hook for persisted state
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  options: StorageOptions = {}
): [T, (value: T | ((prev: T) => T)) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load initial value
  useEffect(() => {
    let mounted = true;

    const loadValue = async () => {
      try {
        const loaded = await EnhancedPersistenceManager.load<T>(key, defaultValue, options);
        if (mounted) {
          setValue(loaded || defaultValue);
          setIsHydrated(true);
        }
      } catch (error) {
        console.error(`Failed to load persisted state for ${key}:`, error);
        setValue(defaultValue);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadValue();

    return () => {
      mounted = false;
    };
  }, [key]);

  // Persisted setter function
  const setPersistedValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    try {
      const valueToSet = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(value)
        : newValue;
      
      setValue(valueToSet);
      await EnhancedPersistenceManager.save(key, valueToSet, options);
    } catch (error) {
      console.error(`Failed to persist state for ${key}:`, error);
      // Rollback on error
      const loaded = await EnhancedPersistenceManager.load<T>(key, defaultValue, options);
      setValue(loaded || defaultValue);
    }
  }, [key, value, options]);

  return [value, setPersistedValue, isLoading];
}

// Hook for session management
export function useSession() {
  const [session, setSession] = usePersistedState<{
    profile: StrengthProfile | null;
    sessionId: string | null;
    isDemoMode: boolean;
  }>('current_session', {
    profile: null,
    sessionId: null,
    isDemoMode: false
  });

  const createSession = useCallback(async (profile: StrengthProfile, isDemoMode: boolean = false) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newSession = {
      profile,
      sessionId,
      isDemoMode
    };

    await setSession(newSession);
    return sessionId;
  }, [setSession]);

  const clearSession = useCallback(async () => {
    await setSession({
      profile: null,
      sessionId: null,
      isDemoMode: false
    });
  }, [setSession]);

  return {
    session,
    createSession,
    clearSession,
    isAuthenticated: !!session.profile
  };
}

// Hook for chat messages with real-time persistence
export function useChatMessages(sessionId: string | null) {
  const [messages, setMessages] = usePersistedState<ChatMessage[]>(
    `chat_${sessionId || 'default'}`,
    [],
    { ttl: 30 * 24 * 60 * 60 * 1000 } // 30 days
  );

  const addMessage = useCallback(async (message: ChatMessage) => {
    await setMessages(prev => [...prev, message]);
  }, [setMessages]);

  const updateMessage = useCallback(async (messageId: string, updates: Partial<ChatMessage>) => {
    await setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, ...updates }
          : msg
      )
    );
  }, [setMessages]);

  const clearMessages = useCallback(async () => {
    await setMessages([]);
  }, [setMessages]);

  return {
    messages,
    addMessage,
    updateMessage,
    clearMessages
  };
}

// Hook for UI state persistence
export function useUIState() {
  const [uiState, setUIState, isLoading] = usePersistedState<UIState>('ui_state', {
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

  const updateUIState = useCallback(async (updates: Partial<UIState>) => {
    await setUIState(prev => ({ ...prev, ...updates }));
  }, [setUIState]);

  const toggleChat = useCallback(async () => {
    await updateUIState({ chatOpen: !uiState.chatOpen });
  }, [uiState.chatOpen, updateUIState]);

  const toggleChatExpansion = useCallback(async () => {
    await updateUIState({ chatExpanded: !uiState.chatExpanded });
  }, [uiState.chatExpanded, updateUIState]);

  const setSelectedStrength = useCallback(async (strength?: string) => {
    await updateUIState({ selectedStrength: strength });
  }, [updateUIState]);

  return {
    uiState,
    updateUIState,
    toggleChat,
    toggleChatExpansion,
    setSelectedStrength,
    isLoading
  };
}

// Hook for upload recovery
export function useUploadRecovery() {
  const [activeUploads, setActiveUploads] = useState<UploadState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load active uploads on mount
  useEffect(() => {
    const loadActiveUploads = async () => {
      try {
        const uploads = await EnhancedPersistenceManager.getActiveUploads();
        setActiveUploads(uploads);
      } catch (error) {
        console.error('Failed to load active uploads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveUploads();
  }, []);

  const saveUploadState = useCallback(async (uploadState: UploadState) => {
    await EnhancedPersistenceManager.saveUploadState(uploadState);
    setActiveUploads(prev => {
      const index = prev.findIndex(upload => upload.id === uploadState.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = uploadState;
        return updated;
      }
      return [...prev, uploadState];
    });
  }, []);

  const removeUploadState = useCallback(async (uploadId: string) => {
    await EnhancedPersistenceManager.remove(`upload_${uploadId}`, { storage: 'session' });
    setActiveUploads(prev => prev.filter(upload => upload.id !== uploadId));
  }, []);

  const resumeUpload = useCallback(async (uploadId: string): Promise<UploadState | null> => {
    try {
      const uploadState = await EnhancedPersistenceManager.loadUploadState(uploadId);
      if (uploadState && uploadState.status !== 'completed') {
        return uploadState;
      }
      return null;
    } catch (error) {
      console.error(`Failed to resume upload ${uploadId}:`, error);
      return null;
    }
  }, []);

  return {
    activeUploads,
    saveUploadState,
    removeUploadState,
    resumeUpload,
    isLoading
  };
}

// Hook for cross-tab synchronization
export function useCrossTabSync() {
  const [syncEvents, setSyncEvents] = useState<Array<{ key: string; action: string; timestamp: number }>>([]);

  useEffect(() => {
    const cleanup = EnhancedPersistenceManager.setupCrossTabSync((event) => {
      setSyncEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
    });

    return cleanup;
  }, []);

  return { syncEvents };
}

// Hook for storage monitoring
export function useStorageMonitor() {
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    available: 0,
    percentage: 0,
    keys: [] as string[]
  });

  const updateStorageInfo = useCallback(() => {
    const info = EnhancedPersistenceManager.getStorageInfo();
    setStorageInfo(info);
  }, []);

  useEffect(() => {
    updateStorageInfo();
    
    // Update storage info every minute
    const interval = setInterval(updateStorageInfo, 60000);
    
    return () => clearInterval(interval);
  }, [updateStorageInfo]);

  return {
    storageInfo,
    refreshStorageInfo: updateStorageInfo,
    isNearLimit: storageInfo.percentage > 80,
    isCritical: storageInfo.percentage > 95
  };
}

// Hook for automatic data backup/restore
export function useDataBackup() {
  const exportData = useCallback(async () => {
    try {
      const { keys } = EnhancedPersistenceManager.getStorageInfo();
      const exportData: Record<string, any> = {};

      for (const key of keys) {
        const cleanKey = key.replace('peakpath_v2_', '');
        const data = await EnhancedPersistenceManager.load(cleanKey);
        if (data) {
          exportData[cleanKey] = data;
        }
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `peakpath-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }, []);

  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      for (const [key, value] of Object.entries(data)) {
        await EnhancedPersistenceManager.save(key, value);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }, []);

  return {
    exportData,
    importData
  };
}