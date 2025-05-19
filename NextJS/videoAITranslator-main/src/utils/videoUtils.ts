/**
 * Chuyển đổi thời gian từ giây sang định dạng HH:MM:SS
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Chuyển đổi từ định dạng HH:MM:SS sang giây
 */
export const parseTimeString = (timeString: string): number => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Tạo ID ngẫu nhiên cho phụ đề
 */
export const generateId = (): string => {
  return `sub_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

/**
 * Tạo thumbnail từ video tại thời điểm cụ thể
 */
export const createThumbnail = async (
  videoUrl: string,
  time: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.currentTime = time;
    
    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Không thể tạo context 2D"));
        return;
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      resolve(dataUrl);
    };
    
    video.onerror = () => {
      reject(new Error("Lỗi khi tải video"));
    };
  });
}; 