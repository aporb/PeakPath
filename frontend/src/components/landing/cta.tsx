import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-blue-100 shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />

          <div className="relative p-12 text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Alpha Release - Limited Time
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Ready to unlock your strength potential?
              </h2>

              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Join thousands of professionals who are already using AI to accelerate their strength-based development.
                Upload your assessment and start coaching in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Start Your Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Schedule a Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Setup in under 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}