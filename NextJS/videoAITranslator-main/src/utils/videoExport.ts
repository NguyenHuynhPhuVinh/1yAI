import { Subtitle } from "@/types";

/**
 * Kiểm tra xem trình duyệt có hỗ trợ MediaRecorder không
 */
export const isMediaRecorderSupported = (): boolean => {
  return typeof window !== 'undefined' && 
         'MediaRecorder' in window && 
         'captureStream' in HTMLCanvasElement.prototype;
};

// Mở rộng HTMLVideoElement để thêm captureStream
declare global {
  interface HTMLVideoElement {
    captureStream?: () => MediaStream;
  }
}

/**
 * Tạo video có phụ đề sử dụng HTML Canvas 
 */
export const exportVideoWithSubtitles = async (
  videoUrl: string,
  subtitles: Subtitle[],
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!isMediaRecorderSupported()) {
        throw new Error("Trình duyệt của bạn không hỗ trợ tính năng ghi video. Vui lòng sử dụng Chrome hoặc Firefox phiên bản mới nhất.");
      }
      
      // Tạo các phần tử video và canvas
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Không thể tạo canvas context");
      }
      
      // Cấu hình video
      video.src = videoUrl;
      video.muted = false; // Cho phép âm thanh
      video.crossOrigin = "anonymous"; // Xử lý CORS nếu cần
      
      // Khi video đã tải metadata
      video.onloadedmetadata = () => {
        console.log("Video metadata loaded", video.videoWidth, video.videoHeight);
        
        // Thiết lập kích thước canvas bằng với kích thước video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Tạo stream từ video để lấy audio track
        let videoStream: MediaStream | null = null;
        
        try {
          // Tạo MediaRecorder để ghi lại nội dung canvas
          const canvasStream = canvas.captureStream(30); // 30 fps
          
          // Kết hợp audio từ video gốc (nếu có)
          if (video.captureStream) {
            videoStream = video.captureStream();
            const audioTracks = videoStream?.getAudioTracks() || [];
            if (audioTracks.length > 0) {
              audioTracks.forEach(track => {
                canvasStream.addTrack(track);
              });
            }
          }
          
          // Khởi tạo MediaRecorder với các tùy chọn chất lượng cao
          const mediaRecorder = new MediaRecorder(canvasStream, {
            mimeType: 'video/webm; codecs=vp9',
            videoBitsPerSecond: 3000000 // Giảm xuống 3 Mbps để ổn định hơn
          });
          
          const chunks: Blob[] = [];
          let lastDrawTime = 0;
          const frameInterval = 1000 / 30; // 30fps
          
          // Thu thập dữ liệu từ MediaRecorder
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              chunks.push(e.data);
            }
          };
          
          // Thêm xử lý lỗi cho mediaRecorder
          mediaRecorder.onerror = (event) => {
            console.error("MediaRecorder error:", event);
            if (videoStream) {
              videoStream.getTracks().forEach(track => track.stop());
            }
            reject(new Error("Lỗi MediaRecorder: " + event));
          };
          
          // Khi ghi hình hoàn tất
          mediaRecorder.onstop = () => {
            // Dọn dẹp
            if (videoStream) {
              videoStream.getTracks().forEach(track => track.stop());
            }
            
            // Tạo blob và URL
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            
            // Gửi URL đến callback
            resolve(url);
            onProgress(100);
          };
          
          // Bắt đầu ghi hình
          mediaRecorder.start(1000); // Thu thập dữ liệu mỗi giây
          
          // Đặt video về thời điểm đầu
          video.currentTime = 0;
          
          // Xử lý khi video kết thúc
          video.onended = () => {
            console.log("Video ended, stopping recorder");
            // Đợi chút để đảm bảo frame cuối được xử lý
            setTimeout(() => {
              mediaRecorder.stop();
            }, 200);
          };
          
          // Thêm xử lý khi video bị dừng đột ngột
          video.onstalled = () => {
            console.warn("Video bị dừng, đang thử khôi phục...");
            setTimeout(() => {
              if (!video.ended) {
                video.play().catch(e => {
                  console.error("Không thể khởi động lại video sau khi bị dừng:", e);
                });
              }
            }, 500);
          };
          
          // Bắt đầu phát video
          video.play().catch(error => {
            console.error("Lỗi khi phát video:", error);
            mediaRecorder.stop();
            reject(new Error("Không thể phát video để ghi hình: " + error.message));
          });
          
          // Vẽ video và phụ đề lên canvas
          const drawFrame = (timestamp: number) => {
            if (video.ended || video.paused) {
              return;
            }
            
            // Kiểm soát tốc độ vẽ frame để ổn định fps
            const elapsed = timestamp - lastDrawTime;
            if (elapsed < frameInterval && lastDrawTime !== 0) {
              requestAnimationFrame(drawFrame);
              return;
            }
            
            lastDrawTime = timestamp;
            
            // Vẽ frame hiện tại của video lên canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Tìm và vẽ các phụ đề hiện tại
            const currentTime = video.currentTime;
            
            // Tối ưu: chỉ lấy các phụ đề trong vùng thời gian gần với thời gian hiện tại
            const activeSubtitles = subtitles.filter(
              sub => currentTime >= sub.startTime && currentTime <= sub.endTime
            );
            
            // Vẽ từng phụ đề lên canvas
            activeSubtitles.forEach(subtitle => {
              // Thiết lập font và style
              ctx.font = `${subtitle.style.fontWeight} ${subtitle.style.fontSize}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              
              // Tính vị trí dựa trên tọa độ phần trăm
              const x = (subtitle.position.x / 100) * canvas.width;
              const y = (subtitle.position.y / 100) * canvas.height;
              
              // Tính toán ngắt dòng tự nhiên
              const maxWidth = canvas.width * 0.8; // 80% chiều rộng video
              
              // Xử lý xuống dòng thủ công trước (nếu có)
              const paragraphs = subtitle.text.split('\n');
              const lines = [];
              
              // Xử lý từng đoạn văn
              for (const paragraph of paragraphs) {
                // Nếu đoạn văn trống, thêm dòng trống
                if (paragraph.trim() === '') {
                  lines.push('');
                  continue;
                }
                
                const words = paragraph.split(' ');
                let currentLine = words[0] || '';
                
                // Xử lý trường hợp một từ quá dài
                if (words[0] && ctx.measureText(words[0]).width > maxWidth) {
                  // Chia từ thành các phần nhỏ hơn
                  const chars = words[0].split('');
                  let partialWord = chars[0];
                  
                  for (let j = 1; j < chars.length; j++) {
                    const testWord = partialWord + chars[j];
                    if (ctx.measureText(testWord).width > maxWidth) {
                      lines.push(partialWord);
                      partialWord = chars[j];
                    } else {
                      partialWord = testWord;
                    }
                  }
                  
                  currentLine = partialWord;
                }
                
                // Xử lý các từ còn lại trong đoạn
                for (let i = 1; i < words.length; i++) {
                  const word = words[i];
                  const testLine = currentLine + ' ' + word;
                  const metrics = ctx.measureText(testLine);
                  
                  if (metrics.width > maxWidth) {
                    lines.push(currentLine);
                    
                    // Xử lý từ dài hơn maxWidth
                    if (ctx.measureText(word).width > maxWidth) {
                      const chars = word.split('');
                      let partialWord = chars[0];
                      
                      for (let j = 1; j < chars.length; j++) {
                        const testWord = partialWord + chars[j];
                        if (ctx.measureText(testWord).width > maxWidth) {
                          lines.push(partialWord);
                          partialWord = chars[j];
                        } else {
                          partialWord = testWord;
                        }
                      }
                      
                      currentLine = partialWord;
                    } else {
                      currentLine = word;
                    }
                  } else {
                    currentLine = testLine;
                  }
                }
                
                if (currentLine) {
                  lines.push(currentLine);
                }
              }
              
              // Tính toán kích thước tổng thể của phụ đề
              const lineHeight = subtitle.style.fontSize * 1.2;
              const totalHeight = lineHeight * lines.length;
              const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
              const padding = 8;
              
              // Vẽ nền cho phụ đề nếu được bật
              if (subtitle.style.showBackground) {
                ctx.fillStyle = subtitle.style.backgroundColor;
                ctx.fillRect(
                  x - maxLineWidth/2 - padding,
                  y - totalHeight/2 - padding,
                  maxLineWidth + padding*2,
                  totalHeight + padding*2
                );
              }
              
              // Vẽ text phụ đề
              ctx.fillStyle = subtitle.style.color;
              
              // Thêm đổ bóng cho text khi không có nền
              if (!subtitle.style.showBackground) {
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
              } else {
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
              }
              
              // Vẽ từng dòng
              lines.forEach((line, index) => {
                const lineY = y - (totalHeight/2) + (index * lineHeight) + (lineHeight/2);
                ctx.fillText(line, x, lineY);
              });
            });
            
            // Cập nhật tiến trình
            const progress = Math.min(99, Math.floor((video.currentTime / video.duration) * 100));
            onProgress(progress);
            
            // Thêm kiểm tra trạng thái video và tái kích hoạt nếu cần
            if (!video.paused && !video.ended) {
              requestAnimationFrame(drawFrame);
            } else if (!video.ended) {
              // Thử khởi động lại video nếu bị pause không mong muốn
              console.log("Video bị dừng không mong muốn, đang khởi động lại...");
              video.play().catch(e => {
                console.error("Không thể khởi động lại video:", e);
              });
              requestAnimationFrame(drawFrame);
            }
          };
          
          // Khởi động vẽ frame với timestamp
          requestAnimationFrame(drawFrame);
        } catch (error) {
          console.error("Lỗi khi tạo MediaRecorder:", error);
          if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
          }
          reject(error);
        }
      };
      
      // Xử lý khi video gặp lỗi
      video.onerror = (e) => {
        console.error("Lỗi video:", e);
        reject(new Error("Không thể tải video"));
      };
      
    } catch (error) {
      reject(error);
    }
  });
}; 