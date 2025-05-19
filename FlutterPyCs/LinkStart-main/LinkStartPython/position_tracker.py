import win32gui
import pyautogui
import time

def bring_app_to_front():
    target_window = None
    
    def window_enum_handler(hwnd, result):
        nonlocal target_window
        if win32gui.IsWindowVisible(hwnd):
            class_name = win32gui.GetClassName(hwnd)
            if class_name == "WindowsForms10.Window.8.app.0.141b42a_r7_ad1":
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def track_relative_position():
    window_handle = bring_app_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return
        
    print("Di chuyển chuột trong cửa sổ để xem tọa độ tương đối (Nhấn Ctrl-C để dừng)")
    try:
        while True:
            # Lấy tọa độ cửa sổ
            left, top, right, bottom = win32gui.GetWindowRect(window_handle)
            window_width = right - left
            window_height = bottom - top
            
            # Lấy vị trí chuột hiện tại
            mouse_x, mouse_y = pyautogui.position()
            
            # Tính toán vị trí tương đối
            if left <= mouse_x <= right and top <= mouse_y <= bottom:
                rel_x = (mouse_x - left) / window_width
                rel_y = (mouse_y - top) / window_height
                
                position_str = (
                    f"Tọa độ tuyệt đối: X: {str(mouse_x).ljust(4)} Y: {str(mouse_y).ljust(4)} | "
                    f"Tọa độ tương đối: {rel_x:.3f}, {rel_y:.3f}"
                )
                print(position_str, end='\r')
            time.sleep(0.1)
            
    except KeyboardInterrupt:
        print("\nHoàn thành!")
        return

if __name__ == "__main__":
    track_relative_position() 