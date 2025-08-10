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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border-slate-200 shadow-xl">
        <DialogHeader className="pb-6 border-b border-slate-100">
          <DialogTitle className="flex items-center gap-2 text-slate-900 text-xl font-semibold">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            Session Management
          </DialogTitle>
        </DialogHeader>

        {/* Storage Info */}
        <div className="mb-8 pt-6">
          <Card className="p-5 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-900">Storage Usage</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCleanup}
                className="!bg-purple-50 !text-purple-700 hover:!bg-purple-100 hover:!text-purple-800 !border-purple-200 hover:!border-purple-300 text-xs px-3"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Cleanup Old
              </Button>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageInfo.percentage > 80 ? 'bg-red-400' :
                  storageInfo.percentage > 60 ? 'bg-yellow-400' : 'bg-blue-400'
                }`}
                style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>{formatSize(storageInfo.used)} used</span>
              <span>{storageInfo.percentage}% of estimated limit</span>
            </div>
          </Card>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Saved Sessions ({sessions.length})</h3>
            {sessions.length > 0 && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                Most recent first
              </span>
            )}
          </div>

          {sessions.length === 0 ? (
            <Card className="p-8 text-center bg-slate-50 border-slate-200">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">No saved sessions found</p>
              <p className="text-sm text-slate-500 mt-2">
                Sessions are automatically saved when you upload a CliftonStrengths report
              </p>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card 
                key={session.sessionId} 
                className={`p-5 transition-all duration-200 border ${
                  currentSessionId === session.sessionId 
                    ? 'border-blue-400 bg-blue-50/80 shadow-sm' 
                    : 'border-slate-200 bg-white hover:shadow-md hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                        <span className="font-semibold text-slate-900 truncate" title={session.userId}>
                          {session.userId}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {session.isDemoMode && (
                          <Badge variant="secondary" className="!bg-purple-100 !text-purple-700 text-xs font-medium px-2 py-1">
                            Demo
                          </Badge>
                        )}
                        {currentSessionId === session.sessionId && (
                          <Badge variant="default" className="!bg-blue-100 !text-blue-700 text-xs font-medium px-2 py-1">
                            Current
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>Created: {formatDate(session.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Last used: {formatDate(session.lastAccessedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {currentSessionId !== session.sessionId && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleLoadSession(session.sessionId)}
                        className="!bg-blue-50 !text-blue-700 hover:!bg-blue-100 hover:!text-blue-800 !border-blue-200 hover:!border-blue-300"
                      >
                        Load
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteSession(session.sessionId)}
                      className="!bg-red-50 !text-red-600 hover:!bg-red-100 hover:!text-red-700 !border-red-200 hover:!border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Note:</strong> Sessions are stored locally in your browser. They will persist between visits 
            but won't be available on other devices. Sessions older than 30 days are automatically cleaned up.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SessionManagerUI;