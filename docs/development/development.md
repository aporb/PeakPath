# Development Setup Guide

Get PeakPath running locally for development and contribution.

## 📝 Prerequisites

### Required Software
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm 9+** - Comes with Node.js
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **Code Editor** - VS Code recommended with TypeScript support

### Optional Tools
- **Claude API Key** - [Get from Anthropic Console](https://console.anthropic.com/)
- **GitHub CLI** - For easier contribution workflow
- **Vercel CLI** - For deployment testing

## 🚀 Quick Setup

### 1. Clone Repository
```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/PeakPath.git
cd PeakPath
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API key
echo "CLAUDE_API_KEY=your_anthropic_api_key_here" >> .env.local
echo "NODE_ENV=development" >> .env.local
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:8000` - you should see the PeakPath landing page!

## 📝 Project Structure

```
PeakPath/
├── frontend/                 # Main Next.js application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── globals.css    # Global styles
│   │   │   ├── coach/         # Coaching dashboard
│   │   │   └── api/           # API routes
│   │   ├── components/      # React components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── landing/       # Landing page components
│   │   │   └── *.tsx          # App components
│   │   ├── lib/             # Utilities and services
│   │   │   ├── services/      # Business logic
│   │   │   └── *.ts           # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript definitions
│   └── package.json         # Dependencies and scripts
├── docs/                   # Documentation (this folder)
├── media/                  # Project screenshots
└── README.md               # Project overview
```

## 🔧 Development Commands

### Essential Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production build locally
npm start

# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Advanced Commands
```bash
# Type checking only
npx tsc --noEmit

# Bundle analyzer
npm run analyze

# Clean build cache
npm run clean

# Update dependencies
npm update
```

## ⚙️ Environment Variables

### Development (.env.local)
```bash
# Required for AI features
CLAUDE_API_KEY=sk-ant-api03-your-key-here

# Optional - defaults provided
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=4096
CLAUDE_TEMPERATURE=0.7
NODE_ENV=development
```

### Getting Claude API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account or log in
3. Navigate to API Keys section
4. Create new API key
5. Copy key (starts with `sk-ant-api03-`)

## 📝 Code Standards

### TypeScript Configuration
```json
{
  "strict": true,
  "noEmit": true,
  "skipLibCheck": true,
  "esModuleInterop": true
}
```

### ESLint Rules
- Next.js ESLint config
- TypeScript strict mode
- No unused variables
- Consistent import order
- No console.log in production

### Component Patterns
```typescript
// ✅ Good component structure
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // Other props...
}

export function MyComponent({ className, children, ...props }: ComponentProps) {
  return (
    <div className={cn("base-styles", className)} {...props}>
      {children}
    </div>
  );
}
```

## 📱 Testing Setup

### Manual Testing Checklist
Before submitting PRs:

**Core Features:**
- [ ] Landing page loads without errors
- [ ] Demo mode works ("Try Demo Instead")
- [ ] PDF upload processes correctly
- [ ] AI coaching chat responds
- [ ] Session management saves data

**Cross-Browser:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

**Responsive Design:**
- [ ] Mobile (320-768px)
- [ ] Tablet (768-1024px)
- [ ] Desktop (1024px+)

### Automated Testing (Future)
```bash
# When tests are added:
npm test                # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

## 🔍 Debugging

### Common Issues

**"CLAUDE_API_KEY not found"**
```bash
# Check .env.local exists and has correct key
ls -la .env.local
grep CLAUDE_API_KEY .env.local
```

**"Module not found" errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**Port 8000 already in use**
```bash
# Use different port
npm run dev -- --port 3001

# Or kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Development Tools

**Browser DevTools:**
- F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
- Console tab for JavaScript errors
- Network tab for API requests
- Application tab for localStorage data

**VS Code Extensions:**
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Auto Rename Tag

## 🚀 Contribution Workflow

### 1. Development Branch
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes...

# Commit with conventional format
git add .
git commit -m "feat: add new coaching feature"
```

### 2. Testing
```bash
# Test your changes
npm run build        # Ensure builds successfully
npm run lint         # Fix any linting issues
# Manual testing across browsers/devices
```

### 3. Pull Request
```bash
# Push your branch
git push origin feature/your-feature-name

# Create PR on GitHub with:
# - Clear title and description
# - Screenshots for UI changes
# - Reference to issues
```

### 4. Review Process
- Automated checks (build, lint, type check)
- Code review from maintainers
- Manual testing by reviewers
- Feedback incorporation
- Final approval and merge

## 📚 Additional Resources

### Framework Documentation
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [React 18 Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)

### PeakPath Specific
- [Architecture Guide](ARCHITECTURE.md)
- [Component Documentation](components.md)
- [API Reference](API.md)
- [Contributing Guide](../CONTRIBUTING.md)

### External Services
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Vercel Deployment](https://vercel.com/docs)
- [CliftonStrengths](https://www.gallup.com/cliftonstrengths/)

## ❓ Frequently Asked Questions

**Q: Do I need a Claude API key for development?**
A: Yes, for AI features. Use Demo Mode for testing without API key.

**Q: Can I contribute without TypeScript experience?**
A: TypeScript knowledge is helpful, but we can help during code review.

**Q: How do I test PDF upload functionality?**
A: Use a sample CliftonStrengths PDF or the demo mode for testing.

**Q: What if I break something during development?**
A: No worries! Use git to reset changes, and we're here to help.

**Q: Can I suggest new features?**
A: Absolutely! Open a GitHub Discussion or Issue with your ideas.

---

**Ready to contribute to PeakPath?**

[![Start Contributing](https://img.shields.io/badge/Start_Contributing-4285f4?style=for-the-badge&logo=github)](https://github.com/aporb/PeakPath/fork)

Let's build the future of strengths-based development together! 🚀