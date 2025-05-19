import { useState, useEffect } from "react";
import { Subtitle } from "@/types";

interface SubtitleEditorProps {
  subtitle: Subtitle | null;
  currentTime: number;
  onUpdate: (subtitle: Subtitle) => void;
  onAdd: (subtitle: Subtitle) => void;
  onDelete: (id: string) => void;
}

const SubtitleEditor = ({
  subtitle,
  currentTime,
  onUpdate,
  onAdd,
  onDelete,
}: SubtitleEditorProps) => {
  const [text, setText] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(90);
  const [fontSize, setFontSize] = useState(24);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fontWeight, setFontWeight] = useState("normal");
  const [showBackground, setShowBackground] = useState(true);

  // Cập nhật form khi subtitle thay đổi
  useEffect(() => {
    if (subtitle) {
      setText(subtitle.text);
      setStartTime(subtitle.startTime);
      setEndTime(subtitle.endTime);
      setPosX(subtitle.position.x);
      setPosY(subtitle.position.y);
      setFontSize(subtitle.style.fontSize);
      setColor(subtitle.style.color);
      setBgColor(subtitle.style.backgroundColor);
      setFontWeight(subtitle.style.fontWeight);
      setShowBackground(subtitle.style.showBackground ?? true);
    } else {
      // Reset form khi không có subtitle được chọn
      setText("");
      setStartTime(currentTime);
      setEndTime(currentTime + 3);
      setPosX(50);
      setPosY(90);
      setFontSize(24);
      setColor("#000000");
      setBgColor("#ffffff");
      setFontWeight("normal");
      setShowBackground(true);
    }
  }, [subtitle, currentTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSubtitle: Subtitle = {
      id: subtitle?.id || `sub_${Date.now()}`,
      text,
      startTime,
      endTime,
      position: { x: posX, y: posY },
      style: {
        fontSize,
        color,
        backgroundColor: bgColor,
        fontWeight,
        showBackground
      },
    };

    if (subtitle) {
      onUpdate(updatedSubtitle);
    } else {
      onAdd(updatedSubtitle);
    }
  };

  const handleDelete = () => {
    if (subtitle) {
      onDelete(subtitle.id);
    }
  };

  const formatTimeForInput = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };

  const parseTimeInput = (timeStr: string) => {
    const [minsec, ms] = timeStr.split(".");
    const [mins, secs] = minsec.split(":");
    return parseInt(mins) * 60 + parseInt(secs) + parseInt(ms) / 1000;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-xl mb-4 text-blue-600">
        {subtitle ? "Chỉnh sửa phụ đề" : "Thêm phụ đề mới"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nội dung phụ đề</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Thời gian bắt đầu</label>
            <input
              type="text"
              value={formatTimeForInput(startTime)}
              onChange={(e) => setStartTime(parseTimeInput(e.target.value))}
              className="w-full p-2 border rounded"
              pattern="[0-9]{2}:[0-9]{2}.[0-9]{3}"
              placeholder="00:00.000"
            />
            <button
              type="button"
              onClick={() => setStartTime(currentTime)}
              className="mt-1 text-sm text-blue-500"
            >
              Đặt thời gian hiện tại
            </button>
          </div>
          
          <div>
            <label className="block mb-1">Thời gian kết thúc</label>
            <input
              type="text"
              value={formatTimeForInput(endTime)}
              onChange={(e) => setEndTime(parseTimeInput(e.target.value))}
              className="w-full p-2 border rounded"
              pattern="[0-9]{2}:[0-9]{2}.[0-9]{3}"
              placeholder="00:00.000"
            />
            <button
              type="button"
              onClick={() => setEndTime(currentTime)}
              className="mt-1 text-sm text-blue-500"
            >
              Đặt thời gian hiện tại
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Vị trí X (%)</label>
            <input
              type="number"
              value={posX}
              onChange={(e) => setPosX(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <label className="block mb-1">Vị trí Y (%)</label>
            <input
              type="number"
              value={posY}
              onChange={(e) => setPosY(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              max="100"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Cỡ chữ (px)</label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="8"
              max="72"
            />
          </div>
          
          <div>
            <label className="block mb-1">Độ đậm</label>
            <select
              value={fontWeight}
              onChange={(e) => setFontWeight(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="normal">Bình thường</option>
              <option value="bold">Đậm</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Màu chữ</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-1 border rounded h-10"
            />
          </div>
          
          <div>
            <label className="block mb-1">Màu nền</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full p-1 border rounded h-10"
                disabled={!showBackground}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-background"
            checked={showBackground}
            onChange={(e) => setShowBackground(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="show-background" className="text-sm font-medium text-gray-700">
            Hiển thị màu nền
          </label>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {subtitle ? "Cập nhật" : "Thêm phụ đề"}
          </button>
          
          {subtitle && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Xóa
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SubtitleEditor; 