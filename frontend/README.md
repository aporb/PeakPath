# PeakPath Frontend

Modern Next.js 15 frontend application with professional landing page, comprehensive session management, and AI-powered CliftonStrengths coaching platform.

## 🏗️ Architecture Overview

This frontend is built with Next.js 15 using the App Router, featuring:

- **Landing Page** (`/`) - Professional marketing page with demo capabilities
- **Coaching Application** (`/coach`) - Full-featured coaching dashboard
- **Session Management** - localStorage-based persistence
- **shadcn/ui Components** - Complete design system
- **AI Integration** - Claude API coaching

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+ and npm 9+
Claude API key from Anthropic Console
```

### Installation
```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add CLAUDE_API_KEY to .env.local

# Start development server
npm run dev  # http://localhost:8000
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page (/)
│   ├── globals.css              # Global styles + shadcn variables
│   ├── coach/                   # Coaching application
│   │   └── page.tsx            # Main coaching dashboard (/coach)
│   └── api/                     # API routes
│       ├── health/route.ts      # Health endpoint
│       ├── upload/route.ts      # PDF upload & processing
│       └── coach/
│           ├── route.ts         # AI coaching
│           └── stream/route.ts  # Streaming responses
├── components/                   # React components
│   ├── landing/                 # Landing page components
│   │   ├── streamlined-landing.tsx    # Main landing component
│   │   ├── hero.tsx                   # Hero section
│   │   ├── features.tsx               # Features grid
│   │   ├── cta.tsx                    # Call-to-action
│   │   ├── trust-signals.tsx          # Trust indicators
│   │   ├── how-it-works.tsx           # Process explanation
│   │   ├── faq.tsx                    # FAQ section
│   │   ├── pricing.tsx                # Pricing (future)
│   │   ├── footer.tsx                 # Footer component
│   │   ├── file-upload-demo.tsx       # Interactive demo
│   │   └── index.ts                   # Barrel exports
│   ├── ui/                      # shadcn/ui components (48+)
│   │   ├── button.tsx          # Button component
│   │   ├── card.tsx            # Card component
│   │   ├── dialog.tsx          # Modal dialogs
│   │   ├── badge.tsx           # Badge component
│   │   ├── progress.tsx        # Progress bars
│   │   ├── toast.tsx           # Toast notifications
│   │   └── ...                 # All shadcn/ui components
│   ├── SessionManager.tsx       # Session management UI
│   ├── Dashboard.tsx           # Main coaching dashboard
│   ├── StrengthCard.tsx        # Interactive strength cards
│   ├── FileUpload.tsx          # File upload component
│   ├── CoachChat.tsx          # AI chat interface
│   ├── LoadingSpinner.tsx      # Loading animations
│   ├── theme-provider.tsx      # Theme context
│   └── index.ts               # Component exports
├── lib/                        # Utilities and services
│   ├── session-storage.ts      # localStorage session manager
│   ├── demo-data.ts           # Demo profile data
│   ├── utils.ts               # Utility functions
│   └── services/              # Business logic
│       ├── claudeCoachingService.ts    # Claude AI integration
│       └── cliftonStrengthsPDFParser.ts # PDF processing
├── hooks/                      # Custom React hooks
│   ├── use-toast.ts           # Toast hook
│   └── use-mobile.ts          # Mobile detection
└── types/                      # TypeScript definitions
    └── strength.ts            # Core interfaces
```

## 🎨 Component System

### shadcn/ui Integration
Our frontend uses the complete shadcn/ui component library:

```bash
# Components configuration
components.json                 # shadcn/ui setup
src/lib/utils.ts               # Tailwind utilities
src/app/globals.css            # CSS variables
```

### Key Components

#### Landing Page Components
```typescript
// Main landing page
<StreamlinedLanding />

// Individual sections
<Hero />                       // Hero section with CTA
<Features />                   // Feature grid
<HowItWorks />                // Process explanation
<TrustSignals />              // Security indicators
<FAQ />                       // Frequently asked questions
<Footer />                    // Footer with links
```

#### Coaching Components
```typescript
// Main coaching interface
<Dashboard 
  profile={strengthProfile}
  onFileUpload={handleFileUpload}
  onStrengthClick={handleStrengthClick}
  onStartCoaching={handleStartCoaching}
/>

// Chat interface
<CoachChat
  messages={chatMessages}
  onSendMessage={handleSendMessage}
  isTyping={isChatTyping}
  relatedStrengths={topFiveStrengths}
/>

// Floating chat widget
<FloatingChat
  isOpen={isChatOpen}
  onToggle={toggleChat}
  onToggleExpanded={expandChat}
