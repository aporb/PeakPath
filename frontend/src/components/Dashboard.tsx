'use client';

import { useState } from 'react';
import { StrengthProfile, Strength, StrengthDomain, DOMAIN_NAMES } from '../types/strength';
import { StrengthGrid } from './StrengthCard';
import LoadingSpinner, { LoadingCard } from './LoadingSpinner';
import FileUpload from './FileUpload';

interface DashboardProps {
  profile?: StrengthProfile;
  isLoading?: boolean;
  onFileUpload?: (file: File) => Promise<void>;
  onStrengthClick?: (strength: Strength) => void;
  onStartCoaching?: () => void;
}

export default function Dashboard({ 
  profile, 
  isLoading = false,
  onFileUpload,
  onStrengthClick,
  onStartCoaching 
}: DashboardProps) {
  const [activeView, setActiveView] = useState<'all' | 'top5'>('top5');
  const [selectedDomain, setSelectedDomain] = useState<StrengthDomain | 'all'>('all');

  const domains = Object.values(StrengthDomain);
  
  // Filter strengths based on selected domain
  const filteredStrengths = profile?.strengths.filter(strength => 
    selectedDomain === 'all' || strength.domain === selectedDomain
  ) || [];

  // Calculate domain distribution
  const domainStats = domains.map(domain => {
    const count = profile?.strengths.filter(s => s.domain === domain).length || 0;
    const topFiveCount = profile?.strengths.filter(s => s.domain === domain && s.isTopFive).length || 0;
    return { domain, count, topFiveCount };
  });

  if (!profile && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to PeakPath
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock your potential with personalized CliftonStrengths coaching. 
              Upload your assessment report to get started.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <FileUpload 
              onFileUpload={onFileUpload || (async () => {})}
              className="mb-8"
            />
            
            <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-80">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                What happens next?
              </h3>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <p>Upload your CliftonStrengths assessment PDF</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">2</span>
                  </div>
                  <p>AI will analyze your strengths and create your personalized dashboard</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600">3</span>
                  </div>
                  <p>Start receiving tailored coaching insights and development strategies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Your Strengths Dashboard
              </h1>
              <p className="text-gray-600">
                Discover and develop your unique talents with AI-powered coaching
              </p>
            </div>
            
            {profile && (
              <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onStartCoaching}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Start AI Coaching
                </button>
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : profile ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {domainStats.map(({ domain, count, topFiveCount }) => (
                <div
                  key={domain}
                  className="bg-white rounded-xl p-4 shadow-md backdrop-blur-sm bg-opacity-80 hover:shadow-lg transition-shadow"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{topFiveCount}</div>
                    <div className="text-sm text-gray-500 mb-2">Top 5</div>
                    <div className="text-xs font-medium text-gray-600">
                      {DOMAIN_NAMES[domain]}
                    </div>
                    <div className="text-xs text-gray-400">
                      {count} total
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-xl p-6 shadow-md backdrop-blur-sm bg-opacity-80 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setActiveView('top5')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      activeView === 'top5'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Top 5 Strengths
                  </button>
                  <button
                    onClick={() => setActiveView('all')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      activeView === 'all'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    All Strengths
                  </button>
                </div>

                {/* Domain Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDomain('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDomain === 'all'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All Domains
                  </button>
                  {domains.map(domain => (
                    <button
                      key={domain}
                      onClick={() => setSelectedDomain(domain)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedDomain === domain
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {DOMAIN_NAMES[domain]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths Grid */}
            {filteredStrengths.length > 0 ? (
              <StrengthGrid
                strengths={filteredStrengths}
                onStrengthClick={onStrengthClick}
                showTopFiveOnly={activeView === 'top5'}
              />
            ) : (
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
            )}
          </>
        ) : (
          <LoadingSpinner size="xl" message="Loading your strengths profile..." />
        )}
      </div>
    </div>
  );
}