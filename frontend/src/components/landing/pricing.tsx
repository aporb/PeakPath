import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"

export function Pricing() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            Alpha Testing
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Free Alpha Access</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            PeakPath is currently in Alpha testing. Try all features free while we perfect the experience. Pricing plans
            coming soon.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="p-8 border-blue-200 bg-blue-50/30 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              Alpha Access
            </Badge>

            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Free Alpha Testing</h3>
                <p className="text-slate-600 mt-2">Full access while we build</p>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-slate-900">Free</div>
                <p className="text-sm text-slate-600">During Alpha phase</p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-600">Unlimited assessments</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-600">Full AI analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-600">Unlimited coaching</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-600">Growth roadmaps</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-slate-600">Early access to new features</span>
                </li>
              </ul>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">Join Alpha Testing</Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-slate-600">
            🚀 <strong>Alpha Phase:</strong> Help us build the future of strength-based coaching
          </p>
        </div>
      </div>
    </section>
  )
}