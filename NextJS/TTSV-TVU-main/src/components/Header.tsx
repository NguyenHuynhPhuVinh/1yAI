"use client";

import React from 'react';
import { IconCalendarEvent, IconSettings } from '@tabler/icons-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-lg sm:rounded-xl shadow-[var(--shadow-neon)] px-4 py-3 sm:px-5 sm:py-4 md:p-5 border-2 border-[var(--border-accent)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-white opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 bg-white opacity-10 rounded-full blur-xl"></div>
      
      <div className="flex items-center gap-2 sm:gap-3 relative z-10">
        <div className="p-2 sm:p-2.5 md:p-3 rounded-full bg-white bg-opacity-20 backdrop-blur-sm text-white shadow-lg flex-shrink-0">
          <IconCalendarEvent size={20} className='text-[var(--primary)] sm:hidden' />
          <IconCalendarEvent size={24} className='text-[var(--primary)] hidden sm:inline-block md:hidden' />
          <IconCalendarEvent size={28} className='text-[var(--primary)] hidden md:inline-block' />
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white drop-shadow-md">Lịch Học TVU</h1>
      </div>
      <button
        onClick={onOpenSettings}
        className="p-2 sm:p-2.5 md:p-3 rounded-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30 text-white transition-all duration-300 border border-white border-opacity-30 hover:border-opacity-50 relative z-10 shadow-lg hover:shadow-xl flex-shrink-0"
        aria-label="Mở cài đặt"
      >
        <IconSettings size={20} className='text-[var(--secondary)] sm:hidden' />
        <IconSettings size={22} className='text-[var(--secondary)] hidden sm:inline-block md:hidden' />
        <IconSettings size={26} className='text-[var(--secondary)] hidden md:inline-block' />
      </button>
    </div>
  );
};

export default Header;
