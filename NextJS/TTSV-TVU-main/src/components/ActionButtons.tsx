"use client";

import React from 'react';
import { IconCalendarEvent, IconRefresh } from '@tabler/icons-react';
import { ViewMode } from '@/types/schedule';

interface ActionButtonsProps {
  viewMode: ViewMode;
  loading: boolean;
  isToolEnabled: boolean;
  onToday: () => void;
  onRefresh: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  viewMode,
  loading,
  isToolEnabled,
  onToday,
  onRefresh
}) => {
  return (
    <div className="flex justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6">
      <button
        onClick={onToday}
        className="relative flex items-center gap-1 xs:gap-2 sm:gap-3 px-3 xs:px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs xs:text-sm sm:text-base font-bold transition-all duration-500 overflow-hidden shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-neon-pink)]"
        style={{
          background: 'var(--accent1-gradient)',
          border: '2px solid transparent',
        }}
      >
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 right-0 w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 bg-white opacity-20 rounded-full blur-xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 bg-white opacity-20 rounded-full blur-xl translate-y-1/4 -translate-x-1/3"></div>
        </div>
        <div className="relative z-10 flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-white">
          <IconCalendarEvent size={16} className="sm:hidden" />
          <IconCalendarEvent size={20} className="hidden sm:inline-block" />
          <span>{viewMode === 'day' ? 'Hôm nay' : 'Tuần này'}</span>
        </div>
      </button>
      
      <button
        onClick={onRefresh}
        disabled={loading || !isToolEnabled}
        className={`relative flex items-center gap-1 xs:gap-2 sm:gap-3 px-3 xs:px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs xs:text-sm sm:text-base font-bold transition-all duration-500 overflow-hidden ${loading || !isToolEnabled ? 'opacity-70 cursor-not-allowed' : 'shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-neon-green)]'}`}
        style={{
          background: loading || !isToolEnabled ? 'var(--disabled-gradient)' : 'var(--accent3-gradient)',
          border: '2px solid transparent',
        }}
      >
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 right-0 w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 bg-white opacity-20 rounded-full blur-xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 bg-white opacity-20 rounded-full blur-xl translate-y-1/4 -translate-x-1/3"></div>
        </div>
        <div className="relative z-10 flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-white">
          <IconRefresh size={16} className={`sm:hidden ${loading ? 'animate-spin' : ''}`} />
          <IconRefresh size={20} className={`hidden sm:inline-block ${loading ? 'animate-spin' : ''}`} />
          <span>Tải lại</span>
        </div>
      </button>
    </div>
  );
};

export default ActionButtons;
