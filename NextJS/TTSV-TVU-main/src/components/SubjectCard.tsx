"use client";

import React from 'react';
import { Subject } from '@/types/schedule';
import { IconClock, IconHome, IconUser } from '@tabler/icons-react';

interface SubjectCardProps {
  subject: Subject;
  variant?: 'day' | 'week';
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, variant = 'day' }) => {
  // Hàm chuyển đổi tiết học sang buổi (sáng/chiều/tối)
  const getPeriodLabel = (startPeriod: number, endPeriod: number) => {
    // Xác định dựa trên tiết bắt đầu
    let periodType = '';
    if (startPeriod >= 1 && startPeriod <= 4) {
      periodType = 'Sáng';
    } else if (startPeriod >= 6 && startPeriod <= 9) {
      periodType = 'Chiều';
    } else if (startPeriod > 9) {
      periodType = 'Tối';
    } else {
      periodType = 'Khác';
    }
    
    // Hiển thị số tiết học cùng buổi
    return `${periodType} (${startPeriod}-${endPeriod})`;
  };
  return (
    <div className={`group bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--glass-border)] rounded-lg shadow-[var(--shadow-sm)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-neon-blue)] ${variant === 'week' ? 'hover:translate-x-1' : 'hover:translate-y-[-3px]'}`}>
      <div className="flex flex-col p-3 sm:p-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-2 sm:mb-3 space-y-2 sm:space-y-0">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base break-words">{subject.ten_mon}</h3>
            <div className="flex flex-wrap gap-1 mt-1 ml-0.5">
              <span 
                className="inline-block text-white px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 
                    subject.tiet_bat_dau >= 1 && subject.tiet_bat_dau <= 4 ? 'var(--accent1)' : 
                    subject.tiet_bat_dau >= 6 && subject.tiet_bat_dau <= 9 ? 'var(--accent2)' : 
                    'var(--accent3)'
                }}
              >
                {getPeriodLabel(subject.tiet_bat_dau, subject.tiet_bat_dau + subject.so_tiet - 1)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
            <div className="p-1 rounded-full bg-[var(--accent2)]/10 text-[var(--accent2)]">
              <IconClock size={14} stroke={2} className="xs:hidden" />
              <IconClock size={16} stroke={2} className="hidden xs:block" />
            </div>
            <div>
              <div>Tiết: {subject.tiet_bat_dau} - {subject.tiet_bat_dau + subject.so_tiet - 1}</div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center text-xs sm:text-sm text-[var(--text-secondary)] space-y-2 xs:space-y-0 mt-1">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)]">
              <IconHome size={14} stroke={2} className="xs:hidden" />
              <IconHome size={16} stroke={2} className="hidden xs:block" />
            </div>
            <span className="truncate max-w-[120px] sm:max-w-none">Phòng: {subject.ma_phong || 'Chưa có'}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-full bg-[var(--accent3)]/10 text-[var(--accent3)]">
              <IconUser size={14} stroke={2} className="xs:hidden" />
              <IconUser size={16} stroke={2} className="hidden xs:block" />
            </div>
            <span className="truncate max-w-[150px] sm:max-w-none">{subject.ten_giang_vien || 'Chưa có'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
