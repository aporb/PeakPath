import { Shield, Users, Zap, Award } from "lucide-react"

export function TrustSignals() {
  const signals = [
    {
      icon: Shield,
      title: "Secure Processing",
      description: "Your assessment data is processed securely and never stored permanently",
    },
    {
      icon: Users,
      title: "AI-Powered Insights",
      description: "Advanced Claude AI provides personalized coaching recommendations",
    },
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get comprehensive insights from your CliftonStrengths in minutes",
    },
    {
      icon: Award,
      title: "Research-Based",
      description: "Built on extensive study of CliftonStrengths methodology",
    },
  ]

  return (
    <section className="py-16 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signals.map((signal, index) => (
            <div key={index} className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                <signal.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">{signal.title}</h3>
              <p className="text-sm text-slate-600">{signal.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}