import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

export function FAQ() {
  const faqs = [
    {
      question: "What CliftonStrengths reports are supported?",
      answer:
        "PeakPath supports all CliftonStrengths report formats: Top 5, Top 10, and Full 34. Simply upload your PDF and our AI will automatically detect and parse your strength profile with domain categorization.",
    },
    {
      question: "How secure is my assessment data?",
      answer:
        "We take security seriously. All PDFs are processed securely with end-to-end encryption, and we're SOC 2 compliant. Your assessment data is never stored permanently and is only used to generate your personalized insights.",
    },
    {
      question: "What makes the AI coaching different?",
      answer:
        "Our AI coach is powered by Claude from Anthropic and trained specifically on CliftonStrengths methodology. It understands strength synergies, domain interactions, and provides contextual advice based on your unique talent profile.",
    },
    {
      question: "Can I use this for my team?",
      answer:
        "Yes! Our Enterprise plan includes team dashboards, comparative analysis, and admin controls. You can analyze team dynamics, identify complementary strengths, and build more effective teams.",
    },
    {
      question: "How does this relate to CliftonStrengths?",
      answer:
        "PeakPath is an independent platform that enhances the CliftonStrengths experience with AI-powered insights. We've extensively studied the methodology to provide meaningful coaching based on your assessment results.",
    },
    {
      question: "What's included in the free plan?",
      answer:
        "The free Explorer plan lets you upload one assessment, get basic AI insights, and have 5 coaching conversations. It's perfect for trying out PeakPath and seeing how AI can enhance your strength development.",
    },
  ]

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
            FAQ
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-600">
            Everything you need to know about PeakPath and AI-powered strength coaching.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white border border-slate-200 rounded-lg px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-slate-600">
            Still have questions?{" "}
            <a
              href="https://github.com/aporb/PeakPath/tree/master"
              className="text-blue-600 hover:text-blue-700 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit our GitHub repository
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}