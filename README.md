# PeakPath - AI-Powered CliftonStrengths Coaching Platform

A modern, microservices-based web application that transforms CliftonStrengths assessments into interactive, AI-powered personal coaching experiences. Still in Alpha. 

## ✨ Features

### 🎯 Core Functionality
- **PDF Upload & Parsing** - Drag-and-drop CliftonStrengths PDFs (Top 5, Top 10, Full 34)
- **AI-Powered Analysis** - Claude-based coaching insights and recommendations
- **Interactive Dashboard** - Visual strength exploration with domain color-coding
- **Personal Coach Chat** - Real-time AI coaching conversations
- **Growth Planning** - Personalized development roadmaps
- **Mobile-First Design** - Responsive UI with smooth animations

### 🎨 User Experience
- **Gallup Color Scheme** - Official domain colors (Purple, Orange, Blue, Green)
- **Modern UI/UX** - Clean, minimal design with glassmorphism effects
- **Smooth Animations** - Loading states, transitions, and interactive feedback
- **Onboarding Flow** - Guided user experience from upload to insights

## 🏗️ Architecture

```
peakpath/
├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript
├── shared/           # Shared types and utilities
└── docs/            # Documentation
```

### Frontend Stack
- **Next.js 15** - React framework with app router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Responsive Design** - Mobile-first approach

### Backend Stack
- **Node.js + Express** - RESTful API server
- **TypeScript** - Type-safe server development
- **Claude API** - AI coaching integration
- **PDF Processing** - Automated assessment parsing
- **File Upload** - Secure PDF handling with validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Claude API key from [Anthropic Console](https://console.anthropic.com/)

### 1. Clone and Install
```bash
git clone https://github.com/aporb/PeakPath.git
cd PeakPath
npm install
```

### 2. Configure Environment
```bash
# Backend configuration
cd backend
cp .env.example .env
# Add your Claude API key to .env:
# CLAUDE_API_KEY=your_api_key_here
```

### 3. Start Development Servers
```bash
# From root directory - starts both frontend and backend
npm run dev

# Or individually:
npm run dev:frontend  # http://localhost:8000
npm run dev:backend   # http://localhost:8001
```

### 4. Test the Application
1. Navigate to `http://localhost:8000`
2. Upload a CliftonStrengths PDF (sample PDFs available in `/resources/`)
3. Explore the interactive dashboard
4. Start coaching conversations

## 📁 Project Structure

### Frontend (`/frontend`)
```
src/
├── app/
│   ├── layout.tsx     # App layout and metadata
│   └── page.tsx       # Main application page
├── components/
│   ├── Dashboard.tsx      # Main dashboard component
│   ├── StrengthCard.tsx   # Interactive strength cards
│   ├── FileUpload.tsx     # Drag-and-drop upload
│   ├── CoachChat.tsx      # AI chat interface
│   ├── LoadingSpinner.tsx # Loading animations
│   └── index.ts           # Component exports
└── types/
    └── strength.ts        # TypeScript interfaces
```

### Backend (`/backend`)
```
src/
├── server.ts                    # Express server
├── types/
│   ├── clifton-strengths.ts     # Strength data types
│   └── coaching.ts              # Coaching interfaces
└── services/
    ├── claudeCoachingService.ts # Claude AI integration
    └── cliftonStrengthsPDFParser.ts # PDF parsing
```

## 🎮 API Endpoints

### File Processing
```bash
POST /api/upload
# Upload and parse CliftonStrengths PDF
# Returns: Parsed strength profile

POST /api/analyze  
# Generate AI analysis of strengths profile
# Returns: Comprehensive insights and recommendations
```

### AI Coaching
```bash
POST /api/coach
# Interactive coaching conversations
# Body: { message, type, context, sessionId }
# Returns: Personalized coaching response

GET /api/health
# Health check endpoint
# Returns: Service status
```

## 🤖 AI Coaching Features

### Coaching Modes
- **Summary** - Comprehensive profile overview
- **Deep Dive** - Strength-specific analysis
- **Growth Planning** - Development roadmaps
- **General Chat** - Open-ended coaching conversations

### AI Capabilities
- **Strength Synergy Analysis** - How strengths work together
- **Blind Spot Identification** - Potential overuse patterns
- **Development Strategies** - Actionable growth plans
- **Leadership Insights** - Domain-based leadership styles
- **Real-world Applications** - Practical strength usage

## 🎨 Design System

### Color Scheme (Gallup Official)
- **Executing Domain** - Purple (`purple-500`, `purple-100`)
- **Influencing Domain** - Orange (`orange-500`, `orange-100`) 
- **Relationship Building** - Blue (`blue-500`, `blue-100`)
- **Strategic Thinking** - Green (`green-500`, `green-100`)

### UI Components
- **Glassmorphism Cards** - Semi-transparent with backdrop blur
- **Responsive Grid** - Adaptive layout for all screen sizes
- **Smooth Animations** - Hover effects and transitions
- **Loading States** - Skeleton screens and spinners

## 🧪 Testing with Sample Data

Sample CliftonStrengths PDFs are available in `/resources/`:
- `sample-top5-report.pdf` - Top 5 strengths format
- `sample-full34-report.pdf` - Full 34 strengths format

## 📱 Mobile Experience

### Responsive Breakpoints
- **Mobile** - `< 768px` (full-screen chat, stacked layout)
- **Tablet** - `768px - 1024px` (2-column grid)
- **Desktop** - `> 1024px` (floating chat, multi-column)

### Touch Interactions
- 44px minimum touch targets
- Swipe gestures for navigation
- Haptic feedback simulation
- Native-like animations

## 🔧 Development

### Available Scripts
```bash
npm run dev           # Start development servers
npm run build         # Build for production  
npm run start         # Start production servers
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

### Environment Variables
```bash
# Backend (.env)
CLAUDE_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4096
CLAUDE_TEMPERATURE=0.7
NODE_ENV=development
PORT=8001
```

## 🚀 Production Deployment

### Build Process
```bash
npm run build
npm run start
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure Claude API key
3. Set up reverse proxy (nginx/Apache)
4. Enable HTTPS
5. Configure CORS for production domain

## 🔐 Security Features

- **File Upload Validation** - PDF format and size limits
- **API Rate Limiting** - 50 requests/minute, 1000/hour
- **CORS Protection** - Configured for local development
- **Error Handling** - No sensitive data exposure
- **Input Sanitization** - XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
- Verify Node.js 18+ is installed
- Check if port 8001 is available
- Ensure dependencies are installed (`npm install`)

**Frontend build errors:**
- Clear Next.js cache (`rm -rf .next`)
- Reinstall dependencies (`rm -rf node_modules && npm install`)
- Check TypeScript errors (`npm run build`)

**PDF parsing fails:**
- Verify file is a valid CliftonStrengths PDF
- Check file size (max 10MB)
- Ensure PDF contains parseable text

**Claude API errors:**
- Verify API key is set in `.env`
- Check API key permissions
- Monitor rate limiting (see console logs)

### Support
For issues and feature requests, please create an issue in the project repository.

---

Built with ❤️ using Next.js, TypeScript - Ready for Vercel deployment!