/>
```

#### Session Management
```typescript
// Session management UI
<SessionManagerUI
  currentSessionId={sessionId}
  onSessionLoad={handleSessionLoad}
  onSessionDelete={handleSessionDelete}
/>
```

### shadcn/ui Components Available
All 48+ shadcn/ui components are available:

```typescript
// Form components
Button, Input, Label, Textarea, Checkbox, Radio, Switch, Select

// Layout components  
Card, Separator, Aspect Ratio, Collapsible, Resizable

// Navigation
Navigation Menu, Breadcrumb, Pagination, Tabs

// Feedback
Toast, Alert, Progress, Skeleton, Badge

// Overlays
Dialog, Sheet, Popover, Hover Card, Tooltip, Context Menu, Dropdown Menu

// Data Display
Table, Calendar, Chart, Avatar, Carousel

// And many more...
```

## 🎮 API Integration

### Client-Side API Calls

#### File Upload
```typescript
// Upload CliftonStrengths PDF
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  return response.json(); // Returns StrengthProfile
};
```

#### AI Coaching
```typescript
// Send coaching message
const sendMessage = async (message: string, context?: string) => {
  const response = await fetch('/api/coach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      strengthContext: context,
      profileId: profile?.id,
      conversationHistory: chatMessages.slice(-10),
      fullPDFContent: profile?.fullPDFContent
    }),
  });
  
  return response.json();
};

// Streaming coaching responses
const sendStreamingMessage = async (message: string, onChunk: (chunk: string) => void) => {
  const response = await fetch('/api/coach/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ /* same as above */ }),
  });
  
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
};
```

## 💾 Session Management

### localStorage Integration
The frontend implements comprehensive session management:

```typescript
import { SessionManager } from '@/lib/session-storage';

// Save session
const sessionId = SessionManager.saveSession(profile, isDemoMode);

// Load session
const session = SessionManager.loadSession(sessionId);

// Save chat history
SessionManager.saveChatHistory(sessionId, messages);

// Load chat history
const messages = SessionManager.loadChatHistory(sessionId);

// Get all sessions
const sessions = SessionManager.getAllSessions();

// Delete session
SessionManager.deleteSession(sessionId);

// Auto cleanup
SessionManager.cleanupExpiredSessions(30); // 30 days
```

### Session Data Structure
```typescript
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

## 🎭 Demo Mode Implementation

### Demo Data
```typescript
// Demo profile with realistic CliftonStrengths data
export const DEMO_STRENGTH_PROFILE: StrengthProfile = {
  id: 'demo-profile-001',
  userId: 'Demo User',
  assessmentDate: '2024-12-01',
  strengths: [
    {
      name: 'Strategic',
      rank: 1,
      domain: StrengthDomain.STRATEGIC_THINKING,
      isTopFive: true,
      description: 'You create alternative ways to proceed...'
    },
    // ... 9 more strengths
  ],
  fullPDFContent: '/* Complete simulated PDF content */',
  domainCounts: {
    [StrengthDomain.STRATEGIC_THINKING]: 3,
    [StrengthDomain.EXECUTING]: 4,
    [StrengthDomain.INFLUENCING]: 2,
    [StrengthDomain.RELATIONSHIP_BUILDING]: 1
  }
};
```

### Demo Mode Flow
```typescript
// Landing page demo trigger
const simulateUpload = () => {
  setIsRealUpload(false);
  setUploadStep(1);
  setTimeout(() => setUploadStep(2), 2000);
  setTimeout(() => setUploadStep(3), 4000);
  setTimeout(() => {
    sessionStorage.setItem('demoMode', 'true');
    window.location.href = '/coach';
  }, 6000);
};

// Coach page demo detection
React.useEffect(() => {
  const demoMode = sessionStorage.getItem('demoMode');
  if (demoMode === 'true') {
    import('@/lib/demo-data').then(({ DEMO_STRENGTH_PROFILE }) => {
      setStrengthProfile(DEMO_STRENGTH_PROFILE);
      setAppState('dashboard');
      setIsDemoMode(true);
      
      const sessionId = SessionManager.saveSession(DEMO_STRENGTH_PROFILE, true);
      setCurrentSessionId(sessionId);
      
      sessionStorage.removeItem('demoMode');
    });
  }
}, []);
```

## 🎨 Styling & Theming

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // shadcn/ui color system
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... complete color system
        
        // Gallup domain colors
        purple: { /* Executing domain */ },
        orange: { /* Influencing domain */ },
        blue: { /* Relationship Building */ },
        green: { /* Strategic Thinking */ },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### CSS Variables
