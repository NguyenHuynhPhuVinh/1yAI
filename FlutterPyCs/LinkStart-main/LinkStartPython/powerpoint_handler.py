import win32com.client
import time
import pyautogui
import os
import win32gui

def save_position(slide_number):
    try:
        # Lưu vị trí với đường dẫn tuyệt đối
        script_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_dir, 'last_slide.txt')
        
        with open(file_path, 'w') as f:
            f.write(str(slide_number))
        print(f"Đã lưu vị trí slide: {slide_number}")
    except Exception as e:
        print(f"Lỗi khi lưu vị trí: {e}")

def close_powerpoint_slide():
    try:
        # Kết nối với PowerPoint đang chạy
        ppt = win32com.client.GetActiveObject("PowerPoint.Application")
        
        time.sleep(0.1)
        
        # Kiểm tra xem có presentation đang chạy không
        if ppt.SlideShowWindows.Count >= 1:
            # Lưu vị trí slide hiện tại trước khi thoát
            current_slide = ppt.SlideShowWindows(1).View.Slide.SlideIndex
            save_position(current_slide)
            
            # Thoát khỏi chế độ trình chiếu
            ppt.SlideShowWindows(1).View.Exit()
            time.sleep(0.5)
            
            # Thay thế click chuột bằng việc kích hoạt cửa sổ WindowsForms10
            def window_enum_handler(hwnd, windows):
                if win32gui.IsWindowVisible(hwnd):
                    class_name = win32gui.GetClassName(hwnd)
                    window_text = win32gui.GetWindowText(hwnd)
                    if "WindowsForms10" in class_name and "LinkStart" not in window_text:
                        windows.append(hwnd)
            
            windows = []
            win32gui.EnumWindows(window_enum_handler, windows)
            
            if windows:  # Nếu tìm thấy cửa sổ phù hợp
                win32gui.SetForegroundWindow(windows[0])
            time.sleep(2)
    except Exception as e:
        print(f"Lỗi khi đóng PowerPoint: {e}")

if __name__ == "__main__":
    close_powerpoint_slide()