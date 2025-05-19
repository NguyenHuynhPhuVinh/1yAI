"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Subtitle } from "@/types";
import TextOverlay from "./TextOverlay";

interface TestPlayerProps {
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onVideoLoad: (url: string) => void;
  currentTime?: number;
  subtitles?: Subtitle[];
}

export default function TestPlayer({ 
  onTimeUpdate, 
  onDurationChange, 
  onVideoLoad,
  currentTime,
  subtitles = []
}: TestPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [localCurrentTime, setLocalCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Xóa URL cũ nếu có
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      
      console.log("TestPlayer: File được chọn:", file.name, file.type);
      const newUrl = URL.createObjectURL(file);
      console.log("TestPlayer: URL mới tạo:", newUrl);
      setVideoUrl(newUrl);
    }
  };

  // Kiểm tra khi video đã tải
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      console.log("TestPlayer: Video đã tải metadata");
      setIsLoaded(true);
      onVideoLoad(videoUrl);
      onDurationChange(video.duration);
    };

    const handleTimeUpdate = () => {
      setLocalCurrentTime(video.currentTime);
      onTimeUpdate(video.currentTime);
    };

    const handleError = () => {
      console.error("TestPlayer: Lỗi tải video:", video.error);
      setIsLoaded(false);
    };

    video.addEventListener('loadedmetadata', handleLoad);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoad);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl, onDurationChange, onTimeUpdate, onVideoLoad]);

  // Đồng bộ currentTime từ bên ngoài
  useEffect(() => {
    if (currentTime !== undefined && videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Lọc các subtitle hiện tại dựa trên thời gian
  const activeSubtitles = subtitles.filter(
    (sub) => {
      const time = currentTime !== undefined ? currentTime : localCurrentTime;
      return time >= sub.startTime && time <= sub.endTime;
    }
  );

  console.log("Active subtitles:", activeSubtitles, "Current time:", currentTime || localCurrentTime);

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Tải lên video</h2>
      
      <div className="flex items-center mb-4">
        <label 
          htmlFor="video-upload" 
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mr-2"
        >
          Chọn file video
        </label>
        <input 
          id="video-upload"
          type="file" 
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-gray-500 text-sm">
          {videoUrl ? "Đã chọn video" : "Chưa chọn file nào"}
        </span>
      </div>
      
      <div className="relative w-full aspect-video border border-gray-300 rounded-lg mb-4 overflow-hidden">
        {videoUrl ? (
          <>
            <video 
              ref={videoRef}
              src={videoUrl} 
              controls 
              className="w-full h-full bg-white"
              onLoadedMetadata={() => console.log("TestPlayer: onLoadedMetadata fired")}
              onError={() => console.log("TestPlayer: onError fired")}
            />
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {activeSubtitles.length > 0 && (
                <div className="debug-info absolute top-0 right-0 bg-blue-400 bg-opacity-70 text-black p-1 text-xs rounded-bl">
                  Có {activeSubtitles.length} phụ đề hoạt động
                </div>
              )}
              {activeSubtitles.map((subtitle) => (
                <TextOverlay key={subtitle.id} subtitle={subtitle} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 text-gray-700">
            Vui lòng tải lên video để bắt đầu
          </div>
        )}
      </div>
      
      <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
        <p className="flex justify-between mb-1">
          <span className="font-medium text-gray-700">Trạng thái:</span>
          <span className={isLoaded ? "text-green-600" : "text-gray-500"}>
            {isLoaded ? "Đã tải" : "Chưa tải"}
          </span>
        </p>
        {isLoaded && (
          <>
            <p className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">Độ dài:</span>
              <span>{videoRef.current?.duration.toFixed(2)}s</span>
            </p>
            <p className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">Thời gian hiện tại:</span>
              <span>{(currentTime || localCurrentTime).toFixed(2)}s</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-gray-700">Số phụ đề:</span>
              <span>{subtitles.length}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}