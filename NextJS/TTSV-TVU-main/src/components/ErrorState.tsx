"use client";

import React from 'react';
import { IconAlertCircle, IconSettings } from '@tabler/icons-react';

interface ErrorStateProps {
  error: string;
  isToolEnabled?: boolean; // Làm thành optional để tránh warning khi không dùng
  onOpenSettings: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onOpenSettings }) => {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6 bg-red-50 border border-[var(--danger)] border-opacity-20 rounded-xl shadow-[var(--shadow-sm)]">
      <div className="p-3 rounded-full bg-red-100 mb-4">
        <IconAlertCircle className="w-12 h-12 text-[var(--danger)]" />
      </div>
      <p className="text-[var(--danger)] font-semibold text-xl mb-3">Lỗi!</p>
      <p className="text-red-600/80 text-base mb-6 max-w-md">{error}</p>
      <button
        onClick={onOpenSettings}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-medium bg-white bg-opacity-10 backdrop-blur-sm text-[var(--primary)] rounded-lg hover:bg-opacity-20 transition-all duration-300 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] border border-[var(--primary)] border-opacity-50"
        aria-label="Đi đến cài đặt"
      >
        <IconSettings size={16} className="text-[var(--primary)] sm:block md:hidden" />
        <IconSettings size={18} className="text-[var(--primary)] hidden md:block" />
        <span>Đi đến cài đặt</span>
      </button>
    </div>
  );
};

export default ErrorState;
