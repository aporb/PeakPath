'use client';

import { useState } from 'react';
import { Strength, DOMAIN_COLORS, DOMAIN_NAMES } from '../types/strength';

interface StrengthCardProps {
  strength: Strength;
  onClick?: (strength: Strength) => void;
  isExpanded?: boolean;
}

export default function StrengthCard({ strength, onClick, isExpanded = false }: StrengthCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = DOMAIN_COLORS[strength.domain];
  
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${colors.border} ${colors.background} ${colors.hover}
        ${isHovered ? 'shadow-lg scale-105 transform' : 'shadow-md'}
        ${strength.isTopFive ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
        backdrop-blur-sm bg-opacity-80
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(strength)}
    >
      {/* Top 5 Badge */}
      {strength.isTopFive && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full">
          TOP 5
        </div>
      )}
      
      {/* Rank Badge */}
      <div className={`absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-br ${colors.gradient} text-white flex items-center justify-center text-sm font-bold`}>
        {strength.rank}
      </div>
      
      {/* Content */}
      <div className="pt-12 pb-6 px-6">
        {/* Domain Label */}
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${colors.secondary} bg-white bg-opacity-60`}>
          {DOMAIN_NAMES[strength.domain]}
        </div>
        
        {/* Strength Name */}
        <h3 className={`text-xl font-bold mb-3 ${colors.primary}`}>
          {strength.name}
        </h3>
        
        {/* Description */}
        <p className={`text-sm leading-relaxed transition-all duration-300 ${
          isExpanded ? 'line-clamp-none' : 'line-clamp-3'
        } text-gray-700`}>
          {strength.description}
        </p>
        
        {/* Action Indicator */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {!isExpanded && strength.description.length > 120 ? (
              <span className="flex items-center">
                Read more
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            ) : (
              <span className="flex items-center">
                💬 Chat about this strength
              </span>
            )}
          </div>
          
          {/* Interactive Hover Button */}
          <div className={`transition-all duration-200 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} flex items-center justify-center shadow-md`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hover Effect Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 transition-opacity duration-300 ${
        isHovered ? 'opacity-5' : ''
      }`} />
    </div>
  );
}

// Grid container component for multiple strength cards
interface StrengthGridProps {
  strengths: Strength[];
  onStrengthClick?: (strength: Strength) => void;
  showTopFiveOnly?: boolean;
}

export function StrengthGrid({ strengths, onStrengthClick, showTopFiveOnly = false }: StrengthGridProps) {
  const displayStrengths = showTopFiveOnly 
    ? strengths.filter(s => s.isTopFive).sort((a, b) => a.rank - b.rank)
    : strengths.sort((a, b) => a.rank - b.rank);
    
  if (displayStrengths.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          No strengths found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or view selection.
        </p>
      </div>
    );
  }
    
  return (
    <div>
      {/* Grid Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {showTopFiveOnly ? 'Your Top 5 Strengths' : `All ${displayStrengths.length} Strengths`}
          </h3>
          <p className="text-sm text-gray-600">
            Click any card to start a coaching conversation about that strength
          </p>
        </div>
        
        {showTopFiveOnly && (
          <div className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            🏆 Your signature themes
          </div>
        )}
      </div>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {displayStrengths.map((strength, index) => (
          <div 
            key={strength.id} 
            className="transform transition-all duration-500 hover:z-10"
            style={{ 
              animation: `slideUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <StrengthCard
              strength={strength}
              onClick={onStrengthClick}
            />
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}