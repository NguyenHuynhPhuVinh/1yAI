/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import TestPlayer from "@/components/VideoPlayer";
import SubtitleEditor from "@/components/SubtitleEditor";
import Timeline from "@/components/Timeline";
import ExportOptions from "@/components/ExportOptions";
import { Subtitle, VideoState } from "@/types";

export default function Home() {
  const [videoState, setVideoState] = useState<VideoState>({
    url: "",
    duration: 0,
    currentTime: 0,
    isPlaying: false,
  });
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  // Lấy subtitle đang được chọn
  const selectedSubtitle = subtitles.find((sub) => sub.id === selectedSubtitleId) || null;

  // Cập nhật thời gian
  const handleTimeUpdate = (time: number) => {
    setVideoState(prev => ({ ...prev, currentTime: time }));
  };

  // Cập nhật độ dài video
  const handleDurationChange = (duration: number) => {
    setVideoState(prev => ({ ...prev, duration }));
  };

  // Xử lý khi video được tải
  const handleVideoLoad = (url: string) => {
    setIsVideoLoaded(true);
    setVideoState(prev => ({ ...prev, url }));
  };

  // Thêm phụ đề mới
  const handleAddSubtitle = (subtitle: Subtitle) => {
    setSubtitles((prev) => [...prev, subtitle]);
    setSelectedSubtitleId(subtitle.id);
  };

  // Cập nhật phụ đề
  const handleUpdateSubtitle = (updatedSubtitle: Subtitle) => {
    setSubtitles((prev) =>
      prev.map((sub) => (sub.id === updatedSubtitle.id ? updatedSubtitle : sub))
    );
  };

  // Xóa phụ đề
  const handleDeleteSubtitle = (id: string) => {
    setSubtitles((prev) => prev.filter((sub) => sub.id !== id));
    setSelectedSubtitleId(null);
  };

  // Chọn phụ đề từ timeline
  const handleSubtitleSelect = (id: string) => {
    setSelectedSubtitleId(id);
    
    // Di chuyển đến thời điểm bắt đầu của phụ đề
    const subtitle = subtitles.find((sub) => sub.id === id);
    if (subtitle) {
      setVideoState((prev) => ({ ...prev, currentTime: subtitle.startTime }));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 gap-6 bg-white text-gray-800">
      <h1 className="text-2xl md:text-3xl font-bold mt-4 text-blue-600">Trình chỉnh sửa phụ đề video</h1>
      
      <div className="w-full max-w-6xl">
        <TestPlayer 
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onVideoLoad={handleVideoLoad}
          currentTime={videoState.currentTime}
          subtitles={subtitles}
        />
        
        {isVideoLoaded && (
          <>
            <div className="mt-4">
              <Timeline
                duration={videoState.duration}
                currentTime={videoState.currentTime}
                subtitles={subtitles}
                onTimeChange={handleTimeUpdate}
                onSubtitleSelect={handleSubtitleSelect}
                selectedSubtitleId={selectedSubtitleId}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h2 className="text-xl mb-4 text-blue-600 font-semibold">Danh sách phụ đề</h2>
                  
                  {subtitles.length > 0 ? (
                    <div className="space-y-2">
                      {subtitles.map((subtitle) => (
                        <div
                          key={subtitle.id}
                          className={`p-2 border rounded cursor-pointer ${
                            selectedSubtitleId === subtitle.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => handleSubtitleSelect(subtitle.id)}
                        >
                          <p className="font-mono text-sm text-gray-700">
                            {formatTime(subtitle.startTime)} - {formatTime(subtitle.endTime)}
                          </p>
                          <p className="line-clamp-1">{subtitle.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Chưa có phụ đề nào. Thêm phụ đề đầu tiên!</p>
                  )}
                  
                  <button
                    onClick={() => setSelectedSubtitleId(null)}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Thêm phụ đề mới
                  </button>
                </div>
                
                <div className="mt-6">
                  <ExportOptions subtitles={subtitles} videoUrl={videoState.url} />
                </div>
              </div>
              
              <div>
                <SubtitleEditor
                  subtitle={selectedSubtitle}
                  currentTime={videoState.currentTime}
                  onUpdate={handleUpdateSubtitle}
                  onAdd={handleAddSubtitle}
                  onDelete={handleDeleteSubtitle}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Hàm định dạng thời gian
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
