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
            if "Tra Cứu Khách Hàng" in title:  # Thay đổi tên cửa sổ
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_search_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'ten_khach_hang': (int(left + width * 0.356), int(top + height * 0.262)),
        'email': (int(left + width * 0.840), int(top + height * 0.202)), 
        'so_dien_thoai': (int(left + width * 0.354), int(top + height * 0.388)),  # Thay chức vụ bằng số điện thoại
        'btn_hien_tat_ca': (int(left + width * 0.715), int(top + height * 0.378)),
        'btn_lam_moi': (int(left + width * 0.834), int(top + height * 0.384)),
        'btn_tim_kiem': (int(left + width * 0.927), int(top + height * 0.379))
    }

def tim_kiem_khach_hang(search_type, search_text):
    window_handle = bring_search_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ tra cứu khách hàng!")
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
        pyautogui.click(coords['ten_khach_hang'])
    elif search_type == '2':
        pyautogui.click(coords['email'])
    elif search_type == '3':
        pyautogui.click(coords['so_dien_thoai'])
        
    time.sleep(0.5)
    keyboard.write(search_text)
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_tim_kiem'])
    return True

if __name__ == "__main__":
    # Định nghĩa thông tin tìm kiếm mẫu
    search_params = {
        '1': 'Đinh Văn F',      # Tìm theo tên khách hàng
        '2': 'nte@gmail.com',   # Tìm theo email
        '3': '0978901234'       # Tìm theo số điện thoại
    }
    
    search_type = sys.argv[1] if len(sys.argv) > 1 else '1'
    search_text = search_params[search_type]
    
    if tim_kiem_khach_hang(search_type, search_text):
        print("Tìm kiếm thành công!") 