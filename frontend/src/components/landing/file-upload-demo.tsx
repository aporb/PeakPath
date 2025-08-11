"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, Sparkles, CheckCircle } from "lucide-react"

export function FileUploadDemo() {
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDemo = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setStep(1)

    setTimeout(() => setStep(2), 1500)
    setTimeout(() => setStep(3), 3000)
    setTimeout(() => {
      setStep(0)
      setIsAnimating(false)
    }, 5000)
  }

  return (
    <div className="relative">
      {/* Main Upload Card */}
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
        <div className="p-8">
          {step === 0 && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Your CliftonStrengths PDF</h3>
                <p className="text-slate-600 text-sm">Drag & drop or click to upload your assessment</p>
              </div>
              <Button onClick={handleDemo} className="w-full bg-blue-600 hover:bg-blue-700">
                Try Demo Upload
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-orange-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Your Assessment</h3>
                <p className="text-slate-600 text-sm">Analyzing your unique strength profile...</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-purple-600 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Generating AI Insights</h3>
                <p className="text-slate-600 text-sm">Creating personalized coaching recommendations...</p>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: "90%" }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready for Coaching!</h3>
                <p className="text-slate-600 text-sm">Your personalized dashboard is ready</p>
              </div>
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-2 rounded text-slate-600 text-xs">
                  Domain breakdown available
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Floating Elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-100 rounded-full animate-bounce delay-100" />
      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-100 rounded-full animate-bounce delay-300" />
    </div>
  )
}