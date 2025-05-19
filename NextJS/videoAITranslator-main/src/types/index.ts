export interface Subtitle {
  id: string;
  text: string;
  startTime: number; // thời gian bắt đầu tính bằng giây
  endTime: number; // thời gian kết thúc tính bằng giây
  position: {
    x: number; // phần trăm theo chiều ngang (0-100)
    y: number; // phần trăm theo chiều dọc (0-100)
  };
  style: {
    fontSize: number;
    color: string;
    backgroundColor: string;
    fontWeight: string;
    showBackground: boolean; // Hiển thị màu nền hay không
  };
}

export interface VideoState {
  url: string;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
} 