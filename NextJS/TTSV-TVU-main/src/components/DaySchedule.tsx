"use client";

import React from 'react';
import { Subject } from '@/types/schedule';
import SubjectCard from './SubjectCard';

interface DayScheduleProps {
  subjects: Subject[];
}

const DaySchedule: React.FC<DayScheduleProps> = ({ subjects }) => {
  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 bg-[var(--glass-bg)] backdrop-blur-md rounded-lg sm:rounded-xl border border-[var(--glass-border)] shadow-[var(--shadow-glass)]">
        <div className="p-2 sm:p-3 rounded-full bg-[var(--primary)]/10 mb-3 sm:mb-4 text-[var(--primary)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base md:text-lg font-medium px-4 text-center">Không có lịch học cho ngày này.</p>
      </div>
    );
  }

  // Sắp xếp môn học theo thời gian bắt đầu
  const sortedSubjects = [...subjects].sort((a, b) => a.tiet_bat_dau - b.tiet_bat_dau);

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-5">
      {sortedSubjects.map((subject, index) => (
        <SubjectCard key={index} subject={subject} variant="day" />
      ))}
    </div>
  );
};

export default DaySchedule;
