# PeakPath: Updated Comprehensive Action Plan
## Post-Repository Updates Analysis & Implementation Roadmap

**Analysis Date:** January 2025  
**Base Review:** `/docs/code-and-accessibility-review.md`  
**Multi-Agent Analysis:** Security, Accessibility, Performance, Code Quality  
**Framework:** Next.js 15, React 19, TypeScript 5

---

## Executive Summary

Following the comprehensive multi-agent analysis of your updated repository, this action plan consolidates findings from specialized security, accessibility, performance, and code quality assessments. While some improvements have been made (notably the domain color alignment fixes), **critical security vulnerabilities and WCAG 2.2 AA compliance issues remain unaddressed** and require immediate attention.

### Current Status Assessment
- ✅ **Domain Colors**: Successfully aligned with individual strengths
- 🔴 **Security**: Critical vulnerabilities persist (XSS, build safety, input validation)
- 🔴 **Accessibility**: Major WCAG 2.2 AA violations remain
- 🟡 **Performance**: Optimization opportunities identified
- 🟡 **Code Quality**: Architecture strong, but safety checks still bypassed

---

## Priority 1: Critical Security Vulnerabilities (IMMEDIATE ACTION)

### 1.1 XSS Vulnerability - STILL PRESENT 🔴
**Location**: `frontend/src/components/CoachChat.tsx:190-194`  
**Risk Level**: CRITICAL - Unchanged from original review

```typescript
// CURRENT VULNERABLE CODE:
<div 
  className="text-sm leading-relaxed"
  dangerouslySetInnerHTML={{
    __html: message.sender === 'coach' 
      ? formatCoachMessage(message.content)
      : message.content.replace(/\n/g, '<br/>')
  }}
/>

// REQUIRED FIX:
import DOMPurify from 'isomorphic-dompurify';

<div 
  className="text-sm leading-relaxed"
  dangerouslySetInnerHTML={{
    __html: message.sender === 'coach' 
      ? DOMPurify.sanitize(formatCoachMessage(message.content), {
          ALLOWED_TAGS: ['strong', 'div', 'span', 'br', 'p'],
          ALLOWED_ATTR: ['class'],
          KEEP_CONTENT: true
        })
      : DOMPurify.sanitize(message.content.replace(/\n/g, '<br/>'), {
          ALLOWED_TAGS: ['br'],
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true
        })
  }}
/>
```

**Implementation Steps:**
1. Install DOMPurify: `npm install isomorphic-dompurify`
2. Install types: `npm install --save-dev @types/dompurify`
3. Replace the vulnerable code block in CoachChat.tsx
4. Test with malicious input scenarios

### 1.2 Build Safety Bypasses - STILL CRITICAL 🔴
**Location**: `frontend/next.config.ts:4-9`  
**Status**: No changes detected - still bypassing critical safety checks

```typescript
// CURRENT DANGEROUS CONFIGURATION:
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // 🔴 CRITICAL: Allows linting violations in production
  },
  typescript: {
    ignoreBuildErrors: true,   // 🔴 CRITICAL: Ignores type errors in production
  },
};

// REQUIRED FIX:
const nextConfig: NextConfig = {
  // Remove the dangerous bypasses completely
  eslint: {
    dirs: ['src', 'components', 'lib', 'app'], // Specify directories to lint
  },
  typescript: {
    tsconfigPath: './tsconfig.json', // Use proper TypeScript configuration
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/*'],
    webpackMemoryOptimizations: true,
  },
  poweredByHeader: false, // Security improvement
  reactStrictMode: true,  // Enable strict mode
};
```

### 1.3 Missing Input Validation - API Routes Vulnerable 🔴
**Affected Files**: 
- `frontend/src/app/api/coach/route.ts`
- `frontend/src/app/api/upload/route.ts`

