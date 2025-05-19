import win32gui
import win32con

def list_windows():
    windows_list = []
    
    def window_enum_handler(hwnd, result):
        if win32gui.IsWindowVisible(hwnd):
            window_text = win32gui.GetWindowText(hwnd)
            class_name = win32gui.GetClassName(hwnd)
            if class_name:  # Chỉ kiểm tra class, bỏ kiểm tra window_text
                rect = win32gui.GetWindowRect(hwnd)
                windows_list.append({
                    'handle': hwnd,
                    'title': window_text,  # Có thể là chuỗi rỗng
                    'class': class_name,
                    'position': rect
                })
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return windows_list

def main():
    print("=== DANH SÁCH CỬA SỔ ===")
    print("Đang quét các cửa sổ...\n")
    
    windows = list_windows()
    
    for idx, window in enumerate(windows, 1):
        print(f"Cửa sổ #{idx}")
        print(f"Tiêu đề: {window['title']}")
        print(f"Class: {window['class']}")
        print(f"Handle: {window['handle']}")
        print(f"Vị trí: {window['position']}")
        print("-" * 50)

if __name__ == "__main__":
    main() 