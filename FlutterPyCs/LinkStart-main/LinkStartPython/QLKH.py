import win32gui
import win32con
import time
import pyautogui
import sys
import keyboard

def bring_customer_window_to_front():
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

def get_customer_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'ma_kh': (int(left + width * 0.231), int(top + height * 0.205)),
        'ten_tk': (int(left + width * 0.477), int(top + height * 0.205)),
        'ten_kh': (int(left + width * 0.317), int(top + height * 0.270)),
        'dia_chi': (int(left + width * 0.791), int(top + height * 0.274)),
        'sdt': (int(left + width * 0.356), int(top + height * 0.336)),
        'email': (int(left + width * 0.802), int(top + height * 0.206)),
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

def them_khach_hang(customer_info):
    window_handle = bring_customer_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_customer_coordinates(window_handle)
    
    pyautogui.click(coords['btn_them'])
    time.sleep(0.5)
    
    for field, value in customer_info.items():
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

def sua_khach_hang(customer_info):
    window_handle = bring_customer_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_customer_coordinates(window_handle)
    
    first_row_pos = get_first_row_position(window_handle)
    pyautogui.click(first_row_pos[0], first_row_pos[1])
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_sua'])
    time.sleep(0.5)
    
    for field, value in customer_info.items():
        if field in coords:
            input_text(coords[field], value)
    
    pyautogui.click(coords['btn_luu'])
    time.sleep(0.5)
    pyautogui.press('enter')
    return True

def xoa_khach_hang():
    window_handle = bring_customer_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_customer_coordinates(window_handle)
    
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
    customer_info = {
        'ma_kh': '001',
        'ten_tk': 'user1',
        'ten_kh': 'Phạm Văn D',
        'dia_chi': 'Hà Nội',
        'sdt': '0978901234',
        'email': 'pvd@gmail.com'
    }
    
    action = sys.argv[1] if len(sys.argv) > 1 else '1'
    
    if action == '1':
        if them_khach_hang(customer_info):
            print("Thêm khách hàng thành công!")
    elif action == '2':
        sua_khach_hang(customer_info)
        print("Sửa khách hàng thành công!")
    elif action == '0':
        xoa_khach_hang()
        print("Xóa khách hàng thành công!") 