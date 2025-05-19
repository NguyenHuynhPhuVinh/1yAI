"use client";

import { useState, useCallback, useEffect } from 'react';
import { ScheduleData, ViewMode, Subject, GroupedSubjects } from '@/types/schedule';
import { formatDate, parseDMY, formatToDMY } from '@/utils/dateUtils';
import { getLocalStorage } from '@/utils/localStorage';

export const useSchedule = () => {
  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToolEnabled, setIsToolEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data States
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  
  // Navigation States
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date()); // For date navigation
  const [weekOffset, setWeekOffset] = useState(0); // For week navigation

  const fetchSchedule = useCallback(async (targetDate: Date, mode: ViewMode, offset: number = 0, specificWeek?: string) => {
    const studentId = getLocalStorage("tool:tvu_schedule:student_id", "");
    const password = getLocalStorage("tool:tvu_schedule:password", "");
    const semester = getLocalStorage("tool:tvu_schedule:semester", ""); // Fetch semester

    if (!studentId || !password) {
      setError("Vui lòng cấu hình MSSV và mật khẩu trong cài đặt.");
      setIsToolEnabled(false);
      setScheduleData(null);
      return;
    }
    setIsToolEnabled(true);
    setLoading(true);
    setError(null);
    setScheduleData(null); // Clear previous data

    try {
      const response = await fetch('/api/tvu/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          password,
          date: formatDate(targetDate), // Send yyyy-MM-dd
          isWeekView: mode === 'week',
          weekOffset: mode === 'week' ? offset : undefined, // Only send offset for week view
          week: specificWeek, // Send specific week number if provided
          semester: semester // Send selected semester
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Lỗi ${response.status}`);
      }

      setScheduleData(data);

    } catch (err: unknown) {
      console.error("Fetch schedule error:", err);
      // Type check before accessing properties
      let errorMessage = "Không thể tải thời khóa biểu.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      setScheduleData(null);
      if (errorMessage.includes("Đăng nhập thất bại")) {
        setIsToolEnabled(false); // Disable tool on auth failure
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and refetch when tool is enabled/date changes/mode changes
  useEffect(() => {
    const enabled = !!getLocalStorage("tool:tvu_schedule:student_id", "") && !!getLocalStorage("tool:tvu_schedule:password", "");
    setIsToolEnabled(enabled);
    if (enabled) {
      fetchSchedule(currentDate, viewMode, weekOffset);
    } else {
      // Reset state if tool is disabled
      setScheduleData(null);
      setError("Công cụ chưa được kích hoạt. Vui lòng vào cài đặt.");
    }
  }, [isToolEnabled, currentDate, viewMode, weekOffset, fetchSchedule]);

  const handleEnable = () => {
    setIsToolEnabled(true);
    setError(null); // Clear error on enable
    fetchSchedule(currentDate, viewMode, weekOffset); // Fetch immediately
  };

  const handleDisable = () => {
    setIsToolEnabled(false);
    setScheduleData(null);
    setError("Công cụ đã bị tắt.");
  };

  const handlePrev = () => {
    if (viewMode === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
      setWeekOffset(0); // Reset week offset when changing day
    } else {
      setWeekOffset(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
      setWeekOffset(0); // Reset week offset when changing day
    } else {
      setWeekOffset(prev => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setWeekOffset(0);
    // Fetch will be triggered by useEffect watching currentDate and weekOffset
  };

  const handleRefresh = () => {
    if (isToolEnabled) {
      fetchSchedule(currentDate, viewMode, weekOffset);
    }
  };

  const handleChangeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    setWeekOffset(0);
  };

  // Group subjects by day for week view
  const groupSubjectsByDay = (subjects: Subject[]): GroupedSubjects => {
    return subjects.reduce((acc, subject) => {
      let dateKey = subject.ngay_hoc; // Assume dd/MM/yyyy initially

      // Try to parse ngay_hoc, it might be a timestamp or dd/MM/yyyy
      let parsedDate: Date | null = null;
      if (subject.ngay_hoc?.includes('T')) { // Check if it looks like a timestamp (added optional chaining)
        try {
          parsedDate = new Date(subject.ngay_hoc);
        } catch {
          console.warn("Invalid date timestamp format:", subject.ngay_hoc);
          parsedDate = null;
        }
      } else if (subject.ngay_hoc) { // Check if ngay_hoc exists before parsing
        parsedDate = parseDMY(subject.ngay_hoc); // Try parsing as dd/MM/yyyy
      }

      // If parsing was successful, format to dd/MM/yyyy to use as key
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        dateKey = formatToDMY(parsedDate);
      } else {
        // Handle cases where ngay_hoc is null, undefined, or in an unexpected format
        console.warn("Unexpected or invalid date format for subject:", subject);
        dateKey = 'unknown_date'; // Assign a default key
      }

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      // Ensure subject is only pushed if dateKey is valid
      if (dateKey !== 'unknown_date') {
        acc[dateKey].push(subject);
        // Sort subjects within the day by start time
        acc[dateKey].sort((a, b) => a.tiet_bat_dau - b.tiet_bat_dau);
      }
      return acc;
    }, {} as GroupedSubjects);
  };

  // Prepare data for week view
  const groupedSubjects = viewMode === 'week' && scheduleData?.subjects 
    ? groupSubjectsByDay(scheduleData.subjects) 
    : {};
    
  // Sort days chronologically using the dd/MM/yyyy keys
  const sortedDays = Object.keys(groupedSubjects)
    .filter(key => key !== 'unknown_date') // Exclude invalid dates if any
    .sort((a, b) => {
      const dateA = parseDMY(a); // Key 'a' is now guaranteed dd/MM/yyyy
      const dateB = parseDMY(b); // Key 'b' is now guaranteed dd/MM/yyyy
      if (!dateA || !dateB) return 0; // Should not happen if filter works
      return dateA.getTime() - dateB.getTime();
    });

  // Check if there are subjects outside the displayed range
  const hasSubjectsOutsideRange = sortedDays.length === 0 && scheduleData?.subjects && scheduleData.subjects.length > 0;

  return {
    // States
    isModalOpen,
    isToolEnabled,
    loading,
    error,
    scheduleData,
    viewMode,
    currentDate,
    weekOffset,
    
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
  };
};