```typescript
// INSTALL VALIDATION LIBRARY:
npm install zod

// API ROUTE VALIDATION EXAMPLE (coach/route.ts):
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

const coachRequestSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message too long')
    .refine(val => !/<script|javascript:|data:/i.test(val), 'Invalid content'),
  strengthContext: z.string().optional(),
  profileId: z.string().uuid().optional(),
  conversationHistory: z.array(z.any()).max(10).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = coachRequestSchema.parse(body);
    
    // Rate limiting check
    const clientIP = request.ip || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests' }, 
        { status: 429 }
      );
    }
    
    // Process validated data
    // ... rest of handler
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors }, 
        { status: 400 }
      );
    }
    // ... error handling
  }
}
```

### 1.4 Missing Security Headers - CSP Implementation 🔴
**Required**: Create `frontend/middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-inline'" : ''};
    img-src 'self' blob: data: https:;
    font-src 'self' https: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' ${isDev ? 'http://localhost:8000' : ''};
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
```

---

## Priority 2: WCAG 2.2 AA Accessibility Compliance (HIGH PRIORITY)

### 2.1 Missing Semantic Structure - UNRESOLVED 🔴
**Location**: `frontend/src/app/layout.tsx:27-35`  
**WCAG Violation**: SC 1.3.1 (Info and Relationships)

```tsx
// CURRENT STRUCTURE (Missing semantic landmarks):
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}  {/* No semantic structure */}
      </body>
    </html>
  );
}

// REQUIRED ACCESSIBLE STRUCTURE:
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Skip link for keyboard navigation */}
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50">
          Skip to main content
        </a>
        
        <div id="root" className="min-h-screen flex flex-col">
          <header role="banner" className="sr-only">
            <h1>PeakPath - CliftonStrengths Coach</h1>
          </header>
          
          <main id="main-content" role="main" className="flex-1">
            {children}
          </main>
          
          <footer role="contentinfo" className="sr-only">
            <p>PeakPath Application</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
```

### 2.2 Color-Only Information - PARTIALLY RESOLVED ✅/🔴
**Status**: Domain colors aligned correctly, but still missing visual indicators

**Location**: `frontend/src/components/Dashboard.tsx` (domain summary cards)

```tsx
// ADD VISUAL INDICATORS BEYOND COLOR:
import { 
  Zap,        // Executing
  Megaphone,  // Influencing 
  Heart,      // Relationship Building
  Brain       // Strategic Thinking
} from 'lucide-react';

const domainIcons = {
  [StrengthDomain.EXECUTING]: <Zap className="w-5 h-5" aria-hidden="true" />,
  [StrengthDomain.INFLUENCING]: <Megaphone className="w-5 h-5" aria-hidden="true" />,
  [StrengthDomain.RELATIONSHIP_BUILDING]: <Heart className="w-5 h-5" aria-hidden="true" />,
  [StrengthDomain.STRATEGIC_THINKING]: <Brain className="w-5 h-5" aria-hidden="true" />,
};

// UPDATE DOMAIN SUMMARY CARDS:
<div className="text-center">
  <div className={`w-12 h-12 bg-gradient-to-r ${domainGradient} rounded-full flex items-center justify-center mx-auto mb-3`}>
    {domainIcons[domain]} {/* Add icon */}
    <span className="sr-only">{DOMAIN_NAMES[domain]} domain</span>
  </div>
  <div className="text-sm font-medium text-gray-600 mb-1">
    <span className="font-semibold">{DOMAIN_NAMES[domain]}</span>
    <span className="sr-only">: {topFiveCount} of your top 5 strengths</span>
  </div>
</div>
```

### 2.3 Missing ARIA Labels and Descriptions 🔴
**Multiple Locations Require Updates:**

