'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { SessionManager } from '@/lib/session-storage';
import { 
  Settings, 
  Trash2, 
  Clock, 
  User, 
  HardDrive,
  AlertCircle,
  Database
} from 'lucide-react';

interface SessionManagerUIProps {
  currentSessionId?: string | null;
  onSessionLoad?: (sessionId: string) => void;
  onSessionDelete?: (sessionId: string) => void;
}

export function SessionManagerUI({ currentSessionId, onSessionLoad, onSessionDelete }: SessionManagerUIProps) {
  const [sessions, setSessions] = useState<Array<any>>([]);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, percentage: 0 });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
      loadStorageInfo();
    }
  }, [isOpen]);

  const loadSessions = () => {
    const allSessions = SessionManager.getAllSessions();
    setSessions(allSessions);
  };

  const loadStorageInfo = () => {
    const info = SessionManager.getStorageInfo();
    setStorageInfo(info);
  };

  const handleDeleteSession = (sessionId: string) => {
    SessionManager.deleteSession(sessionId);
    loadSessions();
    loadStorageInfo();
    onSessionDelete?.(sessionId);
  };

  const handleLoadSession = (sessionId: string) => {
    SessionManager.updateCurrentSession(sessionId);
    setIsOpen(false);
    onSessionLoad?.(sessionId);
  };

  const handleCleanup = () => {
    SessionManager.cleanupExpiredSessions(7); // Clean up sessions older than 7 days
    loadSessions();
    loadStorageInfo();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }
    return `${Math.round(kb / 1024 * 10) / 10} MB`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          Sessions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Session Management
          </DialogTitle>
        </DialogHeader>

        {/* Storage Info */}
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Storage Usage</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanup}
                className="text-xs"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Cleanup Old
              </Button>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageInfo.percentage > 80 ? 'bg-red-500' :
                  storageInfo.percentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{formatSize(storageInfo.used)} used</span>
              <span>{storageInfo.percentage}% of estimated limit</span>
            </div>
          </Card>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Saved Sessions ({sessions.length})</h3>
            {sessions.length > 0 && (
              <span className="text-xs text-gray-500">
                Most recent first
              </span>
            )}
          </div>

          {sessions.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No saved sessions found</p>
              <p className="text-sm text-gray-400 mt-1">
                Sessions are automatically saved when you upload a CliftonStrengths report
              </p>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card 
                key={session.sessionId} 
                className={`p-4 transition-all duration-200 ${
                  currentSessionId === session.sessionId 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{session.userId}</span>
                      </div>
                      <div className="flex gap-2">
                        {session.isDemoMode && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                            Demo
                          </Badge>
                        )}
                        {currentSessionId === session.sessionId && (
                          <Badge variant="default" className="bg-blue-100 text-blue-700 text-xs">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Created: {formatDate(session.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Last used: {formatDate(session.lastAccessedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentSessionId !== session.sessionId && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadSession(session.sessionId)}
                      >
                        Load
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSession(session.sessionId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> Sessions are stored locally in your browser. They will persist between visits 
            but won't be available on other devices. Sessions older than 30 days are automatically cleaned up.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SessionManagerUI;