import win32gui
import win32con
import time
import pyautogui
import sys
import keyboard

def bring_account_window_to_front():
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

def get_account_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'ten_tk': (int(left + width * 0.231), int(top + height * 0.205)),
        'mat_khau': (int(left + width * 0.833), int(top + height * 0.205)),
        'ma_kh': (int(left + width * 0.317), int(top + height * 0.270)),
        'loai_tk': (int(left + width * 0.791), int(top + height * 0.274)),
        'ma_nv': (int(left + width * 0.356), int(top + height * 0.336)),
        'btn_them': (int(left + width * 0.728), int(top + height * 0.104)),
        'btn_sua': (int(left + width * 0.829), int(top + height * 0.111)),
        'btn_xoa': (int(left + width * 0.937), int(top + height * 0.104)),
        'btn_luu': (int(left + width * 0.829), int(top + height * 0.345)),
        'btn_huy': (int(left + width * 0.937), int(top + height * 0.345))
    }

def input_text(coordinates, text):
    pyautogui.click(coordinates)
    pyautogui.hotkey('ctrl', 'a')
    pyautogui.press('delete')
    keyboard.write(str(text))
    time.sleep(0.3)

def them_tai_khoan(account_info):
    window_handle = bring_account_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_account_coordinates(window_handle)
    
    pyautogui.click(coords['btn_them'])
    time.sleep(0.5)
    
    for field, value in account_info.items():
        if field in coords:
            input_text(coords[field], value)
    
    pyautogui.click(coords['btn_luu'])
    time.sleep(0.5)
    pyautogui.press('enter')
    return True

def get_first_row_position(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    grid_x = int(left + width * 0.030)
    grid_y = int(top + height * 0.474)
    
    return (grid_x, grid_y)

def sua_tai_khoan(account_info):
    window_handle = bring_account_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_account_coordinates(window_handle)
    
    first_row_pos = get_first_row_position(window_handle)
    pyautogui.click(first_row_pos[0], first_row_pos[1])
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_sua'])
    time.sleep(0.5)
    
    for field, value in account_info.items():
        if field in coords:
            input_text(coords[field], value)
    
    pyautogui.click(coords['btn_luu'])
    time.sleep(0.5)
    pyautogui.press('enter')
    return True

def xoa_tai_khoan():
    window_handle = bring_account_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_account_coordinates(window_handle)
    
    first_row_pos = get_first_row_position(window_handle)
    pyautogui.click(first_row_pos[0], first_row_pos[1])
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_xoa'])
    time.sleep(0.5)
    
    pyautogui.press('enter')
    time.sleep(0.5)
    pyautogui.press('enter')
    return True

if __name__ == "__main__":
    account_info = {
        'ten_tk': '@user',
        'mat_khau': '123456',
        'ma_kh': 'KH001',
        'ma_nv': 'NV001',
        'loai_tk': 'user'
    }
    
    action = sys.argv[1] if len(sys.argv) > 1 else '1'
    
    if action == '1':
        if them_tai_khoan(account_info):
            print("Thêm tài khoản thành công!")
    elif action == '2':
        sua_tai_khoan(account_info)
        print("Sửa tài khoản thành công!")
    elif action == '0':
        xoa_tai_khoan()
        print("Xóa tài khoản thành công!") 