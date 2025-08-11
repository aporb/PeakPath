"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Pause, 
  RotateCcw,
  X
} from 'lucide-react'

// Enhanced persistence hooks
import { useSession, useUploadRecovery, useUIState } from '@/hooks/usePersistence'
import { UploadManager, UploadOptions, UploadResult } from '@/lib/upload-manager'

interface UploadProgress {
  uploadId: string
  fileName: string
  progress: number
  status: 'uploading' | 'paused' | 'processing' | 'completed' | 'failed'
  error?: string
}

export function EnhancedLandingPage() {
  const router = useRouter()
  const { session, createSession } = useSession()
  const { activeUploads, saveUploadState, removeUploadState, resumeUpload } = useUploadRecovery()
  const { uiState, updateUIState } = useUIState()

  const [currentUpload, setCurrentUpload] = useState<UploadProgress | null>(null)
  const [uploadManager, setUploadManager] = useState<UploadManager | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  // Check for existing session and redirect
  useEffect(() => {
    if (session.profile) {
      router.push('/coach')
    }
  }, [session.profile, router])

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a PDF file')
      return
    }

    try {
      const manager = new UploadManager()
      setUploadManager(manager)

      const uploadOptions: UploadOptions = {
        chunkSize: 512 * 1024, // 512KB chunks for better progress feedback
        maxRetries: 3,
        retryDelay: 1000,
        onProgress: (progress) => {
          setCurrentUpload(prev => prev ? { ...prev, progress } : null)
        },
        onError: (error) => {
          console.error('Upload error:', error)
          setCurrentUpload(prev => prev ? { 
            ...prev, 
            status: 'failed',
            error: error.message 
          } : null)
        },
        onPause: () => {
          setCurrentUpload(prev => prev ? { ...prev, status: 'paused' } : null)
        },
        onResume: () => {
          setCurrentUpload(prev => prev ? { ...prev, status: 'uploading' } : null)
        }
      }

      // Initialize upload state
      setCurrentUpload({
        uploadId: `temp_${Date.now()}`,
        fileName: file.name,
        progress: 0,
        status: 'uploading'
      })

      const result: UploadResult = await manager.uploadFile(file, uploadOptions)

      if (result.success && result.profile) {
        // Create session with uploaded profile
        await createSession(result.profile, false)
        
        // Update UI state to remember this was a real upload
        await updateUIState({ 
          preferences: { 
            ...uiState.preferences,
            lastUploadType: 'real' as any
          }
        })

        // Clear upload state
        setCurrentUpload(null)
        setUploadManager(null)
        
        // Navigate to dashboard
        router.push('/coach')
      } else {
        setCurrentUpload({
          uploadId: result.uploadId,
          fileName: file.name,
          progress: 0,
          status: 'failed',
          error: result.error || 'Upload failed'
        })
      }
    } catch (error) {
      console.error('Upload initialization failed:', error)
      setCurrentUpload({
        uploadId: 'error',
        fileName: file.name,
        progress: 0,
        status: 'failed',
        error: error.message
      })
    }
  }, [createSession, router, updateUIState, uiState.preferences])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  // Upload control functions
  const pauseUpload = useCallback(() => {
    if (uploadManager) {
      uploadManager.pause()
    }
  }, [uploadManager])

  const resumeCurrentUpload = useCallback(() => {
    if (uploadManager) {
      uploadManager.resume()
    }
  }, [uploadManager])

  const cancelUpload = useCallback(() => {
    if (uploadManager) {
      uploadManager.cancel()
    }
    setCurrentUpload(null)
    setUploadManager(null)
  }, [uploadManager])

  // Resume previous upload
  const handleResumeUpload = useCallback(async (uploadId: string) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.pdf'
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const result = await UploadManager.resumeUpload(uploadId, file, {
          onProgress: (progress) => {
            setCurrentUpload({
              uploadId,
              fileName: file.name,
              progress,
              status: 'uploading'
            })
          }
        })

        if (result.success && result.profile) {
          await createSession(result.profile, false)
          router.push('/coach')
        }
      } catch (error) {
        console.error('Resume failed:', error)
        alert('Failed to resume upload: ' + error.message)
      }
    }
    fileInput.click()
  }, [createSession, router])

  // Demo mode
  const handleDemoMode = useCallback(async () => {
    // Load demo data (you would import this from your existing demo data)
    const { DEMO_STRENGTH_PROFILE } = await import('@/lib/demo-data')
    
    await createSession(DEMO_STRENGTH_PROFILE, true)
    await updateUIState({ 
      preferences: { 
        ...uiState.preferences,
        lastUploadType: 'demo' as any
      }
    })
    
    router.push('/coach')
  }, [createSession, router, updateUIState, uiState.preferences])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Transform Your CliftonStrengths Into AI-Powered Growth
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your CliftonStrengths assessment and get instant AI coaching, personalized
            insights, and actionable development plans tailored to your unique talent profile.
          </p>
        </div>

        {/* Active Upload Progress */}
        {currentUpload && (
          <Card className="mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Uploading: {currentUpload.fileName}
                </h3>
                <p className="text-sm text-slate-600 capitalize">
                  Status: {currentUpload.status}
                </p>
              </div>
              
              <div className="flex gap-2">
                {currentUpload.status === 'uploading' && (
                  <Button onClick={pauseUpload} size="sm" variant="outline">
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                )}
                
                {currentUpload.status === 'paused' && (
                  <Button onClick={resumeCurrentUpload} size="sm" variant="outline">
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </Button>
                )}
                
                {(currentUpload.status === 'uploading' || currentUpload.status === 'paused') && (
                  <Button onClick={cancelUpload} size="sm" variant="outline">
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>

            <Progress value={currentUpload.progress} className="mb-2" />
            <p className="text-sm text-slate-500">
              {Math.round(currentUpload.progress)}% complete
            </p>

            {currentUpload.error && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{currentUpload.error}</AlertDescription>
              </Alert>
            )}
          </Card>
        )}

        {/* Previous Upload Recovery */}
        {activeUploads.length > 0 && !currentUpload && (
          <Card className="mb-6 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <RotateCcw className="w-5 h-5 mr-2" />
              Resume Previous Upload
            </h3>
            
            <div className="space-y-3">
              {activeUploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{upload.fileName}</p>
                    <p className="text-sm text-slate-600">
                      {Math.round(upload.progress)}% complete • {upload.status}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleResumeUpload(upload.id)}
                      size="sm"
                    >
                      Resume
                    </Button>
                    <Button 
                      onClick={() => removeUploadState(upload.id)}
                      size="sm" 
                      variant="outline"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Main Upload Area */}
        {!currentUpload && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Upload Section */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Your PDF</h2>
                <p className="text-slate-600">
                  Upload your CliftonStrengths assessment for personalized analysis
                </p>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-700 mb-2">
                  Drop your PDF here or click to browse
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Supports PDF files up to 10MB
                </p>
                
                <Button
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.pdf'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileSelect(file)
                    }
                    input.click()
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Select PDF File
                </Button>
              </div>

              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  Secure Processing
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  Resume Capability
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  Instant Analysis
                </div>
              </div>
            </Card>

            {/* Demo Section */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Try Demo Mode</h2>
                <p className="text-slate-600">
                  Explore the platform with sample CliftonStrengths data
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <p className="text-slate-700">Interactive dashboard with sample strengths</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <p className="text-slate-700">AI coaching conversations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <p className="text-slate-700">Development recommendations</p>
                </div>
              </div>

              <Button 
                onClick={handleDemoMode}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Start Demo Experience
              </Button>
            </Card>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Smart PDF Parsing</h3>
            <p className="text-sm text-slate-600">Advanced AI extraction with resume capability</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Reliable Upload</h3>
            <p className="text-sm text-slate-600">Chunked uploads with automatic retry</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Persistent Sessions</h3>
            <p className="text-sm text-slate-600">Data saved across browser sessions</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Recovery Mode</h3>
            <p className="text-sm text-slate-600">Resume interrupted uploads seamlessly</p>
          </div>
        </div>
      </div>
    </div>
  )
}