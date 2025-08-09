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
        
        {/* Expand Indicator */}
        {!isExpanded && strength.description.length > 120 && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <span>Click to read more</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
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
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayStrengths.map((strength) => (
        <StrengthCard
          key={strength.id}
          strength={strength}
          onClick={onStrengthClick}
        />
      ))}
    </div>
  );
}