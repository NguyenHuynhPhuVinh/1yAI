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
            if "Tra Cứu Nhân Viên" in title:
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_search_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'ten_nhan_vien': (int(left + width * 0.356), int(top + height * 0.262)),
        'email': (int(left + width * 0.842), int(top + height * 0.265)), 
        'chuc_vu': (int(left + width * 0.836), int(top + height * 0.201)),
        'btn_hien_tat_ca': (int(left + width * 0.715), int(top + height * 0.378)),
        'btn_lam_moi': (int(left + width * 0.834), int(top + height * 0.384)),
        'btn_tim_kiem': (int(left + width * 0.927), int(top + height * 0.379))
    }

def tim_kiem_nhan_vien(search_type, search_text):
    window_handle = bring_search_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ tra cứu nhân viên!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_search_coordinates(window_handle)
    
    # Nhấn nút Hiện Tất Cả
    pyautogui.click(coords['btn_hien_tat_ca'])
    time.sleep(0.5)
    
    # Nhấn nút Làm Mới
    pyautogui.click(coords['btn_lam_moi']) 
    time.sleep(0.5)
    
    # Click vào ô tìm kiếm tương ứng và nhập text
    if search_type == '1':
        pyautogui.click(coords['ten_nhan_vien'])
    elif search_type == '2':
        pyautogui.click(coords['email'])
    elif search_type == '3':
        pyautogui.click(coords['chuc_vu'])
        
    time.sleep(0.5)
    keyboard.write(search_text)
    time.sleep(0.5)
    
    # Nhấn nút Tìm Kiếm
    pyautogui.click(coords['btn_tim_kiem'])
    return True

if __name__ == "__main__":
    # Định nghĩa sẵn thông tin tìm kiếm cho từng loại
    search_params = {
        '1': 'Nguyen Văn A',    # Tìm theo tên nhân viên
        '2': 'nva@gmail.com', # Tìm theo email
        '3': 'Nhân viên kho'           # Tìm theo chức vụ
    }
    
    search_type = sys.argv[1] if len(sys.argv) > 1 else '1'
    
    # Lấy text tìm kiếm tương ứng với loại tìm kiếm
    search_text = search_params[search_type]
    
    if tim_kiem_nhan_vien(search_type, search_text):
        print("Tìm kiếm thành công!") 