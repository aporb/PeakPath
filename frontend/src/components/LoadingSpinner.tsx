'use client';

import { StrengthDomain, DOMAIN_COLORS } from '../types/strength';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'domain';
  domain?: StrengthDomain;
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  domain = StrengthDomain.EXECUTING,
  message,
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinnerSize = sizeClasses[size];
  const colors = variant === 'domain' ? DOMAIN_COLORS[domain] : null;

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Main Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`${spinnerSize} rounded-full border-4 ${
          variant === 'primary' 
            ? 'border-gray-200' 
            : 'border-gray-200'
        }`}>
        </div>
        
        {/* Spinning ring */}
        <div className={`absolute inset-0 ${spinnerSize} rounded-full border-4 border-transparent ${
          variant === 'primary'
            ? 'border-t-blue-600 border-r-blue-600'
            : colors
              ? `border-t-${colors.primary.replace('text-', '')} border-r-${colors.primary.replace('text-', '')}`
              : 'border-t-purple-600 border-r-purple-600'
        } animate-spin`}>
        </div>
        
        {/* Inner pulsing dot */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`w-1 h-1 rounded-full animate-pulse ${
            variant === 'primary'
              ? 'bg-blue-600'
              : colors
                ? colors.primary.replace('text-', 'bg-')
                : 'bg-purple-600'
          }`}>
          </div>
        </div>
      </div>

      {/* Loading message */}
      {message && (
        <p className="text-sm text-gray-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

// Full-screen overlay spinner
interface LoadingOverlayProps {
  message?: string;
  variant?: 'primary' | 'domain';
  domain?: StrengthDomain;
  progress?: number;
}

export function LoadingOverlay({ message = 'Loading...', variant = 'primary', domain, progress }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full mx-4">
        <LoadingSpinner 
          size="xl" 
          variant={variant}
          domain={domain}
          message={message}
          className="mb-4"
        />
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Inline loading component with skeleton effect
interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

// Card loading skeleton
export function LoadingCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 p-6 ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
        </div>
        
        {/* Domain badge */}
        <div className="w-20 h-5 bg-gray-200 rounded-full mb-3"></div>
        
        {/* Title */}
        <div className="w-3/4 h-6 bg-gray-200 rounded mb-3"></div>
        
        {/* Description lines */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Multi-domain spinner that cycles through domain colors
export function MultiDomainSpinner({ size = 'lg', message }: { size?: 'sm' | 'md' | 'lg' | 'xl', message?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const domains = [
    StrengthDomain.EXECUTING,
    StrengthDomain.INFLUENCING, 
    StrengthDomain.RELATIONSHIP_BUILDING,
    StrengthDomain.STRATEGIC_THINKING
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {domains.map((domain, index) => {
          const colors = DOMAIN_COLORS[domain];
          const rotation = index * 90; // Rotate each ring by 90 degrees
          const delay = index * 0.2; // Stagger the animations
          
          return (
            <div
              key={domain}
              className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent animate-spin`}
              style={{ 
                transform: `rotate(${rotation}deg)`,
                animationDelay: `${delay}s`,
                borderTopColor: colors.primary.includes('purple') ? '#9333ea' :
                               colors.primary.includes('orange') ? '#ea580c' :
                               colors.primary.includes('blue') ? '#2563eb' : '#16a34a',
                borderRightColor: colors.primary.includes('purple') ? '#9333ea' :
                                 colors.primary.includes('orange') ? '#ea580c' :
                                 colors.primary.includes('blue') ? '#2563eb' : '#16a34a',
              }}
            />
          );
        })}
        
        {/* Center logo or icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {message && (
        <p className="text-sm text-gray-600 animate-pulse text-center">
          {message}
        </p>
      )}
    </div>
  );
}