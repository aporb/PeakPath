import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquare, TrendingUp, Zap, FileText, Target } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: FileText,
      title: "Smart PDF Analysis",
      description:
        "Upload any CliftonStrengths report (Top 5, Top 10, or Full 34) and get instant parsing with domain categorization.",
      badge: "Core",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description:
        "Claude AI analyzes your unique strength combinations to identify synergies, blind spots, and growth opportunities.",
      badge: "AI",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      icon: MessageSquare,
      title: "Personal Coach Chat",
      description:
        "Real-time conversations with your AI coach for specific situations, challenges, and development planning.",
      badge: "Interactive",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      icon: TrendingUp,
      title: "Growth Roadmaps",
      description: "Personalized development plans with actionable steps, milestones, and progress tracking.",
      badge: "Planning",
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      icon: Target,
      title: "Leadership Insights",
      description: "Domain-based leadership analysis showing how your strengths translate to leadership effectiveness.",
      badge: "Leadership",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      icon: Zap,
      title: "Real-World Applications",
      description:
        "Practical examples and scenarios showing how to leverage your strengths in work and life situations.",
      badge: "Practical",
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need for strength-based growth
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Transform your CliftonStrengths assessment into an interactive coaching experience with AI-powered insights
            and personalized development plans.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Large Feature Cards */}
          <Card className="md:col-span-2 p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">AI Powered</Badge>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Advanced AI Analysis</h3>
              <p className="text-slate-600">
                Claude AI provides deep insights into your strength combinations, identifying unique patterns and
                opportunities that traditional assessments miss.
              </p>
            </div>
          </Card>

          <Card className="md:col-span-2 p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-100">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">Interactive</Badge>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Personal AI Coach</h3>
              <p className="text-slate-600">
                Get real-time coaching conversations tailored to your specific challenges, goals, and strength profile
                for immediate actionable guidance.
              </p>
            </div>
          </Card>

          {/* Smaller Feature Cards */}
          {features.slice(2).map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <Badge variant="secondary" className={feature.color}>
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}