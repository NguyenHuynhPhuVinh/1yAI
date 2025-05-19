import win32gui
import win32con
import time
import pyautogui
import keyboard

def bring_calculator_window_to_front():
    target_window = None
    
    def window_enum_handler(hwnd, result):
        nonlocal target_window
        if win32gui.IsWindowVisible(hwnd):
            title = win32gui.GetWindowText(hwnd)
            if "Tính Toán" in title:
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'first_quantity': (int(left + width * 0.704), int(top + height * 0.286)),  # SP đầu tiên
        'second_quantity': (int(left + width * 0.716), int(top + height * 0.321)), # SP thứ hai
        'calculate_button': (int(left + width * 0.092), int(top + height * 0.594))  # Nút tính tổng tiền
    }

def tinh_toan():
    window_handle = bring_calculator_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ Tính Toán!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_coordinates(window_handle)
    
    # Chọn số lượng SP1
    pyautogui.click(coords['first_quantity'])
    time.sleep(0.5)
    pyautogui.doubleClick(coords['first_quantity'])
    keyboard.write('1')
    time.sleep(0.5)
    
    # Chọn số lượng SP2
    pyautogui.click(coords['second_quantity'])
    time.sleep(0.5)
    pyautogui.doubleClick(coords['second_quantity'])
    keyboard.write('1')
    time.sleep(0.5)
    
    # Nhấn nút tính tổng tiền
    pyautogui.click(coords['calculate_button'])
    return True

if __name__ == "__main__":
    if tinh_toan():
        print("Đã tính toán xong!") 