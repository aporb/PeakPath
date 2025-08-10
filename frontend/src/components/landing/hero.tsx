import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Upload, Sparkles, TrendingUp } from "lucide-react"
import { FileUploadDemo } from "./file-upload-demo"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Alpha Release - Early Access
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CliftonStrengths
                </span>{" "}
                Into AI-Powered Growth
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed">
                Upload your CliftonStrengths assessment and get personalized AI coaching, interactive insights, and
                development roadmaps tailored to your unique talent profile.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure PDF Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Claude AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Research-Based Coaching</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                <Upload className="w-4 h-4 mr-2" />
                Upload Your Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </div>

          {/* Right Column - Interactive Demo */}
          <div className="relative">
            <FileUploadDemo />
          </div>
        </div>
      </div>
    </section>
  )
}