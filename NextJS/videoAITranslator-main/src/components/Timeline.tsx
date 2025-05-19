import { useRef, useEffect } from "react";
import { Subtitle } from "@/types";

interface TimelineProps {
  duration: number;
  currentTime: number;
  subtitles: Subtitle[];
  onTimeChange: (time: number) => void;
  onSubtitleSelect: (id: string) => void;
  selectedSubtitleId: string | null;
}

const Timeline = ({
  duration,
  currentTime,
  subtitles,
  onTimeChange,
  onSubtitleSelect,
  selectedSubtitleId,
}: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        onTimeChange(percentage * duration);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [duration, onTimeChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (timelineRef.current) {
      isDraggingRef.current = true;
      const rect = timelineRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
      onTimeChange(percentage * duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-1 text-sm">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div
        ref={timelineRef}
        className="relative h-8 bg-gray-100 rounded cursor-pointer border border-gray-200"
        onMouseDown={handleMouseDown}
      >
        {/* Thanh tiến trình */}
        <div
          className="absolute h-full bg-blue-400 rounded-l"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        
        {/* Các marker phụ đề */}
        {subtitles.map((subtitle) => (
          <div
            key={subtitle.id}
            className={`absolute h-6 top-1 rounded ${
              selectedSubtitleId === subtitle.id ? "bg-green-400" : "bg-amber-400"
            }`}
            style={{
              left: `${(subtitle.startTime / duration) * 100}%`,
              width: `${((subtitle.endTime - subtitle.startTime) / duration) * 100}%`,
              opacity: 0.7,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSubtitleSelect(subtitle.id);
            }}
          />
        ))}
        
        {/* Marker vị trí hiện tại */}
        <div
          className="absolute w-1 h-full bg-red-400"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Timeline; 