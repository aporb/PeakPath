# PeakPath Architecture Guide 🏗️

This document provides a comprehensive overview of PeakPath's technical architecture, design decisions, and system components.

## 📋 Table of Contents
- [System Overview](#-system-overview)
- [Technology Stack](#-technology-stack)
- [Application Architecture](#-application-architecture)
- [Data Flow](#-data-flow)
- [Component Architecture](#-component-architecture)
- [API Design](#-api-design)
- [Storage Strategy](#-storage-strategy)
- [Security Architecture](#-security-architecture)
- [Performance Considerations](#-performance-considerations)
- [Design Decisions](#-design-decisions)

---

## 🌐 System Overview

PeakPath is a **privacy-first, AI-powered CliftonStrengths coaching platform** built as a modern web application. The architecture prioritizes user privacy, responsive performance, and seamless AI integration while maintaining a clean, maintainable codebase.

### Core Principles
1. **Privacy-First**: All user data stays in the browser - no server-side storage of personal information
2. **AI-Enhanced**: Claude API integration for contextual coaching insights
3. **Progressive Enhancement**: Works offline with cached data, enhanced with AI when online
4. **Mobile-First**: Responsive design optimized for all devices
5. **Developer Experience**: Modern tooling, TypeScript throughout, comprehensive error handling

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 15**: React framework with App Router for modern full-stack development
- **React 18**: Component-based UI with concurrent features
- **TypeScript 5+**: Full type safety throughout the application

### UI & Styling
- **shadcn/ui**: Production-ready components built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Consistent icon system with 1000+ icons

### Backend & API
- **Next.js API Routes**: Serverless functions for backend logic
- **Claude API (Anthropic)**: AI coaching intelligence via Sonnet models
- **Vercel Functions**: Serverless deployment with edge optimization

### Development & Tooling
- **ESLint**: Code quality and consistency
- **Prettier**: Automated code formatting
- **Git**: Version control with conventional commits
- **Vercel**: CI/CD and production hosting

---

## 🏛️ Application Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Landing Page  │    │ Coaching App    │                │
│  │   (/)          │    │ (/coach)        │                │
│  └─────────────────┘    └─────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│                   localStorage                               │
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │ Session Data    │    │ Chat History    │                │
│  │ (Profiles)      │    │ (Conversations) │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Next.js Server (Vercel)                     │
├─────────────────────────────────────────────────────────────┤
│  API Routes:                                                │
│  ├─ /api/upload      (PDF Processing)                       │
│  ├─ /api/coach       (AI Coaching)                          │
│  ├─ /api/coach/stream (Streaming Responses)                 │
│  └─ /api/health      (Health Check)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ External API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Claude API (Anthropic)                         │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Sonnet 3.5 Model for Contextual Coaching               ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure
```
PeakPath/
├── frontend/                   # Main Next.js application
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── layout.tsx     # Root layout & metadata
│   │   │   ├── page.tsx       # Landing page (/)
│   │   │   ├── coach/         # Coaching application
│   │   │   │   └── page.tsx   # Main dashboard (/coach)
│   │   │   └── api/           # Server API routes
│   │   │       ├── upload/    # PDF processing endpoint
│   │   │       └── coach/     # AI coaching endpoints
│   │   ├── components/        # React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── landing/      # Landing page components
│   │   │   └── [features]/   # Feature-specific components
│   │   ├── lib/              # Utilities and services
│   │   │   ├── session-storage.ts    # localStorage utilities
│   │   │   ├── demo-data.ts          # Demo profile data
│   │   │   └── services/             # Business logic
│   │   ├── types/            # TypeScript definitions
│   │   └── hooks/            # Custom React hooks
│   ├── components.json       # shadcn/ui configuration
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── next.config.mjs       # Next.js configuration
└── docs/                     # Documentation
```

---

## 🔄 Data Flow

### User Journey Data Flow

#### 1. Landing Page Flow
```
User visits (/) → Landing Component → Demo/Upload Choice
    │
    ├─ Demo Mode → Load Demo Data → Navigate to /coach
    │
    └─ PDF Upload → /api/upload → Parse PDF → Store in sessionStorage → Navigate to /coach
```

#### 2. Coaching Application Flow  
```
/coach page → Check sessionStorage/localStorage
    │
    ├─ Session Found → Load Profile → Initialize Dashboard
    │
    └─ No Session → Redirect to Landing (/)
```

#### 3. AI Coaching Flow
```
User Message → Chat Component → /api/coach → Claude API
                                    │
                                    ├─ Stream Mode: /api/coach/stream
                                    └─ Standard Mode: /api/coach
                                            │
                                            ▼
Response → Update Chat State → Save to localStorage
```

### Data Processing Pipeline

#### PDF Processing Pipeline
```
PDF File Upload → FormData → /api/upload
    │
    ├─ Validation (file type, size)
    ├─ PDF Parsing (extract text)
    ├─ CliftonStrengths Detection
    ├─ Strength Profile Generation
    └─ Return Structured Data → Client Storage
```

#### AI Coaching Pipeline
```
User Input + Context → Request Preparation
    │
    ├─ Message + Strength Context
    ├─ Conversation History
    ├─ Profile Metadata  
    └─ Full PDF Content
            │
            ▼
Claude API Request → AI Processing → Response
    │
    ├─ Streaming: Character-by-character
    └─ Standard: Complete response
            │
            ▼
Client Response Handling → UI Update → History Storage
```

---

## 🧩 Component Architecture

### Component Hierarchy
```
App Layout
├── Landing Page (/)
│   ├── Hero Section
│   ├── Features Grid
│   ├── Demo Upload Component
│   ├── File Upload Component
│   └── Trust Signals
│
└── Coaching App (/coach)
    ├── Session Banner
    ├── Dashboard
    │   ├── Profile Overview
    │   ├── Strength Cards Grid
    │   └── Domain Visualization
    ├── Chat Interface
    │   ├── Message List
    │   ├── Input Form
    │   └── Quick Actions
    └── Session Manager UI
```

### Component Design Patterns

#### 1. Container/Presentational Pattern
```typescript
// Container Component (Data Logic)
export default function CoachingPage() {
  const [profile, setProfile] = useState<StrengthProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Data fetching and state management
  
  return (
    <Dashboard 
      profile={profile}
      messages={chatMessages}
      onSendMessage={handleSendMessage}
    />
  );
}

// Presentational Component (UI Logic)
export function Dashboard({ profile, messages, onSendMessage }: DashboardProps) {
  // Pure UI rendering with props
  return (
    <div className="dashboard-layout">
      {/* UI components */}
    </div>
  );
}
```

#### 2. Compound Component Pattern
```typescript
// Chat interface with multiple related components
<CoachChat>
  <CoachChat.MessageList messages={messages} />
  <CoachChat.InputForm onSubmit={onSendMessage} />
  <CoachChat.QuickActions actions={quickActions} />
</CoachChat>
```

#### 3. Custom Hook Pattern
```typescript
// Extract complex logic into reusable hooks
export function useSessionManager() {
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  
  const saveSession = useCallback((profile: StrengthProfile) => {
    const sessionId = SessionManager.saveSession(profile);
    setCurrentSession(sessionId);
    return sessionId;
  }, []);
  
  return { currentSession, saveSession, /* other methods */ };
}
```

---

## 🔌 API Design

### RESTful Endpoints

#### Upload API (`/api/upload`)
```typescript
POST /api/upload
Content-Type: multipart/form-data

Request:
  - pdf: File (CliftonStrengths PDF)

Response:
  - 200: StrengthProfile
  - 400: Invalid file format
  - 413: File too large
  - 500: Processing error
```

#### Coaching API (`/api/coach`)
```typescript
POST /api/coach
Content-Type: application/json

Request: {
  message: string;
  strengthContext?: string;
  profileId: string;
  conversationHistory: ChatMessage[];
  fullPDFContent: string;
}

Response: {
  coach: {
    response: string;
    timestamp: string;
  }
}
```

#### Streaming Coaching API (`/api/coach/stream`)
```typescript
POST /api/coach/stream
Content-Type: application/json
Response: text/plain (streaming)

Request: Same as /api/coach
Response: Server-Sent Events with chunks
```

### API Architecture Principles

1. **Stateless**: Each request contains all necessary information
2. **Consistent Error Handling**: Standardized error response format
3. **Input Validation**: Zod schemas for type-safe validation
4. **Rate Limiting**: Built-in Vercel rate limiting
5. **Caching**: Appropriate cache headers for static content

---

## 💾 Storage Strategy

### Client-Side Storage Architecture

#### localStorage Structure
```typescript
// Session Storage Schema
interface UserSession {
  profile: StrengthProfile;
  isDemoMode: boolean;
  createdAt: string;
  lastAccessedAt: string;
  sessionId: string;
}

// Storage Keys
'peakpath_sessions'        // Map<sessionId, UserSession>
'peakpath_current_session' // Current active session ID
'peakpath_chat_history_*'  // Chat history per session
```

#### Storage Management
```typescript
class SessionManager {
  // CRUD operations for sessions
  static saveSession(profile: StrengthProfile, isDemoMode: boolean): string
  static loadSession(sessionId?: string): UserSession | null
  static deleteSession(sessionId: string): void
  static getAllSessions(): Map<string, UserSession>
  
  // Chat history management  
  static saveChatHistory(sessionId: string, messages: ChatMessage[]): void
  static loadChatHistory(sessionId: string): ChatMessage[]
  
  // Maintenance
  static cleanupExpiredSessions(daysOld: number): void
}
```

### Privacy & Security
- **No Server Storage**: Personal data never leaves the client
- **Session Isolation**: Each profile maintained separately
- **Auto Cleanup**: Expired sessions automatically removed
- **Data Validation**: Input sanitization and type checking

---

## 🔒 Security Architecture

### Client-Side Security

#### Data Protection
```typescript
// Input sanitization for all user inputs
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(userInput);
```

#### API Security
```typescript
// Server-side validation with Zod
const RequestSchema = z.object({
  message: z.string().min(1).max(2000),
  strengthContext: z.string().optional(),
  profileId: z.string().uuid()
});

export async function POST(request: NextRequest) {
  try {
    const body = RequestSchema.parse(await request.json());
    // Process validated input
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}
```

### Environment Security
```bash
# Secure environment variable handling
CLAUDE_API_KEY=sk-ant-***  # Server-side only
NEXT_PUBLIC_APP_URL=https://peak-path.vercel.app  # Client-safe
```

### Privacy Measures
1. **No Cookies**: Session state in localStorage only
2. **No Analytics**: No external tracking or analytics
3. **API Key Protection**: Claude key never exposed to client
4. **HTTPS Only**: All production traffic encrypted
5. **CORS Policy**: Restricted to specific domains

---

## ⚡ Performance Considerations

### Client-Side Optimization

#### Code Splitting
```typescript
// Route-based code splitting (automatic)
const CoachingPage = lazy(() => import('./coach/page'));

// Component-based code splitting
const DemoData = lazy(() => import('@/lib/demo-data'));
```

#### State Management
```typescript
// Efficient state updates with React best practices
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

const handleNewMessage = useCallback((message: ChatMessage) => {
  setChatMessages(prev => [...prev, message]);
}, []);

const memoizedProfile = useMemo(() => 
  profile && processProfileData(profile), 
  [profile]
);
```

#### Asset Optimization
- **Next.js Image**: Automatic image optimization
- **Font Optimization**: Google Fonts with font-display: swap
- **Bundle Analysis**: Regular bundle size monitoring
- **Tree Shaking**: Automatic unused code elimination

### Server-Side Optimization

#### API Performance
```typescript
// Streaming responses for better UX
export async function POST(request: NextRequest) {
  const stream = new ReadableStream({
    async start(controller) {
      // Stream Claude API response in real-time
      for await (const chunk of claudeStream) {
        controller.enqueue(chunk);
      }
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
```

#### Caching Strategy
```typescript
// API route caching headers
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'CDN-Cache-Control': 'public, max-age=86400'
    }
  });
}
```

---

## 🎯 Design Decisions

### Technology Choices

#### Why Next.js 15?
- **App Router**: Modern routing with nested layouts
- **Server Components**: Automatic optimization
- **API Routes**: Full-stack in one framework
- **Vercel Integration**: Seamless deployment
- **TypeScript Support**: First-class TypeScript experience

#### Why shadcn/ui?
- **Radix Primitives**: Accessible by default
- **Customizable**: Own the code, not a dependency
- **Modern Design**: Professional appearance
- **TypeScript**: Fully typed components
- **Community**: Active development and support

#### Why localStorage over Database?
- **Privacy**: Data never leaves user's browser
- **Performance**: Instant access, no network requests
- **Simplicity**: No database management overhead  
- **Offline**: Works without internet connection
- **Cost**: No database hosting costs

### Architectural Decisions

#### Single Page Application vs Multi-Page
**Choice**: Multi-page with client-side state
- **Benefits**: Better SEO, simpler routing, progressive enhancement
- **Trade-offs**: Some state management complexity

#### Monorepo vs Multiple Repositories  
**Choice**: Single repository with workspace structure
- **Benefits**: Easier dependency management, coordinated releases
- **Trade-offs**: Larger repository size

#### REST vs GraphQL
**Choice**: RESTful APIs with focused endpoints
- **Benefits**: Simpler implementation, better caching, smaller bundle size
- **Trade-offs**: Multiple requests for complex data

### Future Architecture Considerations

#### Planned Enhancements
1. **Progressive Web App**: Offline capabilities
2. **Web Workers**: Background processing for large PDFs
3. **Service Worker**: Caching for performance
4. **Real-time Features**: WebSocket for live coaching sessions

#### Scalability Considerations
1. **API Rate Limiting**: Implement proper throttling
2. **CDN Integration**: Global content delivery
3. **Database Migration Path**: If server-side storage needed
4. **Microservices**: Break apart for team analytics

---

## 📊 Metrics & Monitoring

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Bundle Size**: Track JavaScript bundle growth
- **API Response Times**: Monitor coaching response latency
- **Error Rates**: Track and alert on application errors

### User Experience Metrics  
- **Session Persistence**: How often users return to saved sessions
- **Demo Conversion**: Demo to real upload conversion rate
- **Feature Usage**: Most used coaching features
- **Mobile Usage**: Device and browser analytics

---

This architecture guide provides the technical foundation for understanding and contributing to PeakPath. For implementation details, see our [Development Guide](development.md) and [API Reference](API.md).