```tsx
// CHAT INTERFACE (CoachChat.tsx):
<div 
  role="log"
  aria-live="polite" 
  aria-label="Chat conversation with AI Strengths Coach"
  className="flex-1 overflow-y-auto p-3 space-y-3"
>
  {messages.map((message, index) => (
    <div
      key={message.id}
      role="article"
      aria-label={`${message.sender === 'user' ? 'Your' : 'Coach'} message from ${formatTime(message.timestamp)}`}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {/* Message content */}
    </div>
  ))}
</div>

// CHAT INPUT:
<input
  ref={inputRef}
  type="text"
  value={inputMessage}
  onChange={(e) => setInputMessage(e.target.value)}
  placeholder={selectedStrength ? `Ask about ${selectedStrength}...` : "Ask about your strengths..."}
  aria-label={selectedStrength ? `Ask a question about your ${selectedStrength} strength` : "Ask a question about your strengths"}
  aria-describedby="chat-input-description"
  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
  disabled={isTyping}
/>
<div id="chat-input-description" className="sr-only">
  Type your question and press Enter or click Send to get coaching advice
</div>

// DOMAIN FILTER BUTTONS (Dashboard.tsx):
<button
  key={domain}
  onClick={() => setSelectedDomain(domain)}
  aria-pressed={selectedDomain === domain}
  aria-label={`Filter by ${DOMAIN_NAMES[domain]} domain. ${getDomainStrengthCount(domain)} strengths in this domain.`}
  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
    selectedDomain === domain
      ? `bg-gradient-to-r ${domainGradient} text-white shadow-md`
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  }`}
>
  {domainIcons[domain]}
  {DOMAIN_NAMES[domain]}
</button>
```

### 2.4 Focus Management Implementation 🔴
**Create**: `frontend/src/hooks/useFocusManagement.ts`

```typescript
import { useRef, useCallback, useEffect } from 'react';

export function useFocusManagement() {
  const focusStackRef = useRef<HTMLElement[]>([]);
  
  const pushFocus = useCallback((element: HTMLElement) => {
    if (document.activeElement instanceof HTMLElement) {
      focusStackRef.current.push(document.activeElement);
    }
    element.focus();
  }, []);
  
  const popFocus = useCallback(() => {
    const previousElement = focusStackRef.current.pop();
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus();
    }
  }, []);
  
  const trapFocus = useCallback((containerRef: React.RefObject<HTMLElement>) => {
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);
  
  return { pushFocus, popFocus, trapFocus };
}
```

---

## Priority 3: Performance Optimization (MEDIUM PRIORITY)

### 3.1 Bundle Optimization - Missing Next.js 15 Features 🟡
**Update**: `frontend/next.config.ts`

```typescript
const nextConfig: NextConfig = {
  // ... security fixes from Priority 1
  
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    ],
    webpackMemoryOptimizations: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize fonts
  optimizeFonts: true,
};
```

### 3.2 Component-Level Performance 🟡
**Optimize Heavy Components:**

```typescript
// MEMOIZE DASHBOARD CALCULATIONS (Dashboard.tsx):
import { useMemo } from 'react';

const domainStats = useMemo(() => {
  if (!profile?.strengths) return [];
  
  return domains.map(domain => {
    const domainStrengths = profile.strengths.filter(s => s.domain === domain);
    const topFiveCount = domainStrengths.filter(s => s.isTopFive).length;
    return {
      domain,
      count: domainStrengths.length,
      topFiveCount,
    };
  });
}, [profile?.strengths, domains]);

// MEMOIZE CHAT MESSAGE FORMATTING (CoachChat.tsx):
import { memo } from 'react';

