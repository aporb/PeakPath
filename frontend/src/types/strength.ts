// CliftonStrengths domain categories with their associated colors
export enum StrengthDomain {
  EXECUTING = 'executing',
  INFLUENCING = 'influencing',
  RELATIONSHIP_BUILDING = 'relationship-building',
  STRATEGIC_THINKING = 'strategic-thinking'
}

// Individual strength data structure
export interface Strength {
  id: string;
  name: string;
  domain: StrengthDomain;
  rank: number; // 1-34 ranking
  description: string;
  isTopFive: boolean;
}

// User's complete strength profile
export interface StrengthProfile {
  id: string;
  userId: string;
  strengths: Strength[];
  assessmentDate: Date;
  reportUrl?: string;
  fullPDFContent?: string; // Full PDF text for comprehensive AI analysis
}

// Chat message structure
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'coach';
  timestamp: Date;
  strengthContext?: string; // Related strength name
}

// File upload state
export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  file: File | null;
}

// Domain color mapping for Tailwind classes
export const DOMAIN_COLORS = {
  [StrengthDomain.EXECUTING]: {
    primary: 'text-purple-600',
    secondary: 'text-purple-500',
    background: 'bg-purple-50',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-100',
    gradient: 'from-purple-500 to-purple-600'
  },
  [StrengthDomain.INFLUENCING]: {
    primary: 'text-orange-600',
    secondary: 'text-orange-500', 
    background: 'bg-orange-50',
    border: 'border-orange-200',
    hover: 'hover:bg-orange-100',
    gradient: 'from-orange-500 to-orange-600'
  },
  [StrengthDomain.RELATIONSHIP_BUILDING]: {
    primary: 'text-blue-600',
    secondary: 'text-blue-500',
    background: 'bg-blue-50',
    border: 'border-blue-200', 
    hover: 'hover:bg-blue-100',
    gradient: 'from-blue-500 to-blue-600'
  },
  [StrengthDomain.STRATEGIC_THINKING]: {
    primary: 'text-green-600',
    secondary: 'text-green-500',
    background: 'bg-green-50',
    border: 'border-green-200',
    hover: 'hover:bg-green-100',
    gradient: 'from-green-500 to-green-600'
  }
} as const;

// Domain display names
export const DOMAIN_NAMES = {
  [StrengthDomain.EXECUTING]: 'Executing',
  [StrengthDomain.INFLUENCING]: 'Influencing', 
  [StrengthDomain.RELATIONSHIP_BUILDING]: 'Relationship Building',
  [StrengthDomain.STRATEGIC_THINKING]: 'Strategic Thinking'
} as const;