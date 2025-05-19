"use client";

import React from 'react';
import { IconChevronLeft, IconChevronRight, IconCalendar, IconCalendarStats, IconSchool } from '@tabler/icons-react';
import { ViewMode, WeekInfo } from '@/types/schedule';

interface NavigationBarProps {
  viewMode: ViewMode;
  currentDate: Date;
  weekInfo?: WeekInfo;
  loading: boolean;
  error: string | null;
  onPrev: () => void;
  onNext: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  viewMode,
  currentDate,
  weekInfo,
  loading,
  error,
  onPrev,
  onNext
}) => {
  return (
    <div className="flex flex-col space-y-2 xs:space-y-3 sm:space-y-4">
      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="p-2 sm:p-3 rounded-full bg-[var(--glass-bg)] backdrop-blur-sm shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-neon-indigo)] text-[var(--primary)] hover:text-[var(--primary-dark)] transition-all duration-300 border border-[var(--glass-border)] hover:border-[var(--primary-light)]"
          aria-label={viewMode === 'day' ? 'Ngày trước' : 'Tuần trước'}
        >
          <IconChevronLeft size={18} stroke={2.5} className="group-hover:animate-[pulse_1s_ease-in-out]" />
        </button>

        {/* Date/Week Display */}
        <div className="text-center bg-[var(--glass-bg)] backdrop-blur-md px-3 xs:px-5 sm:px-8 py-2 xs:py-3 sm:py-3.5 rounded-lg sm:rounded-xl shadow-[var(--shadow-glass)] border border-[var(--glass-border)] relative overflow-hidden mx-1 flex-1 max-w-full">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-[var(--accent1-gradient)] opacity-10 rounded-full blur-xl -translate-y-1/2 translate-x-1/4 animate-[pulse_10s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-0 left-0 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-[var(--accent3-gradient)] opacity-10 rounded-full blur-xl translate-y-1/4 -translate-x-1/3 animate-[pulse_12s_ease-in-out_infinite_1s]"></div>
          
          {loading ? (
            <div className="h-4 sm:h-6 w-24 sm:w-36 md:w-48 bg-gray-200 bg-opacity-50 rounded-full animate-pulse mx-auto"></div>
          ) : error ? (
            <div className="text-[var(--text-secondary)] italic font-medium text-xs sm:text-sm">
              {viewMode === 'day' ? 'Ngày không xác định' : 'Tuần không xác định'}
            </div>
          ) : (
            <div className="font-semibold text-[var(--text-primary)] text-sm sm:text-base md:text-lg relative z-10">
              {viewMode === 'day' && (
                <div className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-2.5 flex-wrap">
                  <div className="p-1 sm:p-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                    <IconCalendar size={18} stroke={2} className="hidden xs:block" />
                    <IconCalendar size={16} stroke={2} className="xs:hidden" />
                  </div>
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg tracking-wide truncate max-w-[220px] sm:max-w-none">
                    {currentDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                </div>
              )}
              {viewMode === 'week' && weekInfo && (
                <div className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-2.5 flex-wrap">
                  <div className="p-1 sm:p-1.5 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)]">
                    <IconCalendarStats size={18} stroke={2} className="hidden xs:block" />
                    <IconCalendarStats size={16} stroke={2} className="xs:hidden" />
                  </div>
                  <span className="text-xs xs:text-sm sm:text-base md:text-lg tracking-wide truncate max-w-[220px] sm:max-w-none">
                    {weekInfo.thong_tin_tuan || 'Tuần hiện tại'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          className="p-2 sm:p-3 rounded-full bg-[var(--glass-bg)] backdrop-blur-sm shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-neon-indigo)] text-[var(--primary)] hover:text-[var(--primary-dark)] transition-all duration-300 border border-[var(--glass-border)] hover:border-[var(--primary-light)]"
          aria-label={viewMode === 'day' ? 'Ngày sau' : 'Tuần sau'}
        >
          <IconChevronRight size={18} stroke={2.5} className="group-hover:animate-[pulse_1s_ease-in-out]" />
        </button>
      </div>

      {/* Date Range Info - Only show in week view */}
      {viewMode === 'week' && weekInfo && weekInfo.ngay_bat_dau && weekInfo.ngay_ket_thuc && !loading && !error && (
        <div className="text-center text-sm sm:text-base text-[var(--text-secondary)] bg-[var(--glass-bg)] backdrop-blur-sm py-2 sm:py-3 px-3 sm:px-6 rounded-lg sm:rounded-xl shadow-[var(--shadow-sm)] border border-[var(--glass-border)] font-medium transition-all duration-300 hover:shadow-[var(--shadow-neon-violet)]">
          <div className="flex items-center justify-center gap-1.5 xs:gap-2 sm:gap-3 flex-wrap">
            <div className="p-1 sm:p-1.5 rounded-full bg-[var(--accent3)]/10 text-[var(--accent3)]">
              <IconSchool size={16} stroke={2} />
            </div>
            <span className="tracking-wide text-xs xs:text-sm sm:text-base truncate">{weekInfo.ngay_bat_dau} - {weekInfo.ngay_ket_thuc}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationBar;
