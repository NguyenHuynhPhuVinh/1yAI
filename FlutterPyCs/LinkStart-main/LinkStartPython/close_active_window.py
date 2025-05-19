import time
import win32gui
import win32con

def close_active_window():
    # Tạo list để lưu các cửa sổ phù hợp
    windows = []
    
    # Hàm callback để kiểm tra từng cửa sổ
    def enum_handler(hwnd, windows):
        if win32gui.IsWindowVisible(hwnd):
            class_name = win32gui.GetClassName(hwnd)
            window_text = win32gui.GetWindowText(hwnd)
            if "WindowsForms10" in class_name and "LinkStart" not in window_text:
                windows.append(hwnd)
    
    # Liệt kê tất cả các cửa sổ
    win32gui.EnumWindows(enum_handler, windows)
    
    # Đóng tất cả các cửa sổ phù hợp
    success = False
    for hwnd in windows:
        try:
            win32gui.PostMessage(hwnd, win32con.WM_CLOSE, 0, 0)
            success = True
        except:
            continue
    
    return success

if __name__ == "__main__":
    if close_active_window():
        print("Đã đóng cửa sổ thành công!")
    else:
        print("Không thể đóng cửa sổ!") 