// Helper to format date to yyyy-MM-dd
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Helper to get day name in Vietnamese
export const getDayName = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Ngày không hợp lệ';
    }
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return days[date.getDay()];
  } catch (e) {
    console.error("Error getting day name for:", dateString, e);
    return 'Lỗi ngày';
  }
};

// Helper to parse dd/MM/yyyy to Date object
export const parseDMY = (dateString: string): Date | null => {
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    // Basic validation for date components
    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const date = new Date(year, month, day);
      if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date;
      }
    }
  }
  return null;
}

// Helper to format Date object to dd/MM/yyyy
export const formatToDMY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
