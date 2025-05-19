"use client";

import React from 'react';
import { GroupedSubjects, Subject } from '@/types/schedule';
import SubjectCard from './SubjectCard';
import { getDayName, parseDMY } from '@/utils/dateUtils';

interface WeekScheduleProps {
  groupedSubjects: GroupedSubjects;
  sortedDays: string[];
  hasSubjectsOutsideRange: boolean;
}

const WeekSchedule: React.FC<WeekScheduleProps> = ({ 
  groupedSubjects, 
  sortedDays,
  hasSubjectsOutsideRange
}) => {
  if (sortedDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 bg-[var(--glass-bg)] backdrop-blur-md rounded-lg sm:rounded-xl border border-[var(--glass-border)] shadow-[var(--shadow-glass)]">
        <div className="p-3 sm:p-4 rounded-full bg-[var(--primary)]/10 mb-3 sm:mb-5 text-[var(--primary)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base md:text-lg font-semibold tracking-wide px-4 text-center">Không có lịch học cho tuần này.</p>
      </div>
    );
  }

  // Hàm hỗ trợ nhóm các môn theo buổi (sáng/chiều/tối)
  const groupSubjectsByPeriod = (subjects: Subject[]) => {
    interface PeriodGroup {
      label: string;
      subjects: Subject[];
      color: string;
    }
    
    interface PeriodGroups {
      morning: PeriodGroup;
      afternoon: PeriodGroup;
      evening: PeriodGroup;
      other: PeriodGroup;
      [key: string]: PeriodGroup;
    }
    
    const periods: PeriodGroups = {
      morning: { label: 'Sáng', subjects: [], color: 'var(--accent1)' },
      afternoon: { label: 'Chiều', subjects: [], color: 'var(--accent2)' },
      evening: { label: 'Tối', subjects: [], color: 'var(--accent3)' },
      other: { label: 'Khác', subjects: [], color: 'var(--accent4)' }
    };

    // Xếp loại theo tiết bắt đầu
    subjects.forEach(subject => {
      if (subject.tiet_bat_dau >= 1 && subject.tiet_bat_dau <= 4) {
        periods.morning.subjects.push(subject);
      } else if (subject.tiet_bat_dau >= 6 && subject.tiet_bat_dau <= 9) {
        periods.afternoon.subjects.push(subject);
      } else if (subject.tiet_bat_dau > 9) {
        periods.evening.subjects.push(subject);
      } else {
        periods.other.subjects.push(subject);
      }
    });

    // Sắp xếp theo thứ tự các tiết
    Object.values(periods).forEach(period => {
      period.subjects.sort((a, b) => a.tiet_bat_dau - b.tiet_bat_dau);
    });

    return periods;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {sortedDays.map(dayKey => {
        const dateForDayName = parseDMY(dayKey);
        const dayName = dateForDayName ? getDayName(dateForDayName.toISOString()) : 'Không rõ';
        // Nhóm các môn học theo buổi
        const periodGroups = groupSubjectsByPeriod(groupedSubjects[dayKey]);

        return (
          <div key={dayKey} className="bg-[var(--glass-bg-dark)] backdrop-blur-sm rounded-lg sm:rounded-xl shadow-[var(--shadow-glass)] overflow-hidden border border-[var(--glass-border)] hover:shadow-[var(--shadow-neon)] transition-all duration-300">
            <h2 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-[var(--primary-light)/10] to-[var(--glass-bg)] py-2.5 sm:py-3.5 px-3 sm:px-5 border-b border-[var(--glass-border)] flex items-baseline gap-1 sm:gap-2 flex-wrap">
              <span className="text-[var(--primary)] font-bold">{dayName}</span>
              <span className="text-xs sm:text-sm text-[var(--text-tertiary)]">{dayKey}</span>
            </h2>
            <div className="p-3 sm:p-4 md:p-5 space-y-4 sm:space-y-6">
              {/* Hiển thị theo từng buổi */}
              {Object.entries(periodGroups).map(([periodKey, periodData]) => {
                const { label, subjects, color } = periodData;
                
                if (subjects.length === 0) return null;
                
                return (
                  <div key={periodKey} className="space-y-2 sm:space-y-3">
                    {/* Tiêu đề buổi học */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: color }}
                      ></div>
                      <h3 className="text-xs sm:text-sm font-semibold text-[var(--text-secondary)]" style={{ color }}>
                        Buổi {label}
                      </h3>
                    </div>
                    
                    {/* Danh sách môn học */}
                    <div className="space-y-2 sm:space-y-3">
                      {subjects.map((subject, index) => (
                        <SubjectCard 
                          key={`${dayKey}-${periodKey}-${index}`} 
                          subject={subject}
                          variant="week"
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* Nếu không có môn học nào */}
              {groupedSubjects[dayKey].length === 0 && (
                <div className="py-2 sm:py-4 text-center text-[var(--text-tertiary)] italic text-xs sm:text-sm">
                  Không có môn học trong ngày này
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {hasSubjectsOutsideRange && (
        <div className="flex flex-col items-center justify-center py-4 sm:py-6 md:py-8 px-3 sm:px-6 bg-[var(--glass-bg)] backdrop-blur-sm border border-[var(--warning)]/20 rounded-lg sm:rounded-xl shadow-[var(--shadow-glass)]">
          <div className="p-2 sm:p-2.5 rounded-full bg-[var(--warning)]/10 mb-2 sm:mb-3 text-[var(--warning)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-[var(--warning)] text-xs sm:text-sm md:text-base font-medium text-center">Có lịch học được trả về nhưng không thuộc phạm vi tuần hiển thị.</p>
        </div>
      )}
    </div>
  );
};

export default WeekSchedule;
