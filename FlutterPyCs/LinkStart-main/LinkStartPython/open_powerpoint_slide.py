import win32com.client
import time
import os

def get_last_position():
    try:
        # Đọc vị trí với đường dẫn tuyệt đối
        script_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_dir, 'last_slide.txt')
        
        with open(file_path, 'r') as f:
            position = int(f.read().strip())
            print(f"Đọc được vị trí slide: {position}")
            return position
    except Exception as e:
        print(f"Lỗi khi đọc vị trí: {e}")
        return 1

def open_powerpoint_slide():
    try:
        # Thử kết nối với PowerPoint đang chạy
        ppt = win32com.client.GetActiveObject("PowerPoint.Application")
    except:
        # Nếu không có, tạo instance mới
        ppt = win32com.client.Dispatch("PowerPoint.Application")
        ppt.Visible = True
        time.sleep(0.5)
    
    # Lấy presentation đang active
    if ppt.Presentations.Count >= 1:
        presentation = ppt.ActivePresentation
        
        # Đọc vị trí đã lưu
        current_slide = get_last_position()
        print(f"Đang chuẩn bị mở slide {current_slide}")
        
        # Chạy slideshow từ slide hiện tại
        slideshow = presentation.SlideShowSettings.Run()
        slideshow.View.GotoSlide(current_slide)
    else:
        print("Không tìm thấy presentation nào đang mở")

if __name__ == "__main__":
    open_powerpoint_slide() 