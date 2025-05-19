import win32gui
import win32con
import time
import pyautogui
import sys
import keyboard

def bring_search_window_to_front():
    target_window = None
    
    def window_enum_handler(hwnd, result):
        nonlocal target_window
        if win32gui.IsWindowVisible(hwnd):
            title = win32gui.GetWindowText(hwnd)
            if "Tra Cứu Tài Khoản" in title:  
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_search_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'ten_tai_khoan': (int(left + width * 0.353), int(top + height * 0.199)),
        'loai_tai_khoan': (int(left + width * 0.974), int(top + height * 0.263)),
        'btn_hien_tat_ca': (int(left + width * 0.715), int(top + height * 0.378)),
        'btn_lam_moi': (int(left + width * 0.834), int(top + height * 0.384)),
        'btn_tim_kiem': (int(left + width * 0.927), int(top + height * 0.379))
    }

def tim_kiem_tai_khoan(search_type, search_text):
    window_handle = bring_search_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ tra cứu tài khoản!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_search_coordinates(window_handle)
    
    pyautogui.click(coords['btn_hien_tat_ca'])
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_lam_moi']) 
    time.sleep(0.5)
    
    # Click vào ô tìm kiếm tương ứng
    if search_type == '1':
        pyautogui.click(coords['ten_tai_khoan'])
        keyboard.write(search_text)
    elif search_type == '2':
        # Xử lý đặc biệt cho combobox loại tài khoản
        pyautogui.click(coords['loai_tai_khoan'])
        time.sleep(0.3)  # Đợi combobox mở ra
        pyautogui.press('down')  # Nhấn mũi tên xuống
        time.sleep(0.3)
        pyautogui.press('enter')
        
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_tim_kiem'])
    return True

if __name__ == "__main__":
    # Định nghĩa thông tin tìm kiếm mẫu
    search_params = {
        '1': 'user',      # Tìm theo tên tài khoản
        '2': ''         # Tìm theo loại tài khoản
    }
    
    search_type = sys.argv[1] if len(sys.argv) > 1 else '1'
    search_text = search_params[search_type]
    
    if tim_kiem_tai_khoan(search_type, search_text):
        print("Tìm kiếm thành công!") 