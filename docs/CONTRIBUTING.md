# Contributing to PeakPath

Welcome to the PeakPath AI Coaching Platform! We're excited to have you contribute to this Next.js 15 + TypeScript application that's transforming how people leverage their CliftonStrengths for personal development.

## Table of Contents

- [Project Overview](#project-overview)
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)
- [Issue Guidelines](#issue-guidelines)
- [Review Process](#review-process)
- [Recognition](#recognition)

## Project Overview

**PeakPath** is an AI-powered coaching platform that helps individuals maximize their potential through personalized CliftonStrengths insights. Built with modern web technologies, it provides an interactive dashboard for strength analysis and AI-driven coaching conversations.

### Key Technologies
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **UI Components**: shadcn/ui (48+ components), Radix UI primitives
- **Styling**: Tailwind CSS v4, CSS-in-JS with class-variance-authority
- **AI Integration**: Anthropic Claude API for coaching conversations
- **Data Processing**: PDF parsing for CliftonStrengths reports
- **State Management**: React hooks, localStorage-based session persistence
- **Development**: ESLint, TypeScript strict mode, Hot reload

### Architecture
- **Landing Page** (`/`) - Professional marketing with interactive demo
- **Coaching Dashboard** (`/coach`) - Full-featured coaching interface
- **API Routes** - Next.js API for AI coaching and PDF processing
- **Session Management** - Client-side persistence with cleanup
- **Component Library** - Complete shadcn/ui integration

### Live URLs
- **Production**: https://peak-path.vercel.app
- **Repository**: https://github.com/aporb/PeakPath

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. By participating in this project, you agree to:

### Our Standards
- **Be Respectful**: Treat all community members with dignity and respect
- **Be Constructive**: Provide helpful feedback and suggestions
- **Be Professional**: Maintain a professional tone in all interactions
- **Be Inclusive**: Welcome contributors of all backgrounds and experience levels
- **Be Patient**: Remember that everyone is learning and growing

### Unacceptable Behavior
- Harassment, discrimination, or offensive language
- Personal attacks or trolling
- Sharing others' private information without permission
- Any behavior that would be inappropriate in a professional setting

### Enforcement
Issues should be reported to the maintainers. All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites
Before contributing, ensure you have:
- **Node.js 18+** and **npm 9+**
- **Git** for version control
- **Claude API key** from [Anthropic Console](https://console.anthropic.com/) (for testing AI features)
- **Code editor** with TypeScript support (VS Code recommended)

### Initial Setup

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/PeakPath.git
   cd PeakPath/frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Add your Claude API key to .env.local
   echo "CLAUDE_API_KEY=your_key_here" >> .env.local
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # Application will run on http://localhost:8000
   ```

5. **Verify Setup**
   - Visit http://localhost:8000 - should show landing page
   - Click "Try Demo" - should navigate to coaching dashboard
   - Upload a PDF or use demo mode - should process successfully

### Project Structure Familiarization

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout, metadata, providers
│   ├── page.tsx           # Landing page (/)
│   ├── globals.css        # Global styles + CSS variables
│   ├── coach/page.tsx     # Coaching dashboard (/coach)
│   └── api/               # API routes
│       ├── health/        # Health check endpoint
│       ├── upload/        # PDF processing
│       └── coach/         # AI coaching (standard + streaming)
├── components/            # React components
│   ├── landing/          # Landing page sections
│   ├── ui/               # shadcn/ui components (48+)
│   └── [feature].tsx     # Core feature components
├── lib/                  # Utilities and services
│   ├── services/         # Business logic (AI, PDF parsing)
│   └── [utility].ts      # Helper functions
├── hooks/                # Custom React hooks
└── types/                # TypeScript definitions
```

## Development Workflow

### Git Workflow

We use a **feature branch workflow** with the following conventions:

#### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes  
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring
- `chore/maintenance-task` - Maintenance tasks

#### Branch Management
```bash
# Create feature branch from master
git checkout master
git pull origin master
git checkout -b feature/your-feature-name

# Make your changes, commit regularly
git add .
git commit -m "feat: add user authentication component"

# Push to your fork
git push origin feature/your-feature-name
```

#### Pull Request Process

1. **Before Creating PR**
   ```bash
   # Ensure your branch is up to date
   git checkout master
   git pull origin master
   git checkout feature/your-feature-name
   git rebase master
   
   # Run quality checks
   npm run lint
   npm run build
   ```

2. **Create Pull Request**
   - Use the GitHub web interface
   - Write a clear title and description
   - Link any related issues
   - Request review from maintainers

3. **PR Title Format**
   ```
   type(scope): description
   
   Examples:
   feat(components): add strength card hover animations
   fix(api): resolve PDF parsing memory leak
   docs(readme): update installation instructions
   refactor(hooks): simplify session persistence logic
   ```

4. **PR Description Template**
   ```markdown
   ## Changes Made
   - Brief description of changes
   - Any new components or features added
   
   ## Testing
   - [ ] Tested on desktop
   - [ ] Tested on mobile
   - [ ] All existing tests pass
   - [ ] Manual testing completed
   
   ## Screenshots (if applicable)
   [Include before/after screenshots for UI changes]
   
   ## Breaking Changes
   [Describe any breaking changes, or "None"]
   
   ## Additional Notes
   [Any additional context for reviewers]
   ```

### Commit Message Standards

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: type(scope): description

# Types:
feat:     # New feature
fix:      # Bug fix  
docs:     # Documentation changes
style:    # Formatting (no code changes)
refactor: # Code refactoring
test:     # Adding/modifying tests
chore:    # Maintenance tasks

# Examples:
git commit -m "feat(landing): add interactive demo component"
git commit -m "fix(api): handle PDF parsing edge cases"
git commit -m "docs(contributing): update setup instructions"
git commit -m "refactor(components): extract reusable session logic"
```

## Code Standards

### TypeScript Configuration

We use **strict TypeScript** with the following requirements:

```typescript
// tsconfig.json settings enforced:
{
  "strict": true,
  "noEmit": true,
  "skipLibCheck": true
}
```

#### Type Safety Requirements
```typescript
// ✅ Good - Explicit types
interface StrengthCardProps {
  strength: Strength;
  isTopFive: boolean;
  onClick?: (strength: Strength) => void;
  className?: string;
}

// ✅ Good - Proper error handling
const uploadFile = async (file: File): Promise<StrengthProfile | null> => {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: createFormData(file),
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};

// ❌ Bad - Any types
const handleClick = (data: any) => { ... }

// ❌ Bad - Missing error handling
const uploadFile = async (file: File) => {
  return fetch('/api/upload').then(r => r.json());
};
```

### ESLint Configuration

We use **Next.js ESLint config** with TypeScript support:

```bash
# Run linting
npm run lint

# Auto-fix issues where possible
npm run lint -- --fix
```

#### Code Style Requirements

1. **Import Organization**
   ```typescript
   // ✅ Good - Organized imports
   import React from 'react';
   import { NextRequest } from 'next/server';
   
   import { Button } from '@/components/ui/button';
   import { StrengthCard } from '@/components/StrengthCard';
   import { SessionManager } from '@/lib/session-storage';
   import { cn } from '@/lib/utils';
   
   import type { StrengthProfile, ChatMessage } from '@/types/strength';
   ```

2. **Component Structure**
   ```typescript
   // ✅ Good - Consistent component pattern
   interface ComponentProps {
     // Props interface first
     title: string;
     optional?: boolean;
     children: React.ReactNode;
     className?: string;
   }
   
   export function MyComponent({ 
     title, 
     optional = false, 
     children, 
     className,
     ...props 
   }: ComponentProps) {
     // Hooks at the top
     const [state, setState] = React.useState(false);
     
     // Event handlers
     const handleClick = React.useCallback(() => {
       setState(!state);
     }, [state]);
     
     // Render
     return (
       <div className={cn("base-styles", className)} {...props}>
         <h2>{title}</h2>
         {optional && <span>Optional content</span>}
         {children}
       </div>
     );
   }
   ```

3. **Naming Conventions**
   ```typescript
   // ✅ Components - PascalCase
   export function StrengthCard() {}
   export function SessionManagerUI() {}
   
   // ✅ Functions/variables - camelCase  
   const handleUpload = () => {};
   const isLoading = true;
   
   // ✅ Constants - UPPER_SNAKE_CASE
   const MAX_FILE_SIZE = 10 * 1024 * 1024;
   const DEMO_STRENGTH_PROFILE = { ... };
   
   // ✅ Types/Interfaces - PascalCase
   interface StrengthProfile {}
   type ChatMessage = {};
   enum StrengthDomain {}
   ```

### CSS and Styling Standards

#### Tailwind CSS Guidelines

1. **Class Organization**
   ```typescript
   // ✅ Good - Logical grouping
   <div className="
     // Layout
     flex items-center justify-between
     w-full max-w-md mx-auto
     // Spacing  
     p-4 gap-3
     // Appearance
     bg-white rounded-lg border shadow-sm
     // States
     hover:shadow-md transition-shadow
     // Responsive
     md:max-w-lg lg:max-w-xl
   ">
   ```

2. **Using CN Utility**
   ```typescript
   import { cn } from '@/lib/utils';
   
   // ✅ Good - Conditional classes
   <Button 
     className={cn(
       "base-button-styles",
       variant === 'primary' && "bg-blue-600 text-white",
       size === 'large' && "px-8 py-4 text-lg",
       disabled && "opacity-50 cursor-not-allowed",
       className // Allow prop override
     )}
   />
   ```

3. **Component Variants with CVA**
   ```typescript
   import { cva } from "class-variance-authority";
   
   const cardVariants = cva(
     "rounded-lg border bg-card text-card-foreground shadow-sm",
     {
       variants: {
         size: {
           default: "p-4",
           sm: "p-2",
           lg: "p-6",
         },
         variant: {
           default: "border-border",
           destructive: "border-destructive/50 text-destructive",
         },
       },
       defaultVariants: {
         size: "default",
         variant: "default",
       },
     }
   );
   ```

### API Route Standards

```typescript
// ✅ Good - Complete API route
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema
const RequestSchema = z.object({
  message: z.string().min(1).max(1000),
  profileId: z.string().optional(),
  strengthContext: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate input
    const body = await request.json();
    const { message, profileId, strengthContext } = RequestSchema.parse(body);
    
    // Business logic
    const response = await processCoachingMessage({
      message,
      profileId,
      strengthContext,
    });
    
    // Return response
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Testing Guidelines

### Manual Testing Checklist

Since we don't currently have automated tests, thorough manual testing is crucial:

#### Core Features Testing
```bash
# 1. Landing Page
- [ ] Page loads without errors
- [ ] All sections render correctly
- [ ] CTA buttons work
- [ ] Demo mode triggers properly
- [ ] Mobile responsive design

# 2. File Upload
- [ ] PDF file selection works
- [ ] Upload progress displays
- [ ] Error handling for invalid files
- [ ] Success state transitions to dashboard

# 3. Demo Mode
- [ ] Demo trigger from landing page
- [ ] Demo profile loads correctly
- [ ] All demo features function
- [ ] Can switch between demo and real data

# 4. Coaching Dashboard
- [ ] Profile data displays correctly
- [ ] Strength cards are interactive
- [ ] Chat interface opens/closes
- [ ] AI responses generate properly
- [ ] Session persistence works

# 5. Session Management
- [ ] Sessions save to localStorage
- [ ] Session list populates
- [ ] Can load previous sessions
- [ ] Can delete sessions
- [ ] Expired session cleanup
```

#### Cross-Browser Testing
Test in at least:
- **Chrome** (latest)
- **Firefox** (latest) 
- **Safari** (latest)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

#### Testing Process

1. **Before Making Changes**
   ```bash
   # Record current behavior
   npm run dev
   # Test affected features manually
   # Document any existing issues
   ```

2. **During Development**
   ```bash
   # Test changes incrementally
   # Verify no regressions in related features
   # Test edge cases and error conditions
   ```

3. **Before Submitting PR**
   ```bash
   # Full regression test
   # Test on different screen sizes
   # Verify build succeeds
   npm run build
   ```

### Error Scenarios to Test

```typescript
// Test these scenarios:
- Large PDF files (>10MB)
- Invalid PDF formats
- Network failures during upload
- API rate limits/timeouts
- localStorage quota exceeded
- Empty or corrupted session data
- Mobile device limitations
- Slow internet connections
```

## Documentation Standards

### Code Documentation

#### Component Documentation
```typescript
/**
 * StrengthCard - Interactive card displaying CliftonStrengths data
 * 
 * Features:
 * - Shows strength name, rank, and domain
 * - Click to open coaching chat with strength context
 * - Visual indicators for top 5 strengths
 * - Responsive design with hover states
 * 
 * @param strength - The strength data to display
 * @param isTopFive - Whether this is a top 5 strength
 * @param onClick - Callback when card is clicked
 * @param className - Additional CSS classes
 */
interface StrengthCardProps {
  strength: Strength;
  isTopFive: boolean;
  onClick?: (strength: Strength) => void;
  className?: string;
}

export function StrengthCard({ strength, isTopFive, onClick, className }: StrengthCardProps) {
  // Implementation...
}
```

#### API Documentation
```typescript
/**
 * POST /api/coach/stream
 * 
 * Streams AI coaching responses in real-time using Server-Sent Events.
 * 
 * Request Body:
 * - message: string - The user's coaching question
 * - strengthContext?: string - Optional strength context
 * - profileId?: string - User profile identifier
 * - conversationHistory?: ChatMessage[] - Recent chat history
 * 
 * Response: 
 * - Streaming text/plain response
 * - Each chunk contains partial AI response
 * 
 * Error Handling:
 * - 400: Invalid input parameters
 * - 429: Rate limit exceeded  
 * - 500: AI service error
 */
export async function POST(request: NextRequest) {
  // Implementation...
}
```

### README Updates

When adding new features, update the README with:

1. **New component documentation**
   ```typescript
   // Add to component examples section
   <NewComponent 
     prop1="value"
     prop2={dynamicValue}
     onAction={handleAction}
   />
   ```

2. **New API endpoints**
   ```bash
   # Add to API section
   POST /api/new-endpoint
   GET /api/data/{id}
   ```

3. **Configuration changes**
   ```bash
   # Update environment variables section
   NEW_ENV_VAR=required_value
   ```

### Changelog Maintenance

For significant changes, add entry to project changelog:

```markdown
## [Unreleased]
### Added
- Interactive demo mode for landing page
- Streaming AI responses for better UX
- Session management with persistence

### Changed  
- Upgraded to Next.js 15 with App Router
- Improved mobile responsive design

### Fixed
- PDF parsing memory leaks
- Session storage edge cases
```

## Issue Guidelines

### Reporting Bugs

Use the **Bug Report** template with these details:

```markdown
## Bug Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should have happened

## Actual Behavior  
What actually happened

## Environment
- OS: [e.g. macOS 14, Windows 11]
- Browser: [e.g. Chrome 120, Safari 17]
- Device: [e.g. iPhone 15, Desktop]
- Screen size: [e.g. 1920x1080, Mobile]

## Additional Context
- Screenshots/videos
- Console errors
- Network errors
- Related issues
```

### Feature Requests

Use the **Feature Request** template:

```markdown
## Feature Description
Clear description of the proposed feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternative Solutions
Other ways to solve this problem

## Additional Context
- User stories
- Design mockups
- Technical considerations
```

### Issue Labels

We use these labels for organization:

- **Type**: `bug`, `feature`, `enhancement`, `documentation`
- **Priority**: `high`, `medium`, `low`  
- **Status**: `needs-triage`, `in-progress`, `blocked`
- **Scope**: `frontend`, `api`, `landing-page`, `coaching`
- **Difficulty**: `good-first-issue`, `beginner-friendly`, `advanced`

## Review Process

### What to Expect

#### Initial Review (24-48 hours)
- Automated checks (build, lint, type check)
- Initial feedback on approach and code style
- Questions about implementation decisions

#### Detailed Review (2-5 days)
- Line-by-line code review
- Testing feedback
- Documentation review
- Accessibility check

#### Final Approval
- All feedback addressed
- Manual testing completed
- Documentation updated
- Ready for merge

### Review Criteria

#### Code Quality
- [ ] TypeScript strict mode compliance
- [ ] ESLint rules passing
- [ ] Consistent naming conventions
- [ ] Proper error handling
- [ ] No console.log statements (use proper logging)

#### Architecture
- [ ] Follows existing patterns
- [ ] Appropriate component structure
- [ ] Proper separation of concerns
- [ ] Reusable components when applicable

#### User Experience  
- [ ] Responsive design works
- [ ] Loading states implemented
- [ ] Error states handled gracefully
- [ ] Accessibility guidelines followed

#### Performance
- [ ] No unnecessary re-renders
- [ ] Efficient state management
- [ ] Proper code splitting
- [ ] Image optimization

#### Testing
- [ ] Manual testing completed
- [ ] Edge cases considered
- [ ] Cross-browser compatibility
- [ ] Mobile device testing

### Addressing Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address review feedback"

# Update your PR branch
git push origin feature/your-feature-name

# Reply to comments explaining changes
```

### Common Review Comments

**"Consider extracting this into a custom hook"**
```typescript
// Instead of duplicating logic in components
const MyComponent = () => {
  const [sessions, setSessions] = useState([]);
  
  useEffect(() => {
    const loadSessions = () => {
      const saved = SessionManager.getAllSessions();
      setSessions(saved);
    };
    loadSessions();
  }, []);
  
  // Extract to:
  const sessions = useSessionList();
}
```

**"This component is doing too much"**
```typescript
// Break down large components
const ComplexDashboard = () => {
  // Too much logic here
}

// Into smaller, focused components:
const Dashboard = () => (
  <div>
    <DashboardHeader />
    <StrengthGrid />
    <ChatInterface />
  </div>
);
```

**"Add error boundaries"**
```typescript
// Wrap components that might fail
<ErrorBoundary fallback={<ErrorFallback />}>
  <AICoachingChat />
</ErrorBoundary>
```

## Recognition

### Contributor Acknowledgments

We recognize contributors in several ways:

#### GitHub Recognition
- **All contributors** listed in README
- **Significant contributors** added to AUTHORS file
- **Issue reporters** credited in changelogs
- **Reviewers** acknowledged in release notes

#### Contribution Types We Value
- 🚀 **Code contributions** - Features, bug fixes, improvements
- 📝 **Documentation** - README updates, code comments, guides  
- 🐛 **Bug reports** - High-quality issue reports with reproduction steps
- 💡 **Feature ideas** - Thoughtful feature requests and discussions
- 🔍 **Code review** - Helpful feedback on pull requests
- 🎨 **Design feedback** - UI/UX suggestions and improvements
- 📱 **Testing** - Manual testing, edge case discovery
- 🌍 **Community building** - Helping other contributors, answering questions

#### Becoming a Regular Contributor

After several quality contributions, you may be invited to:
- **Triage issues** - Help label and organize issues
- **Review PRs** - Provide feedback on code contributions  
- **Shape direction** - Participate in architectural decisions
- **Mentor newcomers** - Help onboard new contributors

### Hall of Fame

Outstanding contributors will be featured in:
- Project README
- Release announcements  
- Social media shoutouts
- Conference presentations about the project

---

## Quick Links

- **GitHub Repository**: https://github.com/aporb/PeakPath
- **Live Demo**: https://peak-path.vercel.app
- **Issue Tracker**: https://github.com/aporb/PeakPath/issues
- **Discussions**: https://github.com/aporb/PeakPath/discussions

## Questions?

- **General questions**: Open a [Discussion](https://github.com/aporb/PeakPath/discussions)
- **Bug reports**: Create an [Issue](https://github.com/aporb/PeakPath/issues/new)
- **Direct contact**: Reach out to maintainers via GitHub

---

Thank you for contributing to PeakPath! Together, we're building a platform that helps people discover and develop their unique strengths. Every contribution, no matter how small, makes a meaningful impact.

Happy coding! 🚀