const MessageContent = memo(({ message }: { message: ChatMessage }) => {
  const formattedContent = useMemo(() => {
    return message.sender === 'coach' 
      ? DOMPurify.sanitize(formatCoachMessage(message.content), sanitizeOptions)
      : DOMPurify.sanitize(message.content.replace(/\n/g, '<br/>'), basicSanitizeOptions);
  }, [message.content, message.sender]);

  return (
    <div 
      className="text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
});
```

### 3.3 Dynamic Loading Implementation 🟡
**Add Code Splitting:**

```typescript
// LAZY LOAD HEAVY COMPONENTS (coach/page.tsx):
import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const CoachChat = lazy(() => import('@/components/CoachChat'));
const FloatingChat = lazy(() => import('@/components/CoachChat').then(mod => ({ default: mod.FloatingChat })));
const SessionManagerUI = lazy(() => import('@/components/SessionManager'));

// WRAP IN SUSPENSE:
<Suspense fallback={<LoadingSpinner />}>
  <CoachChat
    messages={chatMessages}
    onSendMessage={handleSendMessage}
    isTyping={isChatTyping}
    relatedStrengths={strengthProfile?.strengths.filter(s => s.isTopFive) || []}
    isExpanded={true}
    onToggleExpanded={() => setIsChatExpanded(false)}
    initialStrengthFocus={currentStrengthFocus}
    className="h-full"
  />
</Suspense>
```

---

## Priority 4: Code Quality Improvements (ONGOING)

### 4.1 Remove Production Debug Code 🟡
**Locations with console.log statements:**

```typescript
// REMOVE FROM PRODUCTION (api/upload/route.ts):
// Line 20: console.log('Received file:', file.name, file.size);
// Line 49: console.log('Parsed profile:', profile);
// Line 53: console.log('Error details:', error);

// REPLACE WITH PROPER LOGGING:
import { logger } from '@/lib/logger';

// In production builds, replace console.log with:
if (process.env.NODE_ENV === 'development') {
  logger.debug('Received file:', { name: file.name, size: file.size });
}
```

### 4.2 Standardize Error Handling 🟡
**Create**: `frontend/src/lib/error-handling.ts`

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && { details: error.details })
      },
      { status: error.statusCode }
    );
  }
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors
      },
      { status: 400 }
    );
  }
  
  // Log unexpected errors
  console.error('Unexpected API error:', error);
  
  return NextResponse.json(
    {
      error: process.env.NODE_ENV === 'development' 
        ? (error as Error).message 
        : 'Internal server error',
      code: 'INTERNAL_ERROR'
    },
    { status: 500 }
  );
}
```

---

## Testing and Quality Assurance Setup

### 5.1 Accessibility Testing Framework
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-axe @axe-core/react

# Create jest.config.js
npm install --save-dev jest jest-environment-jsdom
```

**Create**: `frontend/__tests__/accessibility.test.tsx`
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import CoachChat from '../src/components/CoachChat';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('CoachChat has no accessibility violations', async () => {
    const { container } = render(
      <CoachChat
        messages={[]}
        onSendMessage={() => Promise.resolve()}
        isTyping={false}
        relatedStrengths={[]}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 5.2 Security Testing
```typescript
// Create __tests__/security.test.tsx
describe('Security Tests', () => {
  test('prevents XSS in chat messages', async () => {
    const maliciousInput = '<script>alert("XSS")</script><img src="x" onerror="alert(1)">';
    // Test sanitization functionality
    const sanitized = DOMPurify.sanitize(maliciousInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('onerror');
  });
});
```

---

## 📊 Comprehensive Progress Tracking Table

### Master Progress Overview
| Category | Total Items | Completed | In Progress | Not Started | Completion % |
|----------|------------|-----------|-------------|-------------|--------------|
| **Security** | 15 | 1 | 0 | 14 | 6.7% |
| **Accessibility** | 18 | 1 | 0 | 17 | 5.6% |
| **Performance** | 12 | 0 | 0 | 12 | 0% |
| **Code Quality** | 10 | 0 | 0 | 10 | 0% |
| **Testing** | 8 | 0 | 0 | 8 | 0% |
| **TOTAL** | **63** | **2** | **0** | **61** | **3.2%** |

### Priority 1: Critical Security Items (🔴 IMMEDIATE ACTION REQUIRED)
| ID | Task | Location | Status | Assigned To | Notes | Risk Level |
|----|------|----------|--------|-------------|-------|------------|
| S1.1 | Fix XSS vulnerability with DOMPurify | `CoachChat.tsx:190-194` | ⬜ Not Started | | Install isomorphic-dompurify | CRITICAL |
| S1.2 | Remove ESLint bypass in build | `next.config.ts:4-6` | ⬜ Not Started | | Remove ignoreDuringBuilds: true | CRITICAL |
| S1.3 | Remove TypeScript bypass in build | `next.config.ts:7-9` | ⬜ Not Started | | Remove ignoreBuildErrors: true | CRITICAL |
| S1.4 | Add Zod validation to coach API | `api/coach/route.ts` | ⬜ Not Started | | Install zod package | HIGH |
| S1.5 | Add Zod validation to upload API | `api/upload/route.ts` | ⬜ Not Started | | Add file size limits | HIGH |
| S1.6 | Create middleware.ts for CSP | `frontend/middleware.ts` | ⬜ Not Started | | New file creation | CRITICAL |
| S1.7 | Implement rate limiting | `lib/rate-limit.ts` | ⬜ Not Started | | Prevent API abuse | HIGH |
| S1.8 | Add security headers | `middleware.ts` | ⬜ Not Started | | X-Frame-Options, etc | HIGH |
| S1.9 | Sanitize PDF parsing | `api/upload/route.ts` | ⬜ Not Started | | Validate PDF content | MEDIUM |
| S1.10 | Secure environment variables | Multiple files | ⬜ Not Started | | Audit all env usage | MEDIUM |
| S1.11 | Add CORS configuration | `next.config.ts` | ⬜ Not Started | | Configure allowed origins | MEDIUM |
| S1.12 | Implement session encryption | `lib/session-storage.ts` | ⬜ Not Started | | Encrypt localStorage | MEDIUM |
| S1.13 | Add CSRF protection | API routes | ⬜ Not Started | | Token validation | MEDIUM |
| S1.14 | Audit dependencies | `package.json` | ⬜ Not Started | | npm audit fix | HIGH |
| S1.15 | Configure CSP nonce | React components | ⬜ Not Started | | Dynamic nonce for scripts | MEDIUM |

### Priority 2: WCAG 2.2 AA Accessibility (🟠 HIGH PRIORITY)
| ID | Task | Location | Status | Assigned To | Notes | WCAG SC |
|----|------|----------|--------|-------------|-------|---------|
| A2.1 | Add semantic HTML structure | `layout.tsx:27-35` | ⬜ Not Started | | Add main, header, footer | 1.3.1 |
| A2.2 | Implement skip navigation link | `layout.tsx` | ⬜ Not Started | | Keyboard navigation | 2.4.1 |
| A2.3 | Add domain visual indicators | `Dashboard.tsx` | ✅ Completed | | Domain colors fixed | 1.4.1 |
| A2.4 | Add domain icons | `Dashboard.tsx:128-150` | ⬜ Not Started | | Import from lucide-react | 1.4.1 |
| A2.5 | Add ARIA labels to chat | `CoachChat.tsx` | ⬜ Not Started | | role="log" aria-live | 4.1.3 |
| A2.6 | Fix chat input accessibility | `CoachChat.tsx:235-244` | ⬜ Not Started | | aria-label, describedby | 3.3.2 |
| A2.7 | Add ARIA to filter buttons | `Dashboard.tsx:220-228` | ⬜ Not Started | | aria-pressed states | 4.1.2 |
| A2.8 | Implement focus management hook | `hooks/useFocusManagement.ts` | ⬜ Not Started | | New file creation | 2.4.3 |
| A2.9 | Add focus trap to modals | `SessionManager.tsx` | ⬜ Not Started | | Dialog focus trap | 2.4.3 |
| A2.10 | Fix FAB button labels | `coach/page.tsx:610-636` | ⬜ Not Started | | aria-label improvements | 4.1.2 |
| A2.11 | Add reduced motion CSS | `globals.css` | ⬜ Not Started | | prefers-reduced-motion | 2.3.3 |
| A2.12 | Add form validation ARIA | Form components | ⬜ Not Started | | aria-invalid, aria-describedby | 3.3.1 |
| A2.13 | Implement live regions | Chat, notifications | ⬜ Not Started | | aria-live for updates | 4.1.3 |
| A2.14 | Add landmark roles | All pages | ⬜ Not Started | | nav, aside, section | 1.3.1 |
| A2.15 | Fix color contrast | UI components | ⬜ Not Started | | WCAG AAA if possible | 1.4.3 |
| A2.16 | Add alt text patterns | Image components | ⬜ Not Started | | If images added | 1.1.1 |
| A2.17 | Keyboard navigation audit | Entire app | ⬜ Not Started | | Tab order verification | 2.4.3 |
| A2.18 | Screen reader testing | Entire app | ⬜ Not Started | | NVDA/JAWS testing | Multiple |

### Priority 3: Performance Optimization (🟡 MEDIUM PRIORITY)
| ID | Task | Location | Status | Assigned To | Notes | Impact |
|----|------|----------|--------|-------------|-------|--------|
| P3.1 | Enable package optimization | `next.config.ts` | ⬜ Not Started | | optimizePackageImports | HIGH |
| P3.2 | Add webpack optimizations | `next.config.ts` | ⬜ Not Started | | webpackMemoryOptimizations | MEDIUM |
| P3.3 | Configure image optimization | `next.config.ts` | ⬜ Not Started | | formats, sizes | MEDIUM |
| P3.4 | Add font display swap | `layout.tsx:6-12` | ⬜ Not Started | | display: 'swap' | LOW |
| P3.5 | Memoize Dashboard calculations | `Dashboard.tsx` | ⬜ Not Started | | useMemo for stats | HIGH |
| P3.6 | Memoize chat formatting | `CoachChat.tsx` | ⬜ Not Started | | React.memo wrapper | MEDIUM |
| P3.7 | Implement code splitting | `coach/page.tsx` | ⬜ Not Started | | lazy() imports | HIGH |
| P3.8 | Add Suspense boundaries | Multiple components | ⬜ Not Started | | Loading states | MEDIUM |
| P3.9 | Optimize bundle analyzer | `package.json` | ⬜ Not Started | | Add analyze script | LOW |
| P3.10 | Implement API caching | API routes | ⬜ Not Started | | Response caching | MEDIUM |
| P3.11 | Add service worker | `public/` | ⬜ Not Started | | Offline support | LOW |
| P3.12 | Optimize Tailwind CSS | `tailwind.config.js` | ⬜ Not Started | | Purge unused styles | MEDIUM |

### Priority 4: Code Quality & Maintainability (🟢 ONGOING)
| ID | Task | Location | Status | Assigned To | Notes | Type |
|----|------|----------|--------|-------------|-------|------|
| Q4.1 | Remove console.log statements | `api/upload/route.ts:20,49,53` | ⬜ Not Started | | Use proper logger | Cleanup |
| Q4.2 | Create error handling utility | `lib/error-handling.ts` | ⬜ Not Started | | Standardize errors | Architecture |
| Q4.3 | Add JSDoc comments | Complex functions | ⬜ Not Started | | Documentation | Docs |
| Q4.4 | Standardize file extensions | `/types` directory | ⬜ Not Started | | .ts consistency | Cleanup |
| Q4.5 | Create logger utility | `lib/logger.ts` | ⬜ Not Started | | Replace console.log | Architecture |
| Q4.6 | Add TypeScript strict checks | `tsconfig.json` | ⬜ Not Started | | Enable all strict | Config |
| Q4.7 | Configure ESLint properly | `.eslintrc.json` | ⬜ Not Started | | Remove bypasses | Config |
| Q4.8 | Add pre-commit hooks | `package.json` | ⬜ Not Started | | Husky setup | DevOps |
| Q4.9 | Create API documentation | `/docs/api` | ⬜ Not Started | | OpenAPI spec | Docs |
| Q4.10 | Add code comments | Complex logic | ⬜ Not Started | | Inline documentation | Docs |

### Priority 5: Testing & Quality Assurance (🔵 FOUNDATION)
| ID | Task | Location | Status | Assigned To | Notes | Coverage |
|----|------|----------|--------|-------------|-------|----------|
| T5.1 | Setup Jest configuration | `jest.config.js` | ⬜ Not Started | | Install dependencies | Config |
| T5.2 | Create accessibility tests | `__tests__/a11y/` | ⬜ Not Started | | jest-axe setup | A11y |
| T5.3 | Create security tests | `__tests__/security/` | ⬜ Not Started | | XSS prevention tests | Security |
| T5.4 | Add unit tests | Components | ⬜ Not Started | | Component testing | Unit |
| T5.5 | Add integration tests | API routes | ⬜ Not Started | | API testing | Integration |
| T5.6 | Setup E2E testing | Cypress/Playwright | ⬜ Not Started | | User flow testing | E2E |
| T5.7 | Add performance tests | Lighthouse CI | ⬜ Not Started | | Core Web Vitals | Performance |
| T5.8 | Create CI/CD pipeline | GitHub Actions | ⬜ Not Started | | Automated testing | DevOps |

## 📈 Implementation Roadmap

### Week 1: Security Sprint 🔴
- **Focus**: All S1.x tasks (Critical Security)
- **Goal**: Eliminate all CRITICAL and HIGH security vulnerabilities
- **Validation**: Security audit, penetration testing

### Week 2: Accessibility Sprint 🟠
- **Focus**: A2.1-A2.10 (Core WCAG compliance)
- **Goal**: Achieve basic WCAG 2.2 AA compliance
- **Validation**: WAVE tool, axe DevTools, manual testing

### Week 3: Performance Sprint 🟡
- **Focus**: P3.1-P3.8 (Core optimizations)
- **Goal**: Improve Lighthouse scores >90
- **Validation**: Bundle analysis, Core Web Vitals

### Week 4: Quality & Testing Sprint 🟢🔵
- **Focus**: Q4.x and T5.x tasks
- **Goal**: Establish testing foundation and code quality
- **Validation**: Test coverage >80%, ESLint passing

## 📋 Task Assignment Template
```markdown
### Task: [Task ID] - [Task Name]
**Assigned To**: [Developer Name]
**Start Date**: [Date]
**Target Completion**: [Date]
**Actual Completion**: [Date]
**Blockers**: [Any blockers]
**Notes**: [Implementation notes]
**PR Link**: [GitHub PR]
```

---

## Success Metrics

### Security Metrics
- [ ] Zero critical vulnerabilities in security scan
- [ ] CSP policy successfully implemented
- [ ] All API endpoints validate input
- [ ] No XSS vulnerabilities detected

### Accessibility Metrics  
- [ ] WAVE browser extension shows 0 errors
- [ ] axe-core automated tests pass
- [ ] Manual keyboard navigation works completely
- [ ] Screen reader testing validates key workflows

### Performance Metrics
- [ ] Lighthouse Performance score >90
- [ ] Bundle size reduced by >30%
- [ ] First Contentful Paint <2s
- [ ] Largest Contentful Paint <2.5s

### Code Quality Metrics
- [ ] TypeScript strict mode enabled with 0 errors
- [ ] ESLint passes with 0 warnings
- [ ] Test coverage >80%
- [ ] No production console.log statements

---

## Required Package Installations

```bash
# Security packages
npm install isomorphic-dompurify zod
npm install --save-dev @types/dompurify

# Testing packages
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-axe @axe-core/react jest jest-environment-jsdom

# Performance monitoring
npm install @vercel/analytics @vercel/speed-insights

# Development tools
npm install --save-dev eslint-plugin-jsx-a11y @next/bundle-analyzer
```

---

## 🎯 Quick Win Tasks (Can Be Done Immediately)

### Tasks That Can Be Completed in Under 30 Minutes:
1. **Remove build safety bypasses** (S1.2, S1.3) - Simply delete 4 lines from `next.config.ts`
2. **Add domain colors to DOMAIN_COLORS** (A2.3) - ✅ Already completed
3. **Remove console.log statements** (Q4.1) - Delete or comment out 3 lines
4. **Add font display swap** (P3.4) - Add one property to font config

### Tasks That Can Be Completed in Under 2 Hours:
1. **Install security packages** - Run npm install commands
2. **Create basic middleware.ts** (S1.6) - Copy provided template
3. **Add skip navigation link** (A2.2) - Add one line to layout.tsx
4. **Setup Jest configuration** (T5.1) - Copy config template

---

## 🔧 Developer Setup Guide

### Required VS Code Extensions:
- **ESLint** - Error detection
- **axe Accessibility Linter** - WCAG compliance checking
- **Tailwind CSS IntelliSense** - Class suggestions
- **GitLens** - Track changes
- **SonarLint** - Security vulnerability detection

### Local Development Checklist:
```bash
# 1. Install all required packages
npm install isomorphic-dompurify zod
npm install --save-dev @types/dompurify @testing-library/react @testing-library/jest-dom jest-axe

# 2. Run security audit
npm audit

# 3. Run ESLint (after fixing bypasses)
npm run lint

# 4. Run TypeScript check (after fixing bypasses)  
npm run type-check

# 5. Test accessibility locally
# Install WAVE browser extension
# Install axe DevTools extension
```

---

## 📚 Additional Resources & Documentation

### Security Resources:
- [OWASP Top 10 for Web Apps](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers Guide](https://nextjs.org/docs/advanced-features/security-headers)
- [Content Security Policy Generator](https://report-uri.com/home/generate)

### Accessibility Resources:
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Performance Resources:
- [Next.js Performance Optimization](https://nextjs.org/docs/pages/building-your-application/optimizing/performance)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [Bundle Analyzer Setup](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## 🚨 Critical Path Dependencies

### Blocking Dependencies (Must Be Done First):
1. **S1.2 & S1.3** - Remove build bypasses before any other code changes
2. **S1.1** - Fix XSS before deploying to production
3. **T5.1** - Setup Jest before writing any tests

### Parallel Work Streams (Can Be Done Simultaneously):
- **Security Team**: S1.1, S1.4, S1.5, S1.6
- **Accessibility Team**: A2.1, A2.2, A2.4, A2.5
- **Performance Team**: P3.1, P3.2, P3.3
- **QA Team**: T5.1, T5.2, T5.3

---

## 📝 Code Review Checklist

### Before Merging Any PR:
- [ ] No new ESLint warnings
- [ ] No new TypeScript errors
- [ ] No console.log statements
- [ ] Security headers tested
- [ ] WCAG compliance checked with WAVE
- [ ] Bundle size impact analyzed
- [ ] Tests written and passing
- [ ] Documentation updated

---

## 💡 Pro Tips & Best Practices

### Security:
- Always validate on both client AND server
- Never trust user input, even from authenticated users
- Use environment variables for all sensitive data
- Implement rate limiting on all API endpoints

### Accessibility:
- Test with keyboard only (no mouse)
- Use screen reader for critical flows
- Ensure 4.5:1 contrast ratio minimum
- Provide multiple ways to access content

### Performance:
- Lazy load below-the-fold content
- Use Next.js Image component for all images
- Implement virtual scrolling for long lists
- Cache API responses appropriately

### Code Quality:
- Write tests BEFORE fixing bugs
- Document WHY, not WHAT in comments
- Use TypeScript strict mode
- Follow consistent naming conventions

---

## 🔄 Continuous Improvement Process

### Weekly Reviews:
1. Update progress tracking table
2. Identify blockers and dependencies
3. Adjust priorities based on findings
4. Document lessons learned

### Monthly Audits:
1. Run full security scan
2. Perform accessibility audit
3. Analyze performance metrics
4. Review code quality metrics

---

## 🎉 Completion Criteria

### Definition of Done for Each Task:
1. Code implemented and reviewed
2. Tests written and passing
3. Documentation updated
4. Accessibility checked
5. Security validated
6. Performance impact assessed
7. PR approved and merged

### Project Success Criteria:
- **Security**: 0 critical/high vulnerabilities
- **Accessibility**: WCAG 2.2 AA compliant
- **Performance**: Lighthouse score >90
- **Quality**: 80% test coverage
- **Maintenance**: Full documentation

---

This comprehensive action plan serves as your complete roadmap for transforming PeakPath into a secure, accessible, performant, and maintainable application. The detailed progress tracking ensures accountability and visibility throughout the implementation process.