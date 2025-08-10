"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Lock, Eye, Github, FileText } from "lucide-react"
import Link from "next/link"

export default function PrivacyTermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="relative z-10 px-4 py-6 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to PeakPath
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PP</span>
              </div>
              <span className="text-xl font-bold text-slate-900">PeakPath</span>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Alpha
              </Badge>
            </div>
          </div>
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
        <div className="mx-auto max-w-4xl space-y-12">
          
          {/* Title Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Privacy & Terms
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Privacy Policy & Terms of Service</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Transparent information about how PeakPath handles your CliftonStrengths data and coaching sessions.
            </p>
            <p className="text-sm text-slate-500">
              Effective Date: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} | Last Updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-green-200 bg-green-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">Your Data Stays Local</h3>
              </div>
              <p className="text-sm text-green-700">
                All your coaching sessions and PDF data are stored in your browser only. We don't keep your personal information on our servers.
              </p>
            </Card>

            <Card className="p-6 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900">AI Processing Only</h3>
              </div>
              <p className="text-sm text-blue-700">
                Your data is only shared with Claude AI to provide coaching responses. PDFs are processed temporarily and not stored.
              </p>
            </Card>

            <Card className="p-6 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900">Open Source</h3>
              </div>
              <p className="text-sm text-purple-700">
                Full transparency - our entire codebase is open source on GitHub. You can see exactly how we handle your data.
              </p>
            </Card>
          </div>

          {/* Privacy Policy Section */}
          <section className="space-y-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h2>
              <p className="text-slate-600">How we collect, use, and protect your information</p>
            </div>

            <Card className="p-8 space-y-8">
              
              {/* About Section */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">About PeakPath</h3>
                <p className="text-slate-700 leading-relaxed">
                  PeakPath is an Alpha/Beta AI-powered CliftonStrengths coaching platform that transforms your 
                  CliftonStrengths assessment into interactive, personalized coaching experiences. This Privacy 
                  Policy explains how we collect, use, and protect your information when you use our service.
                </p>
              </div>

              {/* Data Collection */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">1. Data Collection</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Information You Provide:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li><strong>CliftonStrengths PDF Files:</strong> Your uploaded assessment results for processing</li>
                      <li><strong>Chat Messages:</strong> Conversations you have with our AI coaching system</li>
                      <li><strong>Session Preferences:</strong> Settings and customizations within the platform</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Information We DO NOT Collect:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li>Personal identification information (name, email, phone number)</li>
                      <li>User registration or account creation data</li>
                      <li>Payment or billing information</li>
                      <li>Location data or tracking information</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">2. Data Usage</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">How We Use Your Information:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li><strong>AI Coaching Services:</strong> Your CliftonStrengths data powers personalized coaching via Claude AI</li>
                      <li><strong>Service Improvement:</strong> Anonymous usage patterns help enhance the platform</li>
                      <li><strong>Technical Support:</strong> Error logs help us maintain service quality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Data Processing:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li><strong>PDF Processing:</strong> Assessments are parsed to extract strength profiles</li>
                      <li><strong>AI Integration:</strong> Data sent to Claude AI (Anthropic) for coaching responses</li>
                      <li><strong>Local Storage:</strong> Session data stored in your browser's localStorage</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Storage & Security */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">3. Data Storage & Security</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">🏠 Local Browser Storage</h4>
                    <ul className="list-disc list-inside space-y-1 text-green-700 pl-4 text-sm">
                      <li><strong>Primary Storage:</strong> All session data, chat history, and preferences stored locally in your browser</li>
                      <li><strong>No Server Storage:</strong> We do not permanently store your coaching sessions on our servers</li>
                      <li><strong>Session Persistence:</strong> Data survives browser restarts and remains accessible across visits</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">File Processing Security:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li><strong>Temporary Processing:</strong> PDF files processed in memory and immediately discarded</li>
                      <li><strong>No File Storage:</strong> PDF files never permanently stored on our servers</li>
                      <li><strong>Secure Transmission:</strong> All data transfers use HTTPS encryption</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Data Retention:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li><strong>Local Sessions:</strong> Stored until you delete them or they expire (30+ days)</li>
                      <li><strong>Server Logs:</strong> Technical logs retained for up to 30 days</li>
                      <li><strong>Automatic Cleanup:</strong> Expired sessions automatically removed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Third-Party Services */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">4. Third-Party Services</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">🤖 Claude AI Integration (Anthropic)</h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 pl-4 text-sm">
                      <li><strong>Purpose:</strong> Powers our AI coaching conversations</li>
                      <li><strong>Data Shared:</strong> Your CliftonStrengths profile and chat messages</li>
                      <li><strong>Privacy:</strong> Subject to Anthropic's privacy policy</li>
                      <li><strong>Processing:</strong> Real-time conversation processing with no permanent storage</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Hosting and Infrastructure:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li><strong>Service Providers:</strong> Vercel or similar hosting platforms</li>
                      <li><strong>Data Protection:</strong> Industry-standard security and encryption</li>
                      <li><strong>Compliance:</strong> Hosting providers maintain SOC 2 and similar certifications</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* User Rights */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">5. Your Data Rights & Control</h3>
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">🎛️ Complete Data Control</h4>
                    <ul className="list-disc list-inside space-y-1 text-purple-700 pl-4 text-sm">
                      <li><strong>Access:</strong> View all your stored session data through the Session Manager</li>
                      <li><strong>Deletion:</strong> Delete individual sessions or clear all data instantly</li>
                      <li><strong>Portability:</strong> Export your chat history and session data anytime</li>
                      <li><strong>Control:</strong> Complete control over what data is stored and for how long</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Data Management Tools:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li><strong>Session Manager:</strong> Visual interface to manage multiple coaching sessions</li>
                      <li><strong>Storage Monitoring:</strong> Real-time view of your browser storage usage</li>
                      <li><strong>Cleanup Tools:</strong> One-click removal of expired or unwanted sessions</li>
                      <li><strong>Demo Mode:</strong> Try the platform without uploading personal data</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Alpha/Beta Notice */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2">⚠️ Alpha/Beta Development Notice</h4>
                <ul className="list-disc list-inside space-y-1 text-orange-700 pl-4 text-sm">
                  <li><strong>Testing Phase:</strong> PeakPath is currently in Alpha/Beta development</li>
                  <li><strong>Feature Changes:</strong> Functionality and data handling may change during testing</li>
                  <li><strong>Backup Recommended:</strong> Consider keeping backups of important coaching sessions</li>
                  <li><strong>Feedback Welcome:</strong> We encourage user feedback to improve the platform</li>
                </ul>
              </div>

            </Card>
          </section>

          {/* Terms of Service Section */}
          <section className="space-y-8">
            <div className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h2>
              <p className="text-slate-600">Rules and guidelines for using PeakPath</p>
            </div>

            <Card className="p-8 space-y-8">

              {/* Acceptance */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h3>
                <p className="text-slate-700 leading-relaxed">
                  By accessing and using PeakPath, you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our service.
                </p>
              </div>

              {/* Service Description */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">2. Service Description</h3>
                <div className="space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    PeakPath is an AI-powered coaching platform that transforms CliftonStrengths assessments 
                    into personalized development experiences using Claude AI technology.
                  </p>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li>CliftonStrengths PDF upload and analysis</li>
                      <li>AI-powered coaching conversations</li>
                      <li>Session management and persistence</li>
                      <li>Demo mode for platform exploration</li>
                      <li>Local data storage and privacy protection</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Alpha/Beta Terms */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-yellow-900 mb-4">3. Alpha/Beta Terms</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">Development Status:</h4>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700 pl-4 text-sm">
                      <li><strong>Testing Phase:</strong> This is an Alpha/Beta product undergoing active development</li>
                      <li><strong>No Warranties:</strong> The service is provided "as-is" during testing</li>
                      <li><strong>Feature Changes:</strong> Functionality may change without notice</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* User Responsibilities */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">4. User Responsibilities</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Acceptable Use:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li>Use the platform for personal and professional development purposes only</li>
                      <li>Upload only your own legitimate CliftonStrengths assessment PDFs</li>
                      <li>Respect the AI coaching system and engage constructively</li>
                      <li>Do not attempt to reverse engineer or exploit the platform</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-2">Data Management:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-4">
                      <li>Backup important coaching conversations independently</li>
                      <li>Use provided tools to manage your local storage</li>
                      <li>Report issues to maintainers through appropriate channels</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Professional Guidance Disclaimer */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-red-900 mb-4">5. Important Disclaimers</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">Professional Guidance:</h4>
                    <ul className="list-disc list-inside space-y-1 text-red-700 pl-4 text-sm">
                      <li><strong>Not Professional Advice:</strong> AI coaching is not a substitute for professional career counseling</li>
                      <li><strong>Personal Development Tool:</strong> Intended as a supplementary development resource</li>
                      <li><strong>User Judgment:</strong> Users should exercise their own judgment in applying insights</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Open Source */}
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">6. Open Source & Community</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">🔓 Transparency & Community</h4>
                    <ul className="list-disc list-inside space-y-1 text-green-700 pl-4 text-sm">
                      <li><strong>GitHub Repository:</strong> Full project available for community review</li>
                      <li><strong>Issue Reporting:</strong> Users encouraged to report bugs and suggest improvements</li>
                      <li><strong>Contribution Welcome:</strong> Community contributions to development encouraged</li>
                      <li><strong>Transparent Code:</strong> All data handling practices visible in public codebase</li>
                    </ul>
                  </div>
                </div>
              </div>

            </Card>
          </section>

          {/* Contact Section */}
          <section className="space-y-6">
            <div className="border-l-4 border-green-500 pl-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Contact & Support</h2>
              <p className="text-slate-600">Get help or ask questions about privacy and terms</p>
            </div>

            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Questions About Privacy?</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>For questions about this Privacy Policy or your data:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Report privacy concerns via GitHub Issues</li>
                      <li>Contact through repository maintainers</li>
                      <li>Review full source code for transparency</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Technical Support</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>For technical help or bug reports:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Submit issues via GitHub Issues</li>
                      <li>Check documentation and README</li>
                      <li>Engage with community discussions</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                <Button asChild>
                  <a 
                    href="https://github.com/aporb/PeakPath" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </Card>
          </section>

          {/* Footer Note */}
          <div className="text-center py-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-2">
              By using PeakPath, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            <p className="text-xs text-slate-400">
              This document applies to PeakPath v0.1.0 and may be updated as the platform evolves during Alpha/Beta development.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}