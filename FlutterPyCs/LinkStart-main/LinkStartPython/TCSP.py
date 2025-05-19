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
            if "Tra Cứu Sản Phẩm" in title:
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_search_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'ten_hang': (int(left + width * 0.342), int(top + height * 0.263)),
        'mau_sac': (int(left + width * 0.830), int(top + height * 0.201)), 
        'dung_luong': (int(left + width * 0.822), int(top + height * 0.265)),
        'btn_hien_tat_ca': (int(left + width * 0.714), int(top + height * 0.452)),
        'btn_lam_moi': (int(left + width * 0.829), int(top + height * 0.454)),
        'btn_tim_kiem': (int(left + width * 0.929), int(top + height * 0.457))
    }

def tim_kiem_san_pham(search_type, search_text):
    window_handle = bring_search_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ tra cứu sản phẩm!")
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
        pyautogui.click(coords['ten_hang'])
    elif search_type == '2':
        pyautogui.click(coords['mau_sac'])
    elif search_type == '3':
        pyautogui.click(coords['dung_luong'])
        
    time.sleep(0.5)
    keyboard.write(search_text)
    time.sleep(0.5)
    
    # Nhấn nút Tìm Kiếm
    pyautogui.click(coords['btn_tim_kiem'])
    return True

if __name__ == "__main__":
    # Định nghĩa sẵn thông tin tìm kiếm cho từng loại
    search_params = {
        '1': 'iPhone 14',    # Tìm theo tên
        '2': 'Đen',         # Tìm theo màu sắc
        '3': '256GB'        # Tìm theo dung lượng
    }
    
    search_type = sys.argv[1] if len(sys.argv) > 1 else '1'
    
    # Lấy text tìm kiếm tương ứng với loại tìm kiếm
    search_text = search_params[search_type]
    
    if tim_kiem_san_pham(search_type, search_text):
        print("Tìm kiếm thành công!") 