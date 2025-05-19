export interface Subject {
  ten_mon: string;
  ten_giang_vien: string;
  ma_phong: string;
  tiet_bat_dau: number;
  so_tiet: number;
  ngay_hoc: string; // dd/MM/yyyy or timestamp
}

export interface WeekInfo {
  thong_tin_tuan?: string;
  ngay_bat_dau?: string; // dd/MM/yyyy
  ngay_ket_thuc?: string; // dd/MM/yyyy
}

export interface ScheduleData {
  date: string; // yyyy-MM-dd
  subjects: Subject[];
  weekInfo?: WeekInfo;
}

export type ViewMode = 'day' | 'week';

export interface GroupedSubjects {
  [key: string]: Subject[];
}
