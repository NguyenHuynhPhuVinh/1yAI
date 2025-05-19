import win32gui
import win32con
import time
import pyautogui
import sys

def bring_app_to_front():
    target_window = None
    
    def window_enum_handler(hwnd, result):
        nonlocal target_window
        if win32gui.IsWindowVisible(hwnd):
            class_name = win32gui.GetClassName(hwnd)
            if class_name == "WindowsForms10.Window.20008.app.0.141b42a_r7_ad1":
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_window_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    window_width = right - left
    window_height = bottom - top
    
    return {
        'username': (int(left + window_width * 0.487), int(top + window_height * 0.442)),
        'password': (int(left + window_width * 0.509), int(top + window_height * 0.571)),
        'login': (int(left + window_width * 0.471), int(top + window_height * 0.713))
    }

def perform_login(user_type='admin'):
    window_handle = bring_app_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coordinates = get_window_coordinates(window_handle)
    
    # Xác định thông tin đăng nhập dựa trên loại người dùng
    credentials = {
        'admin': {'username': 'admin', 'password': '123456'},
        'user': {'username': 'user1', 'password': '123456'}
    }
    
    login_info = credentials.get(user_type, credentials['admin'])
    
    pyautogui.click(coordinates['username'])
    pyautogui.hotkey('ctrl', 'a')
    pyautogui.press('delete')
    pyautogui.typewrite(login_info['username'])
    time.sleep(0.5)
    
    pyautogui.click(coordinates['password'])
    pyautogui.hotkey('ctrl', 'a')
    pyautogui.press('delete')
    pyautogui.typewrite(login_info['password'])
    time.sleep(0.5)
    
    pyautogui.click(coordinates['login'])
    return True

if __name__ == "__main__":
    # Lấy tham số từ command line, mặc định là 'admin' nếu không có tham số
    user_type = 'admin'
    if len(sys.argv) > 1:
        user_type = sys.argv[1]
    
    # Kiểm tra tham số hợp lệ
    if user_type not in ['admin', 'user']:
        print("Tham số không hợp lệ. Sử dụng 'admin' hoặc 'user'")
        sys.exit(1)
        
    if perform_login(user_type):
        print(f"Đăng nhập thành công với tài khoản {user_type}!")
    else:
        print("Đăng nhập thất bại!") 