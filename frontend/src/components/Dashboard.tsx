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
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* How it Works */}
              <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-80">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    How PeakPath Works
                  </h3>
                </div>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Upload Your Assessment</p>
                      <p className="text-sm text-gray-600">Drop your CliftonStrengths PDF above to get started instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-purple-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">AI Analysis</p>
                      <p className="text-sm text-gray-600">Advanced AI analyzes your unique strengths combination</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-bold text-green-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Personalized Coaching</p>
                      <p className="text-sm text-gray-600">Receive tailored insights and development strategies</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What You'll Get */}
              <div className="bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-80">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    What You&apos;ll Discover
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Interactive strengths dashboard with domain insights</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">AI-powered coaching conversations tailored to you</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Practical strategies for leveraging your strengths</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">Development plans focused on your unique talents</p>
                  </div>
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
        {/* Enhanced Header with Welcome Message */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              {profile && (
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-6 border border-blue-200/30">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Welcome back! Your strengths are ready to explore.
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Assessment uploaded • {profile.strengths.length} strengths identified
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    Click any strength below to start a focused coaching conversation, or begin with general coaching guidance.
                  </p>
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                {profile ? 'Your Strengths Dashboard' : 'Welcome to PeakPath'}
              </h1>
              <p className="text-gray-600">
                {profile 
                  ? 'Discover and develop your unique talents with AI-powered coaching'
                  : 'Unlock your potential with personalized CliftonStrengths coaching'
                }
              </p>
            </div>
            
            {profile && (
              <div className="mt-6 lg:mt-0 flex flex-col gap-3">
                <button
                  onClick={onStartCoaching}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center group"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Start AI Coaching
                </button>
                <div className="text-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    💡 Or click any strength card below
                  </span>
                </div>
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
                  const domainColors = {
                    [StrengthDomain.EXECUTING]: 'from-red-400 to-red-600',
                    [StrengthDomain.INFLUENCING]: 'from-orange-400 to-orange-600', 
                    [StrengthDomain.RELATIONSHIP_BUILDING]: 'from-green-400 to-green-600',
                    [StrengthDomain.STRATEGIC_THINKING]: 'from-blue-400 to-blue-600'
                  };
                  
                  return (
                    <div
                      key={domain}
                      className="bg-white rounded-xl p-5 shadow-md backdrop-blur-sm bg-opacity-80 hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
                      onClick={() => setSelectedDomain(domain)}
                    >
                      <div className="text-center">
                        <div className={`w-12 h-12 bg-gradient-to-r ${domainColors[domain]} rounded-full flex items-center justify-center mx-auto mb-3`}>
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
                              className={`bg-gradient-to-r ${domainColors[domain]} h-2 rounded-full transition-all duration-300`}
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
                      const domainColors = {
                        [StrengthDomain.EXECUTING]: 'from-red-500 to-red-700',
                        [StrengthDomain.INFLUENCING]: 'from-orange-500 to-orange-700', 
                        [StrengthDomain.RELATIONSHIP_BUILDING]: 'from-green-500 to-green-700',
                        [StrengthDomain.STRATEGIC_THINKING]: 'from-blue-500 to-blue-700'
                      };
                      
                      return (
                        <button
                          key={domain}
                          onClick={() => setSelectedDomain(domain)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedDomain === domain
                              ? `bg-gradient-to-r ${domainColors[domain]} text-white shadow-md`
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