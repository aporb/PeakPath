import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Brain, MessageSquare, TrendingUp } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: Upload,
      title: "Upload Your Assessment",
      description:
        "Drag and drop your CliftonStrengths PDF (Top 5, Top 10, or Full 34). Our secure parser extracts your strength profile instantly.",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      step: 2,
      icon: Brain,
      title: "AI Analysis & Insights",
      description:
        "Claude AI analyzes your unique strength combinations, identifying synergies, potential blind spots, and growth opportunities.",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      step: 3,
      icon: MessageSquare,
      title: "Interactive Coaching",
      description:
        "Start conversations with your personal AI coach. Get specific guidance for challenges, situations, and development goals.",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      step: 4,
      icon: TrendingUp,
      title: "Growth & Development",
      description:
        "Receive personalized roadmaps, track progress, and continuously refine your approach to strength-based leadership.",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
            How It Works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From Assessment to Action in Minutes
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Transform your static CliftonStrengths report into an interactive, AI-powered coaching experience with just
            a few clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className={`p-6 h-full ${step.color}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                    </div>
                    <Badge variant="secondary" className="bg-white/80 text-slate-700">
                      Step {step.step}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>

                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </Card>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-slate-200 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}