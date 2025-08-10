# PeakPath - AI-Powered CliftonStrengths Coaching Platform

A modern, full-stack web application that transforms CliftonStrengths assessments into interactive, AI-powered personal coaching experiences. Features a professional landing page, comprehensive session management, and end-to-end demo capabilities.

![PeakPath Demo](https://img.shields.io/badge/Status-Alpha-orange) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## ✨ Features

### 🚀 Landing Page & User Experience
- **Professional Landing Page** - Modern design with trust signals and clear CTAs
- **Dual Upload Modes** - Real PDF processing + interactive demo mode
- **Seamless User Flow** - Landing → Demo/Upload → Coaching Dashboard
- **Mobile-First Design** - Responsive across all devices with smooth animations
- **shadcn/ui Components** - Complete design system with 48+ components

### 💾 Session Management
- **Local Storage Persistence** - Sessions survive browser restarts
- **Multi-Session Support** - Save and switch between multiple profiles
- **Chat History Preservation** - All coaching conversations saved locally
- **Session Management UI** - Visual session switcher with storage monitoring
- **Auto Cleanup** - Automatic cleanup of expired sessions (30+ days)
- **Storage Monitoring** - Real-time usage tracking with cleanup tools

### 🎯 Core Functionality
- **PDF Upload & Parsing** - Drag-and-drop CliftonStrengths PDFs (Top 5, Top 10, Full 34)
- **AI-Powered Analysis** - Claude-based coaching insights and recommendations
- **Interactive Dashboard** - Visual strength exploration with domain color-coding
- **Personal Coach Chat** - Real-time AI coaching conversations with context
- **Growth Planning** - Personalized development roadmaps
- **Strength Focus Mode** - Deep-dive coaching on specific strengths

### 🎭 Demo Mode
- **Complete Demo Profile** - Realistic CliftonStrengths data (Strategic, Achiever, Learner, Focus, Responsibility)
- **End-to-End Experience** - Full coaching functionality with demo data
- **Visual Indicators** - Clear demo mode indicators with easy exit
- **No Data Required** - Experience the platform without uploading PDFs

### 🎨 Design & UX
- **Gallup Color Scheme** - Official domain colors (Purple, Orange, Blue, Green)
- **Modern shadcn/ui Design** - Professional components with Radix UI primitives
- **Smooth Animations** - Loading states, transitions, and interactive feedback
- **Trust Signals** - Security indicators, Claude AI branding, GitHub integration
- **Accessibility** - Full keyboard navigation and screen reader support

## 🏗️ Architecture

```
peakpath/
├── frontend/                    # Next.js 15 Full-Stack Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Landing Page (Root Route)
│   │   │   ├── coach/          # Coaching Application
│   │   │   │   └── page.tsx    # Main Coaching Dashboard
│   │   │   └── api/            # API Routes
│   │   ├── components/
│   │   │   ├── landing/        # Landing Page Components
│   │   │   ├── ui/             # shadcn/ui Components (48+)
│   │   │   └── SessionManager.tsx # Session Management UI
│   │   └── lib/
│   │       ├── session-storage.ts # localStorage Utilities
│   │       └── demo-data.ts       # Demo Profile Data
│   └── components.json         # shadcn/ui Configuration
└── docs/                       # Documentation
```

### Frontend Stack
- **Next.js 15** - React framework with app router
- **TypeScript** - Full type safety throughout
- **Tailwind CSS** - Utility-first styling with design system
- **shadcn/ui** - Complete component library with Radix UI primitives
- **Lucide React** - Icon system with 1000+ icons

### Backend Stack (Serverless)
- **Next.js API Routes** - Serverless functions
- **TypeScript** - Type-safe server development
- **Claude API** - AI coaching integration (Sonnet 4)
- **PDF Processing** - Automated assessment parsing
- **File Upload** - Secure PDF handling with validation

### Session Architecture
- **localStorage** - Client-side session persistence
- **SessionManager** - Utility class for CRUD operations
- **Session Metadata** - User tracking, timestamps, cleanup
- **Chat Persistence** - Conversation history across sessions

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm 9+**
- **Claude API key** from [Anthropic Console](https://console.anthropic.com/)

### 1. Clone and Install
```bash
git clone https://github.com/aporb/PeakPath.git
cd PeakPath/frontend
npm install
```

### 2. Configure Environment
```bash
# Create environment file
cp .env.example .env.local

# Add your Claude API key to .env.local:
CLAUDE_API_KEY=your_api_key_here
CLAUDE_MODEL=claude-3-5-sonnet-20241022
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Experience the Platform
1. **Landing Page**: Navigate to `http://localhost:8000`
2. **Demo Mode**: Click "Try Demo Instead" for instant experience
3. **Real Upload**: Upload a CliftonStrengths PDF for personalized coaching
4. **Session Management**: Use the "Sessions" button to manage saved profiles

## 🎮 User Flows

### Landing Page Flow
```
Landing Page (/) 
    ├── Try Demo → Demo Animation → Coaching Dashboard (/coach)
    └── Upload PDF → Processing → Coaching Dashboard (/coach)
```

### Session Management Flow
```
Any Session → Sessions Button → Session Manager UI
    ├── Switch Sessions → Load Different Profile
    ├── Delete Sessions → Remove Saved Data
    └── Storage Cleanup → Clean Expired Sessions
```

### Coaching Flow
```
Dashboard → Strength Cards → Focus Chat → AI Coaching
    ├── General Chat → Open Conversation
    ├── Strength Focus → Contextual Coaching
    └── Session Persistence → Auto-Save Progress
```

## 📁 Project Structure

### Frontend (`/frontend`)
```
src/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Landing page (root route)
│   ├── coach/
│   │   └── page.tsx           # Main coaching application
│   ├── globals.css             # Global styles + shadcn variables
│   └── api/                    # API routes
│       ├── health/route.ts     # Health check
│       ├── upload/route.ts     # PDF upload & parsing
│       └── coach/
│           ├── route.ts        # AI coaching endpoint
│           └── stream/route.ts # Streaming responses
├── components/
│   ├── landing/               # Landing page components
│   │   ├── streamlined-landing.tsx # Main landing component
│   │   ├── hero.tsx          # Hero section
│   │   ├── features.tsx      # Features grid
│   │   ├── cta.tsx          # Call-to-action sections
│   │   └── index.ts         # Barrel exports
│   ├── ui/                   # shadcn/ui components (48+)
│   │   ├── button.tsx       # Button component
│   │   ├── card.tsx         # Card component
│   │   ├── dialog.tsx       # Dialog/modal component
│   │   └── ...              # All shadcn/ui components
│   ├── SessionManager.tsx    # Session management UI
│   ├── Dashboard.tsx         # Main dashboard component
│   ├── CoachChat.tsx        # AI chat interface
│   └── index.ts             # Component exports
├── lib/
│   ├── session-storage.ts    # localStorage utility class
│   ├── demo-data.ts         # Demo profile data
│   ├── utils.ts             # Utility functions
│   └── services/            # Business logic
└── types/
    └── strength.ts          # TypeScript interfaces
```

## 🎮 API Endpoints

### File Processing
```bash
POST /api/upload
# Upload and parse CliftonStrengths PDF
# Body: FormData with PDF file
# Returns: Parsed strength profile with full data

GET /api/health  
# Health check endpoint
# Returns: Service status and API connectivity
```

### AI Coaching
```bash
POST /api/coach
# Interactive coaching conversations
# Body: { message, strengthContext, profileId, conversationHistory }
# Returns: Personalized coaching response

POST /api/coach/stream
# Streaming coaching responses
# Body: Same as /api/coach
# Returns: Server-sent events with real-time streaming
```

## 🤖 AI Coaching Features

### Coaching Modes
- **Summary** - Comprehensive profile overview
- **Deep Dive** - Strength-specific analysis  
- **Growth Planning** - Development roadmaps
- **General Chat** - Open-ended coaching conversations
- **Contextual Coaching** - Strength-focused guidance

### AI Capabilities
- **Strength Synergy Analysis** - How strengths work together
- **Blind Spot Identification** - Potential overuse patterns
- **Development Strategies** - Actionable growth plans
- **Leadership Insights** - Domain-based leadership styles
- **Real-world Applications** - Practical strength usage
- **Conversation Memory** - Context-aware responses

## 💾 Session Management

### Local Storage Features
```typescript
// Session Data Structure
interface UserSession {
  profile: StrengthProfile;
  isDemoMode: boolean;
  createdAt: string;
  lastAccessedAt: string;
  sessionId: string;
}

interface ChatSession {
  messages: ChatMessage[];
  sessionId: string;
  lastUpdatedAt: string;
}
```

### Session Operations
- **Auto-Save** - Sessions created on upload or demo start
- **Auto-Restore** - Last session loaded on app open
- **Multi-Session** - Store multiple profiles simultaneously
- **Session Switching** - Load any previous session instantly
- **Chat Persistence** - All conversations preserved
- **Auto-Cleanup** - Remove sessions older than 30 days
- **Storage Monitoring** - Visual usage indicators with cleanup tools

### Privacy & Storage
- **Client-Side Only** - All data stays in user's browser
- **No Server Storage** - Sessions not transmitted or stored on servers
- **Session Isolation** - Each profile maintained separately
- **Secure Cleanup** - Complete data removal when deleted

## 🎭 Demo Mode

### Demo Profile Features
- **Realistic Data** - Complete CliftonStrengths profile with:
  - Top 5: Strategic, Achiever, Learner, Focus, Responsibility
  - Full 10: Including Analytical, Discipline, Competition, Self-Assurance, Individualization
  - Domain Distribution: 3 Strategic Thinking, 4 Executing, 2 Influencing, 1 Relationship Building
- **Full Functionality** - All coaching features work with demo data
- **Visual Indicators** - Clear purple badges and banners show demo mode
- **Easy Exit** - One-click return to upload mode

### Demo User Flow
```
Landing Page → "Try Demo Instead" → 3-Step Animation → Coach Dashboard
    └── Demo Session with Full Coaching Experience
```

## 🎨 Design System

### Color Scheme (Gallup Official + shadcn/ui)
- **Executing Domain** - Purple (`purple-500`, `purple-100`)
- **Influencing Domain** - Orange (`orange-500`, `orange-100`) 
- **Relationship Building** - Blue (`blue-500`, `blue-100`)
- **Strategic Thinking** - Green (`green-500`, `green-100`)
- **UI Neutrals** - shadcn/ui color system with CSS variables

### Component Library
- **shadcn/ui** - 48+ production-ready components
- **Radix UI Primitives** - Accessible, unstyled components
- **Lucide React** - Consistent icon system
- **Custom Components** - PeakPath-specific UI elements

### Responsive Design
- **Mobile First** - Progressive enhancement from 320px
- **Breakpoints** - Tailwind's responsive system
- **Touch Optimized** - 44px+ touch targets
- **Animation** - Smooth transitions with reduced motion support

## 🧪 Testing & Demo Data

### Demo Experience
- **No Registration Required** - Instant access to full platform
- **Realistic Profile** - Comprehensive CliftonStrengths data
- **Full Functionality** - Complete coaching experience
- **Session Persistence** - Demo sessions saved locally

### Sample Data Structure
```typescript
// Demo Profile includes:
- User: "Demo User"
- Assessment Date: Current
- 10 Complete Strengths with descriptions
- Domain categorization
- Full PDF content simulation
```

## 📱 Mobile Experience

### Responsive Features
- **Mobile-First Design** - Optimized for 320px+ screens
- **Touch Navigation** - Swipe gestures and touch interactions
- **Adaptive Layout** - Stacked cards on mobile, grid on desktop
- **Full-Screen Chat** - Dedicated mobile chat experience
- **Progressive Enhancement** - Desktop features layered on mobile base

### Performance
- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - Next.js automatic optimization
- **Caching** - Strategic caching for repeat visits
- **Bundle Analysis** - Optimized JavaScript bundles

## 🔧 Development

### Available Scripts
```bash
npm run dev           # Start development server (localhost:8000)
npm run build         # Build for production
npm run start         # Start production server  
npm run lint          # Run ESLint
npm run type-check    # TypeScript checking
```

### Dependencies Overview
```json
{
  "core": ["next", "react", "typescript"],
  "ui": ["@radix-ui/*", "tailwindcss", "lucide-react"],
  "utils": ["clsx", "tailwind-merge", "class-variance-authority"],
  "forms": ["react-hook-form", "@hookform/resolvers", "zod"],
  "ai": ["@anthropic-ai/sdk"],
  "processing": ["pdf-parse", "multer"]
}
```

### Environment Variables
```bash
# Required
CLAUDE_API_KEY=your_anthropic_api_key

# Optional (with defaults)
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4096
CLAUDE_TEMPERATURE=0.7
NODE_ENV=development
```

## 🚀 Production Deployment

### Build Process
```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

### Deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure Claude API key
- [ ] Enable HTTPS
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Configure CORS for production domain
- [ ] Enable compression (gzip/brotli)
- [ ] Set up monitoring and logging

### Vercel Deployment (Recommended)
```bash
# Deploy with Vercel CLI
npx vercel --prod

# Environment variables in Vercel Dashboard:
# - CLAUDE_API_KEY
# - CLAUDE_MODEL (optional)
```

## 🔐 Security Features

### Data Protection
- **Client-Side Sessions** - No sensitive data sent to servers
- **File Upload Validation** - PDF format and size limits (10MB)
- **Input Sanitization** - XSS and injection protection
- **API Rate Limiting** - Configurable request limits
- **CORS Protection** - Environment-specific CORS policies

### Privacy Features
- **Local Storage Only** - Session data never leaves browser
- **No User Tracking** - No analytics or tracking scripts
- **Data Cleanup** - Automatic session expiry and cleanup
- **Secure Processing** - PDFs processed and discarded

## 🤝 Contributing

### Development Workflow
1. **Fork Repository** - Create your own fork
2. **Create Branch** - `git checkout -b feature/amazing-feature`
3. **Make Changes** - Follow TypeScript and ESLint rules
4. **Test Thoroughly** - Verify all functionality
5. **Update Documentation** - Update relevant .md files
6. **Commit Changes** - `git commit -m 'feat: add amazing feature'`
7. **Push Branch** - `git push origin feature/amazing-feature`
8. **Create PR** - Open pull request with detailed description

### Code Standards
- **TypeScript** - Full type safety required
- **ESLint** - Follow configured rules
- **Prettier** - Code formatting consistency
- **Component Structure** - Follow shadcn/ui patterns
- **Documentation** - Update docs for new features

## 📄 License

This project is private and proprietary.

## 🆘 Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Clear Next.js cache
rm -rf .next node_modules
npm install
npm run dev
```

**Session data not persisting:**
- Check if localStorage is available in browser
- Verify no browser extensions blocking storage
- Check browser storage limits (5MB typical)

**Demo mode not loading:**
- Clear browser cache and localStorage
- Check console for JavaScript errors
- Verify demo-data.ts is properly imported

**PDF upload failing:**
- Verify file is actual CliftonStrengths PDF
- Check file size (10MB limit)
- Ensure PDF contains readable text (not just images)

**Claude API errors:**
- Verify API key in environment variables
- Check API key permissions and quotas
- Monitor rate limiting in console logs
- Ensure model name matches available models

**Landing page components not rendering:**
- Verify shadcn/ui components installed
- Check components.json configuration
- Ensure Tailwind CSS configured properly
- Verify all Radix UI dependencies installed

**Session management UI issues:**
- Check localStorage permissions
- Verify SessionManager class imported correctly
- Clear corrupted localStorage data manually
- Check browser developer tools for errors

### Performance Issues
- **Slow initial load** - Check bundle size and code splitting
- **Chat lag** - Verify streaming endpoint functionality  
- **Mobile performance** - Check image optimization and bundle size

### Storage Issues
- **Storage full** - Use session cleanup tools in Session Manager
- **Corrupted sessions** - Clear localStorage manually
- **Missing sessions** - Check browser storage permissions

### Support
For issues and feature requests, create an issue in the project repository with:
- Detailed description of the problem
- Steps to reproduce
- Browser and OS information
- Console error messages (if any)

---

Built with ❤️ using Next.js 15, TypeScript, shadcn/ui & Claude AI - Production ready for Vercel deployment!