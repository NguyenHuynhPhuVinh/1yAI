"use client";

import React from 'react';
import { IconLoader } from '@tabler/icons-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[var(--text-secondary)]">
      <div className="relative mb-6">
        <IconLoader className="w-14 h-14 animate-spin text-[var(--primary)] mb-4" />
        <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-indigo-200"></div>
      </div>
      <p className="text-lg font-medium text-[var(--text-secondary)]">Đang tải thời khóa biểu...</p>
      <div className="mt-4 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-[var(--primary-gradient)] animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingState;