```css
/* globals.css */
:root {
  /* shadcn/ui variables */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  /* ... complete variable system */
  
  --radius: 0.625rem;
}

.dark {
  /* Dark theme variables */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark theme system */
}
```

### Component Styling
```typescript
// Using class-variance-authority for component variants
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        // ... more variants
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## 🔧 Development Workflow

### Available Scripts
```bash
npm run dev           # Start development server (localhost:8000)
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint with type checking
npm run type-check    # TypeScript type checking only
```

### Adding New Components

#### shadcn/ui Components
```bash
# Add new shadcn/ui component
npx shadcn@latest add <component-name>

# Examples:
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

#### Custom Components
```typescript
// Create new component in src/components/
// Follow the pattern:

import React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function MyComponent({ className, children, ...props }: MyComponentProps) {
  return (
    <div className={cn("default-styles", className)} {...props}>
      {children}
    </div>
  );
}

// Export from index.ts
export { MyComponent } from './MyComponent';
```

### TypeScript Interfaces
```typescript
// types/strength.ts - Core interfaces
export interface StrengthProfile {
  id: string;
  userId: string;
  assessmentDate: string;
  strengths: Strength[];
  fullPDFContent: string;
  domainCounts: Record<StrengthDomain, number>;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  strengthContext?: string;
}

export enum StrengthDomain {
  EXECUTING = 'executing',
  INFLUENCING = 'influencing', 
  RELATIONSHIP_BUILDING = 'relationship-building',
  STRATEGIC_THINKING = 'strategic-thinking'
}
```

## 🧪 Testing & Development

### Component Testing
```typescript
// Example component usage and testing
import { render, screen } from '@testing-library/react';
import { SessionManagerUI } from '@/components/SessionManager';

test('renders session manager', () => {
  render(
    <SessionManagerUI
      currentSessionId="session-1"
      onSessionLoad={jest.fn()}
      onSessionDelete={jest.fn()}
    />
  );
  
  expect(screen.getByText('Sessions')).toBeInTheDocument();
});
```

### Manual Testing Checklist
- [ ] Landing page loads and displays properly
- [ ] Demo mode works end-to-end
- [ ] Real PDF upload processes correctly
- [ ] Session management saves/loads sessions
- [ ] Chat interface functions properly
- [ ] Mobile responsive design works
- [ ] All shadcn/ui components render correctly

## 📱 Mobile Optimization

### Responsive Design
```typescript
// Mobile-first component example
export function ResponsiveComponent() {
  return (
    <div className="
      w-full 
      px-4 
      md:px-6 
      lg:px-8
      grid 
      grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-3 
      gap-4 
      md:gap-6
    ">
      {/* Content adapts to screen size */}
    </div>
  );
}
```

### Mobile-Specific Features
- **Full-screen chat** - Mobile chat takes full viewport
- **Touch targets** - 44px+ minimum for all interactive elements
- **Swipe gestures** - Navigate between sections
- **Progressive enhancement** - Desktop features layer over mobile base

## 🔐 Security Considerations

### Client-Side Security
```typescript
// Input sanitization
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);

// Environment variables
const API_KEY = process.env.CLAUDE_API_KEY; // Server-side only
const PUBLIC_URL = process.env.NEXT_PUBLIC_APP_URL; // Client-side accessible
```

### Data Privacy
- **localStorage only** - No sensitive data sent to external servers
- **Session isolation** - Each profile maintained separately  
- **Auto cleanup** - Expired sessions automatically removed
- **No tracking** - No analytics or external tracking scripts

## 🚀 Production Build

### Build Optimization
```bash
# Production build
npm run build

# Analyze bundle size
npm run build && npx @next/bundle-analyzer
```

### Performance Features
- **Code splitting** - Automatic route-based splitting
- **Image optimization** - Next.js Image component
- **Font optimization** - Automatic font loading
- **CSS optimization** - Tailwind purging and minification

## 🆘 Troubleshooting

### Common Development Issues

**Components not rendering:**
```bash
# Check shadcn/ui installation
npx shadcn@latest add button

# Verify Tailwind config
npm run dev

# Check import paths
# Use @/ for src/ directory imports
import { Button } from '@/components/ui/button';
```

**Session management issues:**
```bash
# Clear localStorage in browser dev tools
localStorage.clear();

# Check SessionManager import
import { SessionManager } from '@/lib/session-storage';

# Verify localStorage availability
console.log(SessionManager.isAvailable());
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

---

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/primitives/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

Built with ❤️ using modern React patterns and best practices!