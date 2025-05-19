"use client";

import React from 'react';

import TVUScheduleToolModal from '@/components/TVUScheduleToolModal';
import Header from '@/components/Header';
import ViewModeToggle from '@/components/ViewModeToggle';
import NavigationBar from '@/components/NavigationBar';
import ActionButtons from '@/components/ActionButtons';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import DaySchedule from '@/components/DaySchedule';
import WeekSchedule from '@/components/WeekSchedule';
import { useSchedule } from '@/hooks/useSchedule';

export default function Home() {
  const {
    // States
    isModalOpen,
    isToolEnabled,
    loading,
    error,
    scheduleData,
    viewMode,
    currentDate,
    
    // Week view data
    groupedSubjects,
    sortedDays,
    hasSubjectsOutsideRange,
    
    // Actions
    setIsModalOpen,
    handleEnable,
    handleDisable,
    handlePrev,
    handleNext,
    handleToday,
    handleRefresh,
    handleChangeViewMode
  } = useSchedule();

  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-6 max-w-5xl mx-auto relative overflow-hidden">
      {/* Decorative Background Elements - Circles with animations - Responsive sizes */}
      <div className="absolute top-20 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-[var(--accent3-gradient)] opacity-10 rounded-full blur-3xl animate-[pulse_15s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-20 left-0 w-36 sm:w-52 md:w-72 h-36 sm:h-52 md:h-72 bg-[var(--accent1-gradient)] opacity-10 rounded-full blur-3xl animate-[pulse_20s_ease-in-out_infinite_1s]"></div>
      <div className="absolute top-1/2 left-1/4 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-[var(--accent2-gradient)] opacity-10 rounded-full blur-3xl animate-[pulse_18s_ease-in-out_infinite_2s]"></div>
      
      <div className="space-y-4 sm:space-y-6 md:space-y-8 relative z-10">
        {/* Header - Title and Settings */}
        <div className="bg-[var(--glass-bg)] backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[var(--shadow-glass)] border border-[var(--glass-border)] transition-all duration-300 hover:shadow-[var(--shadow-neon-indigo)]">
          <Header onOpenSettings={() => setIsModalOpen(true)} />
        </div>

        {/* Main Content Container */}
        <div className="bg-[var(--glass-bg-dark)] backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-[var(--shadow-glass)] p-3 sm:p-5 md:p-6 border border-[var(--glass-border)] transition-all duration-300 hover:shadow-[var(--shadow-neon)] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-[var(--accent1-gradient)] opacity-15 rounded-full blur-xl -translate-y-1/3 translate-x-1/4 animate-[float_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-0 left-0 w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 bg-[var(--accent3-gradient)] opacity-15 rounded-full blur-xl translate-y-1/3 -translate-x-1/4 animate-[float_10s_ease-in-out_infinite_1s]"></div>
          <div className="absolute top-1/2 left-1/2 w-32 sm:w-48 md:w-60 h-32 sm:h-48 md:h-60 bg-[var(--rainbow-gradient)] opacity-5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 animate-[pulse_15s_ease-in-out_infinite]"></div>
          
          {/* View Mode Toggle */}
          <div className="mb-4 sm:mb-6 md:mb-8 relative z-10">
            <div className="bg-[var(--glass-bg)] backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm border border-[var(--glass-border)] transition-all hover:shadow-[var(--shadow-neon-cyan)] duration-300">
              <ViewModeToggle 
                viewMode={viewMode} 
                onChangeViewMode={handleChangeViewMode} 
              />
            </div>
          </div>

          {/* Navigation and Date/Week Info */}
          <div className="mb-4 sm:mb-6 md:mb-8 relative z-10">
            <div className="bg-[var(--glass-bg)] backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-sm border border-[var(--glass-border)] transition-all hover:shadow-[var(--shadow-neon-indigo)] duration-300">
              <NavigationBar
                viewMode={viewMode}
                currentDate={currentDate}
                weekInfo={scheduleData?.weekInfo}
                loading={loading}
                error={error}
                onPrev={handlePrev}
                onNext={handleNext}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-4 sm:mb-6 md:mb-8 relative z-10">
            <div className="bg-[var(--glass-bg)] backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-sm border border-[var(--glass-border)] transition-all hover:shadow-[var(--shadow-neon-emerald)] duration-300">
              <ActionButtons
                viewMode={viewMode}
                loading={loading}
                isToolEnabled={isToolEnabled}
                onToday={handleToday}
                onRefresh={handleRefresh}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="mt-4 sm:mt-6 md:mt-8 relative z-10 bg-[var(--glass-bg)] backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl shadow-md border border-[var(--glass-border)] transition-all duration-300 hover:shadow-[var(--shadow-neon-violet)]">
            {/* Loading State */}
            {loading && <LoadingState />}

            {/* Error State */}
            {error && !loading && (
              <ErrorState 
                error={error} 
                isToolEnabled={isToolEnabled} 
                onOpenSettings={() => setIsModalOpen(true)} 
              />
            )}

            {/* Schedule Display - Day View */}
            {viewMode === 'day' && !loading && !error && scheduleData && (
              <DaySchedule subjects={scheduleData.subjects} />
            )}

            {/* Schedule Display - Week View */}
            {viewMode === 'week' && !loading && !error && scheduleData && (
              <WeekSchedule 
                groupedSubjects={groupedSubjects} 
                sortedDays={sortedDays}
                hasSubjectsOutsideRange={!!hasSubjectsOutsideRange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <TVUScheduleToolModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEnable={handleEnable}
        onDisable={handleDisable}
        isEnabled={isToolEnabled}
      />
    </main>
  );
}
