import win32gui
import win32con
import time
import pyautogui
import keyboard

def bring_product_window_to_front():
    target_window = None
    
    def window_enum_handler(hwnd, result):
        nonlocal target_window
        if win32gui.IsWindowVisible(hwnd):
            class_name = win32gui.GetClassName(hwnd)
            if class_name == "WindowsForms10.Window.8.app.0.141b42a_r7_ad1":
                title = win32gui.GetWindowText(hwnd)
                if "Nhập Sản Phẩm" in title:
                    target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_product_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'first_product': (int(left + width * 0.040), int(top + height * 0.253)),
        'quantity_input': (int(left + width * 0.741), int(top + height * 0.488)),
        'btn_add': (int(left + width * 0.891), int(top + height * 0.488)),
        'btn_create': (int(left + width * 0.895), int(top + height * 0.906))
    }

def nhap_san_pham():
    window_handle = bring_product_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ nhập sản phẩm!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_product_coordinates(window_handle)
    
    # 1. Chọn sản phẩm đầu tiên trong danh sách
    pyautogui.click(coords['first_product'])
    time.sleep(0.5)
    
    # 2. Nhập số lượng (mặc định là 10)
    pyautogui.click(coords['quantity_input'])
    pyautogui.hotkey('ctrl', 'a')
    pyautogui.press('delete')
    keyboard.write('10')
    time.sleep(0.5)
    
    # 3. Nhấn nút thêm vào phiếu nhập
    pyautogui.click(coords['btn_add'])
    time.sleep(0.5)
    
    # 4. Nhấn nút tạo phiếu nhập
    pyautogui.click(coords['btn_create'])
    time.sleep(0.5)
    
    # Xác nhận thông báo thành công
    pyautogui.press('enter')
    return True

if __name__ == "__main__":
    if nhap_san_pham():
        print("Nhập sản phẩm thành công!") 