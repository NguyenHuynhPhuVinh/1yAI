/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Subtitle } from "@/types";
import { exportVideoWithSubtitles, isMediaRecorderSupported } from "@/utils/videoExport";

interface ExportOptionsProps {
  subtitles: Subtitle[];
  videoUrl: string;
}

const ExportOptions = ({ subtitles, videoUrl }: ExportOptionsProps) => {
  const [exportFormat, setExportFormat] = useState<"srt" | "vtt" | "json">("srt");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [videoExportProgress, setVideoExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);
  const isVideoExportSupported = typeof window !== 'undefined' ? isMediaRecorderSupported() : false;

  const exportSubtitles = () => {
    setIsExporting(true);
    
    let content = "";
    let filename = `subtitles_${Date.now()}`;
    
    if (exportFormat === "srt") {
      content = generateSRT(subtitles);
      filename += ".srt";
    } else if (exportFormat === "vtt") {
      content = generateVTT(subtitles);
      filename += ".vtt";
    } else {
      content = JSON.stringify(subtitles, null, 2);
      filename += ".json";
    }
    
    // Tạo file và download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const formatTime = (seconds: number, format: "srt" | "vtt") => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    if (format === "srt") {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
    } else {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
    }
  };

  const generateSRT = (subtitles: Subtitle[]) => {
    return subtitles
      .sort((a, b) => a.startTime - b.startTime)
      .map((sub, index) => {
        return `${index + 1}\n${formatTime(sub.startTime, "srt")} --> ${formatTime(sub.endTime, "srt")}\n${sub.text}\n`;
      })
      .join("\n");
  };

  const generateVTT = (subtitles: Subtitle[]) => {
    const header = "WEBVTT\n\n";
    const body = subtitles
      .sort((a, b) => a.startTime - b.startTime)
      .map((sub, index) => {
        return `${index + 1}\n${formatTime(sub.startTime, "vtt")} --> ${formatTime(sub.endTime, "vtt")}\n${sub.text}\n`;
      })
      .join("\n");
    
    return header + body;
  };

  // Hàm để tải video gốc
  const downloadOriginalVideo = () => {
    if (!videoUrl) return;
    
    // Tạo một thẻ a để tải video
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `video_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Hàm xuất video với phụ đề
  const handleExportVideoWithSubtitles = async () => {
    if (!videoUrl || subtitles.length === 0) return;
    
    try {
      setExportError(null);
      setIsExportingVideo(true);
      setVideoExportProgress(0);
      
      // Gọi hàm xử lý xuất video
      const outputUrl = await exportVideoWithSubtitles(
        videoUrl,
        subtitles,
        (progress) => setVideoExportProgress(progress)
      );
      
      // Tải xuống video kết quả
      const a = document.createElement('a');
      a.href = outputUrl;
      a.download = `video_subtitled_${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Giải phóng URL
      URL.revokeObjectURL(outputUrl);
    } catch (error) {
      console.error('Lỗi khi xuất video với phụ đề:', error);
      setExportError(
        error instanceof Error 
          ? error.message 
          : 'Đã xảy ra lỗi khi xuất video với phụ đề. Vui lòng thử lại!'
      );
    } finally {
      setIsExportingVideo(false);
      setVideoExportProgress(0);
    }
  };

  // Hiển thị thông báo thay thế cho nút xuất video với phụ đề
  const renderUnsupportedBrowserWarning = () => {
    return (
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-700">Không hỗ trợ xuất video</h3>
        <p className="text-sm text-yellow-800 mt-1">
          Trình duyệt của bạn không hỗ trợ tính năng xuất video với phụ đề.
          Vui lòng sử dụng Chrome hoặc Firefox phiên bản mới nhất.
        </p>
        <p className="text-sm text-yellow-800 mt-2">
          Bạn vẫn có thể:
        </p>
        <ol className="list-decimal text-sm text-yellow-800 ml-5 mt-2 space-y-1">
          <li>Xuất phụ đề dưới dạng file .srt hoặc .vtt</li>
          <li>Tải xuống video gốc</li>
          <li>Sử dụng phần mềm như VLC, HandBrake hoặc FFmpeg để kết hợp video và phụ đề</li>
        </ol>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl mb-4 text-blue-600">Xuất phụ đề</h2>
      
      <div className="mb-4">
        <label className="block mb-1">Định dạng xuất</label>
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as "srt" | "vtt" | "json")}
          className="w-full p-2 border rounded"
        >
          <option value="srt">SubRip (.srt)</option>
          <option value="vtt">WebVTT (.vtt)</option>
          <option value="json">JSON</option>
        </select>
      </div>
      
      <div className="flex flex-col gap-2">
        <button
          onClick={exportSubtitles}
          disabled={isExporting || subtitles.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          {isExporting ? "Đang xuất..." : "Xuất phụ đề"}
        </button>
        
        {videoUrl && (
          <>
            <button
              onClick={downloadOriginalVideo}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Tải video gốc
            </button>
            
            {isVideoExportSupported ? (
              <button
                onClick={handleExportVideoWithSubtitles}
                disabled={isExportingVideo || subtitles.length === 0}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-300"
              >
                {isExportingVideo ? "Đang xử lý..." : "Xuất video có phụ đề"}
              </button>
            ) : renderUnsupportedBrowserWarning()}
            
            {isExportingVideo && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${videoExportProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-center mt-1">{videoExportProgress}%</p>
              </div>
            )}
            
            {exportError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Lỗi:</strong> {exportError}
                </p>
                {renderUnsupportedBrowserWarning()}
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>Tùy chọn xuất:</strong>
        </p>
        <ul className="text-sm text-gray-600 list-disc pl-5">
          <li><strong>Xuất phụ đề:</strong> Tạo file phụ đề riêng biệt (SRT, VTT hoặc JSON)</li>
          <li><strong>Tải video gốc:</strong> Tải xuống video gốc không có phụ đề</li>
          <li><strong>Xuất video có phụ đề:</strong> Tạo video mới với phụ đề đã được nhúng vào (WebM)</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportOptions; 