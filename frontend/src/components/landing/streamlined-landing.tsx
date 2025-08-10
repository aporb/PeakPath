"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClickableLogo } from "@/components/ClickableLogo"
import {
  Upload,
  Brain,
  MessageSquare,
  BarChart3,
  FileText,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Github,
} from "lucide-react"

export function StreamlinedLanding() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadStep, setUploadStep] = useState(0)
  const [isRealUpload, setIsRealUpload] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const finalCTAInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files && files[0] && files[0].type === 'application/pdf') {
      handleRealFileUpload(files[0])
    } else if (files && files[0]) {
      setUploadError('Please upload a PDF file')
      setTimeout(() => setUploadError(null), 3000)
    } else {
      // Fallback to demo
      simulateUpload()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === 'application/pdf') {
        handleRealFileUpload(file)
      } else {
        setUploadError('Please upload a PDF file')
        setTimeout(() => setUploadError(null), 3000)
      }
    }
  }

  // Handle file selection from the bottom CTA with scroll to top
  const handleFileSelectWithScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Scroll to top to show the upload progress
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      const file = e.target.files[0]
      if (file.type === 'application/pdf') {
        handleRealFileUpload(file)
      } else {
        setUploadError('Please upload a PDF file')
        setTimeout(() => setUploadError(null), 3000)
      }
    }
  }

  // Real upload function that processes PDF
  const handleRealFileUpload = async (file: File) => {
    try {
      setIsRealUpload(true)
      setUploadError(null)
      setUploadStep(1)
      
      const formData = new FormData()
      formData.append('pdf', file)
      
      const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''
      
      setTimeout(() => setUploadStep(2), 1000)
      
      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`)
      }
      
      const profile = await response.json()
      
      // Store the profile in sessionStorage for the coach page
      sessionStorage.setItem('strengthProfile', JSON.stringify(profile))
      
      setUploadStep(3)
      setTimeout(() => {
        window.location.href = '/coach'
      }, 1500)
      
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
      setUploadStep(0)
      setIsRealUpload(false)
      setTimeout(() => setUploadError(null), 5000)
    }
  }

  const simulateUpload = () => {
    setIsRealUpload(false)
    setUploadStep(1)
    setTimeout(() => setUploadStep(2), 2000)
    setTimeout(() => setUploadStep(3), 4000)
    setTimeout(() => {
      // Set demo mode flag for coach page
      sessionStorage.setItem('demoMode', 'true')
      // Redirect to the actual coaching app
      window.location.href = '/coach'
    }, 6000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <ClickableLogo />
          <a
            href="https://github.com/aporb/PeakPath"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                Transform Your <span className="text-slate-800">CliftonStrengths</span>
                <br />
                Into AI-Powered Growth
              </h1>

              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Upload your CliftonStrengths assessment and get instant AI coaching, personalized insights, and
                actionable development plans tailored to your unique talent profile.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Secure Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Claude AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Instant Analysis</span>
              </div>
            </div>
          </div>

          {/* Upload Error Display */}
          {uploadError && (
            <div className="mb-6 max-w-2xl mx-auto">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                <p className="font-medium">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Upload Section - Main CTA */}
          <div className="mb-20">
            <Card className="relative overflow-hidden bg-white border-2 border-dashed border-slate-300 hover:border-slate-400 transition-all duration-300 max-w-2xl mx-auto">
              <div
                className={`p-12 text-center transition-all duration-300 ${
                  isDragOver ? "bg-slate-50 border-slate-400" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadStep === 0 && (
                  <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">Upload Your CliftonStrengths PDF</h3>
                      <p className="text-slate-600 mb-6">
                        Drag and drop your assessment or click to browse. Supports Top 5, Top 10, and Full 34 reports.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button 
                        size="lg" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Choose File or Drop Here
                      </Button>
                      <p className="text-xs text-slate-500">
                        Your data is processed securely and never stored permanently
                      </p>
                      <div className="pt-4 border-t border-slate-200">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={simulateUpload}
                          className="!bg-purple-50 !text-purple-700 hover:!bg-purple-100 hover:!text-purple-800 !border-purple-200 hover:!border-purple-300 transition-all duration-200"
                        >
                          Try Demo Instead
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {uploadStep === 1 && (
                  <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                      <FileText className="w-8 h-8 text-orange-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                        {isRealUpload ? 'Processing Your Assessment' : 'Demo Processing'}
                      </h3>
                      <p className="text-slate-600">
                        {isRealUpload 
                          ? 'Parsing your strengths and categorizing by domain...' 
                          : 'Simulating strengths parsing and domain categorization...'
                        }
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-orange-500 h-3 rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                  </div>
                )}

                {uploadStep === 2 && (
                  <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-purple-600 animate-spin" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                        {isRealUpload ? 'AI Analysis in Progress' : 'Demo AI Analysis'}
                      </h3>
                      <p className="text-slate-600">
                        {isRealUpload
                          ? 'Claude AI is generating personalized insights and coaching recommendations...'
                          : 'Simulating AI analysis and coaching recommendations...'
                        }
                      </p>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="bg-purple-500 h-3 rounded-full animate-pulse" style={{ width: "90%" }} />
                    </div>
                  </div>
                )}

                {uploadStep === 3 && (
                  <div className="space-y-6">
                    <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                        {isRealUpload ? 'Ready for Coaching!' : 'Demo Complete!'}
                      </h3>
                      <p className="text-slate-600 mb-4">
                        {isRealUpload 
                          ? 'Your personalized dashboard and AI coach are ready'
                          : 'Demo dashboard and AI coach are ready to explore'
                        }
                      </p>
                      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                        <div className="bg-purple-50 p-3 rounded-lg text-purple-700 text-sm font-medium">
                          4 Executing
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg text-orange-700 text-sm font-medium">
                          1 Influencing
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => window.location.href = '/coach'}
                    >
                      Open Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <Card className="p-6 bg-slate-50 border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Smart PDF Parsing</h3>
                  <p className="text-sm text-slate-600">
                    Instantly extract and categorize your strengths from any CliftonStrengths report format.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Analysis</h3>
                  <p className="text-sm text-slate-600">
                    Claude AI identifies unique patterns, synergies, and growth opportunities in your profile.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Interactive Dashboard</h3>
                  <p className="text-sm text-slate-600">
                    Explore your strengths visually with domain color-coding and detailed breakdowns.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Real-Time Coaching</h3>
                  <p className="text-sm text-slate-600">
                    Chat with your personal AI coach for specific guidance and development planning.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* How It Works */}
          <div className="text-center space-y-12 mb-20">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                From assessment to actionable insights in under 2 minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-slate-900">Upload PDF</h3>
                <p className="text-sm text-slate-600">
                  Drop your CliftonStrengths report and watch as we instantly parse your unique profile.
                </p>
              </div>

              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-slate-900">AI Analysis</h3>
                <p className="text-sm text-slate-600">
                  Our AI analyzes your strengths, identifies patterns, and generates personalized insights.
                </p>
              </div>

              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-slate-900">Start Coaching</h3>
                <p className="text-sm text-slate-600">
                  Begin conversations with your AI coach and explore your interactive dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Free Alpha Access - No Sign-up Required
            </div>

            <h2 className="text-3xl font-bold text-slate-900">Ready to unlock your potential?</h2>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join professionals who are already using AI to accelerate their strength-based development.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input
                ref={finalCTAInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelectWithScroll}
                className="hidden"
                id="final-cta-upload"
              />
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={() => finalCTAInputRef.current?.click()}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your Assessment Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="!bg-purple-50 !text-purple-700 hover:!bg-purple-100 hover:!text-purple-800 !border-purple-200 hover:!border-purple-300 transition-all duration-200 px-6"
                onClick={simulateUpload}
              >
                Try Demo First
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-200 bg-white/50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2025 Amyn Porbanderwala Dba PeakPath. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="/privacy-terms" className="hover:text-slate-700 transition-colors">
                Privacy & Terms
              </a>
              <a
                href="https://github.com/aporb/PeakPath"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}