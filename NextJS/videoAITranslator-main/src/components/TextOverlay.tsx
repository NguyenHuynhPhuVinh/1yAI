import { Subtitle } from "@/types";

interface TextOverlayProps {
  subtitle: Subtitle;
}

const TextOverlay = ({ subtitle }: TextOverlayProps) => {
  // Debug info
  console.log("Rendering TextOverlay:", subtitle);

  if (!subtitle) return null;
  
  const { text, position, style } = subtitle;

  // Sử dụng giá trị mặc định nếu position hoặc style không tồn tại
  const defaultPosition = { x: 50, y: 90 };
  const defaultStyle = { 
    fontSize: 24, 
    color: "#000000", 
    backgroundColor: "rgba(255, 255, 255, 0.7)", 
    fontWeight: "normal",
    showBackground: true
  };

  const posX = position?.x ?? defaultPosition.x;
  const posY = position?.y ?? defaultPosition.y;
  const fontSize = style?.fontSize ?? defaultStyle.fontSize;
  const color = style?.color ?? defaultStyle.color;
  const bgColor = style?.backgroundColor ?? defaultStyle.backgroundColor;
  const fontWeight = style?.fontWeight ?? defaultStyle.fontWeight;
  const showBackground = style?.showBackground ?? defaultStyle.showBackground;

  return (
    <div
      className="absolute z-10 px-3 py-1 rounded"
      style={{
        left: `${posX}%`,
        top: `${posY}%`,
        transform: "translate(-50%, -50%)",
        fontSize: `${fontSize}px`,
        color: color,
        backgroundColor: showBackground ? bgColor : "transparent",
        fontWeight: fontWeight,
        maxWidth: "80%",
        textAlign: "center",
        whiteSpace: "normal",
        overflowWrap: "break-word",
        wordBreak: "normal",
        textShadow: showBackground ? "none" : "1px 1px 2px rgba(0,0,0,0.8)",
        boxShadow: showBackground ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
      }}
    >
      {text}
    </div>
  );
};

export default TextOverlay; 