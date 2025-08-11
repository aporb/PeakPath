# PeakPath Frontend 🎨

The Next.js 15 frontend application for PeakPath's AI-powered CliftonStrengths coaching platform.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-4285f4?style=for-the-badge)](https://peak-path.vercel.app) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)

> **Note**: This is the frontend component of PeakPath. For the complete project overview, see the [root README](../README.md).

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Claude API key from [Anthropic Console](https://console.anthropic.com/)

### Development Setup
```bash
# From project root or directly in frontend/
cd frontend
npm install
cp .env.example .env.local
# Add CLAUDE_API_KEY to .env.local
npm run dev
```

Visit `http://localhost:8000` 🚀

---

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5+ (strict mode)
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **AI Integration**: Claude API (Anthropic)
- **Storage**: Browser localStorage (privacy-first)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout & metadata
│   ├── page.tsx           # Landing page (/)
│   ├── coach/             # Coaching application (/coach)
│   └── api/               # Server API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── landing/          # Landing page components
│   └── [features]/       # Feature-specific components
├── lib/                  # Utilities and services
├── types/               # TypeScript definitions
└── hooks/               # Custom React hooks
```

---

## 🎨 Design System

### shadcn/ui Integration
- **48+ Components**: Complete component library with custom theming
- **Accessibility**: Built on Radix UI primitives
- **Customizable**: Own the code, not a dependency
- **TypeScript**: Fully typed components

### Key Features
- **CliftonStrengths Domain Colors**: Custom CSS variables for strength themes
- **Responsive Design**: Mobile-first approach
- **Dark Mode Ready**: Built-in theme support
- **Professional UI**: Consistent design language

---

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Development server (localhost:8000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint with type checking
npm run type-check   # TypeScript checking only
```

### Environment Variables
```bash
# Required
CLAUDE_API_KEY=your_anthropic_api_key

# Optional (with defaults)
CLAUDE_MODEL=claude-4-sonnet
NODE_ENV=development
```

### Adding Components
```bash
# Add shadcn/ui components
npx shadcn@latest add button
npx shadcn@latest add card

# Components auto-added to src/components/ui/
```

---

## 🔧 Key Features

### AI Integration
- **Streaming Responses**: Real-time Claude API integration
- **Context-Aware**: Understands CliftonStrengths profiles
- **Demo Mode**: Full experience with sample data

### Session Management
- **Privacy-First**: All data stays in browser
- **Multi-Profile**: Support for multiple users
- **Auto-Save**: Chat history and profile data

### PDF Processing
- **Smart Parsing**: Extracts CliftonStrengths data
- **Format Support**: Top 5, 10, or Full 34 reports
- **Instant Analysis**: AI-powered profile generation

---

## 📖 Documentation

### Project Documentation
- **[Main README](../README.md)** - Complete project overview
- **[Architecture Guide](../docs/development/ARCHITECTURE.md)** - Technical architecture
- **[Contributing Guide](../docs/CONTRIBUTING.md)** - Development workflow
- **[API Documentation](../docs/development/API.md)** - API reference

### External Resources
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework documentation
- **[shadcn/ui Documentation](https://ui.shadcn.com)** - Component library
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - Styling framework
- **[Claude API Documentation](https://docs.anthropic.com/claude/reference)** - AI integration

---

## 🤝 Contributing

This frontend follows the project-wide contributing guidelines. See [CONTRIBUTING.md](../docs/CONTRIBUTING.md) for:
- Development workflow
- Code standards
- Component patterns
- Testing requirements
- Pull request process

### Frontend-Specific Guidelines
- **TypeScript strict mode** - All code must pass strict type checking
- **shadcn/ui patterns** - Follow established component patterns
- **Mobile-first design** - Responsive design from 320px upward
- **Accessibility** - WCAG 2.2 AA compliance for all components

---

<div align="center">

**Part of the PeakPath AI-powered coaching platform**

[![Live Demo](https://img.shields.io/badge/🌐_Try_PeakPath_Now-4285f4?style=for-the-badge)](https://peak-path.vercel.app) [![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/aporb/PeakPath)

</div>