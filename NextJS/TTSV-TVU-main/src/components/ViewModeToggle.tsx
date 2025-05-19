"use client";

import React from 'react';
import { IconLayoutGrid, IconCalendarEvent } from '@tabler/icons-react';
import { ViewMode } from '@/types/schedule';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, onChangeViewMode }) => {
  return (
    <div className="flex justify-center gap-2 xs:gap-3 sm:gap-4 w-full">
      {/* Nút Xem theo ngày */}
      <button
        onClick={() => onChangeViewMode('day')}
        className={`
          relative flex items-center justify-center gap-1 xs:gap-2 px-2 xs:px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs xs:text-sm sm:text-base
          transition-all duration-300 border-2 flex-1 sm:flex-none sm:min-w-[110px] md:min-w-[130px]
          ${viewMode === 'day' 
            ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md' 
            : 'bg-white text-[var(--text-secondary)] border-[var(--border)]'}
        `}
      >
        <div className="flex items-center gap-1 xs:gap-2 font-medium sm:font-semibold">
          <IconCalendarEvent 
            size={16} 
            className={viewMode === 'day' ? 'text-white' : 'text-[var(--primary)]'} 
            stroke={2.5}
          />
          <span>Theo ngày</span>
        </div>
      </button>
      
      {/* Nút Xem theo tuần */}
      <button
        onClick={() => onChangeViewMode('week')}
        className={`
          relative flex items-center justify-center gap-1 xs:gap-2 px-2 xs:px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs xs:text-sm sm:text-base
          transition-all duration-300 border-2 flex-1 sm:flex-none sm:min-w-[110px] md:min-w-[130px]
          ${viewMode === 'week' 
            ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-md' 
            : 'bg-white text-[var(--text-secondary)] border-[var(--border)]'}
        `}
      >
        <div className="flex items-center gap-1 xs:gap-2 font-medium sm:font-semibold">
          <IconLayoutGrid 
            size={16} 
            className={viewMode === 'week' ? 'text-white' : 'text-[var(--secondary)]'} 
            stroke={2.5}
          />
          <span>Theo tuần</span>
        </div>
      </button>
    </div>
  );
};

export default ViewModeToggle;
