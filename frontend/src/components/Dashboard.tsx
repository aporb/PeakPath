'use client';

import { useState } from 'react';
import { StrengthProfile, Strength, StrengthDomain, DOMAIN_NAMES, DOMAIN_COLORS } from '../types/strength';
import { StrengthGrid } from './StrengthCard';
import LoadingSpinner, { LoadingCard } from './LoadingSpinner';

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
    // Show loading state while waiting for profile to load
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="xl" message="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Professional Header */}
        <div className="mb-8">
          {profile && (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-6">
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-slate-600">Assessment Complete</span>
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900">
                      {(profile as any)?.userName ? `${(profile as any).userName}'s` : 'Your'} CliftonStrengths Profile
                    </h1>
                    <p className="text-sm text-slate-600 mt-1">
                      {profile.strengths.length} strengths identified
                      {(profile as any)?.additionalUserInfo?.organization && (
                        <> • {(profile as any).additionalUserInfo.organization}</>
                      )}
                    </p>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <button
                      onClick={onStartCoaching}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-md transition-all duration-200 flex items-center group"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Start AI Coaching
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-slate-50">
                <p className="text-sm text-slate-700">
                  Select any strength below to begin targeted coaching, or start with general guidance.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {profile ? 'Strengths Dashboard' : 'Welcome to PeakPath'}
              </h2>
              <p className="text-slate-600">
                {profile 
                  ? 'Analyze and develop your unique talent profile'
                  : 'Upload your CliftonStrengths assessment to begin'
                }
              </p>
            </div>
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
            {/* Enhanced Stats Overview */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Domain Overview</h3>
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Your top 5 strengths distribution
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {domainStats.map(({ domain, count, topFiveCount }) => {
                  const percentage = profile ? Math.round((topFiveCount / 5) * 100) : 0;
                  const domainGradient = DOMAIN_COLORS[domain].gradient;
                  
                  return (
                    <div
                      key={domain}
                      className="bg-white rounded-xl p-5 shadow-md backdrop-blur-sm bg-opacity-80 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
                      onClick={() => setSelectedDomain(domain)}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${domainGradient} rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold text-lg">{topFiveCount}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {DOMAIN_NAMES[domain]}
                        </div>
                        <div className="text-xs text-gray-400">
                          {topFiveCount} of 5 top strengths
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-gradient-to-r ${domainGradient} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Filter Controls */}
            <div className="bg-white rounded-xl p-6 shadow-md backdrop-blur-sm bg-opacity-80 mb-8 border border-gray-100">
              <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">View Your Strengths</h3>
                  <div className="text-sm text-gray-500">
                    {activeView === 'top5' ? '5' : filteredStrengths.length} strengths {selectedDomain !== 'all' ? `in ${DOMAIN_NAMES[selectedDomain]}` : ''}
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setActiveView('top5')}
                      className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center ${
                        activeView === 'top5'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Top 5 Strengths
                    </button>
                    <button
                      onClick={() => setActiveView('all')}
                      className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center ${
                        activeView === 'all'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      All Strengths
                    </button>
                  </div>

                  {/* Domain Filter */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedDomain('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedDomain === 'all'
                          ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All Domains
                    </button>
                    {domains.map(domain => {
                      const domainGradient = DOMAIN_COLORS[domain].gradient;
                      
                      return (
                        <button
                          key={domain}
                          onClick={() => setSelectedDomain(domain)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedDomain === domain
                              ? `bg-gradient-to-r ${domainGradient} text-white shadow-md`
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {DOMAIN_NAMES[domain]}
                        </button>
                      );
                    })}
                  </div>
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