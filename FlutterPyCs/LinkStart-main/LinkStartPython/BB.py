import win32gui
import win32con
import time
import pyautogui
import keyboard
import os

def bring_window_to_front():
    target_window = None
    
    def window_enum_handler(hwnd, result):
        nonlocal target_window
        if win32gui.IsWindowVisible(hwnd):
            title = win32gui.GetWindowText(hwnd)
            if "Báo Biểu và In Ấn" in title:
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_button_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'btn_in': (int(left + width * 0.937), int(top + height * 0.191))  # Vị trí nút In
    }

def thuc_hien_thao_tac():
    window_handle = bring_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ Báo Biểu và In Ấn!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_button_coordinates(window_handle)
    
    # Click vào nút In
    pyautogui.click(coords['btn_in'])
    time.sleep(0.5)
    keyboard.press_and_release('enter')
    time.sleep(1.5)
    # Nhập chữ "test"
    keyboard.write('test')
    keyboard.press_and_release('enter')
    # Nhấn mũi tên trái
    keyboard.press_and_release('left')
    time.sleep(0.5)
    # Nhấn Enter
    keyboard.press_and_release('enter')
    
    # Chờ file được lưu
    time.sleep(2)
    # Mở file PDF
    os.startfile('test.pdf')

if __name__ == "__main__":
    thuc_hien_thao_tac()
    print("Đã hoàn thành!") 