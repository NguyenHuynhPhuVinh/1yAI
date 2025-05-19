import win32gui
import win32con
import time
import pyautogui
import sys
import keyboard

def bring_product_window_to_front():
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

def get_product_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'ma_sp': (int(left + width * 0.235), int(top + height * 0.198)),
        'ten_hang': (int(left + width * 0.406), int(top + height * 0.197)),
        'ten_sp': (int(left + width * 0.344), int(top + height * 0.263)),
        'mo_ta': (int(left + width * 0.346), int(top + height * 0.326)),
        'gia_ban': (int(left + width * 0.351), int(top + height * 0.388)),
        'ton_kho': (int(left + width * 0.346), int(top + height * 0.450)),
        'mau_sac': (int(left + width * 0.837), int(top + height * 0.201)),
        'dung_luong': (int(left + width * 0.840), int(top + height * 0.262)),
        'he_dieu_hanh': (int(left + width * 0.851), int(top + height * 0.330)),
        'kich_thuoc': (int(left + width * 0.846), int(top + height * 0.384)),
        'btn_them': (int(left + width * 0.752), int(top + height * 0.104)),
        'btn_sua': (int(left + width * 0.844), int(top + height * 0.104)),
        'btn_xoa': (int(left + width * 0.937), int(top + height * 0.104)),
        'btn_luu': (int(left + width * 0.844), int(top + height * 0.455)),
        'btn_huy': (int(left + width * 0.937), int(top + height * 0.455))
    }

def input_text(coordinates, text, is_combobox=False):
    pyautogui.click(coordinates)
    if is_combobox:
        # Đợi dropdown hiển thị
        time.sleep(0.3)
        # Tìm và click vào giá trị mong muốn
        keyboard.write(text)
        time.sleep(0.3)
        pyautogui.press('enter')
    else:
        pyautogui.hotkey('ctrl', 'a')
        pyautogui.press('delete')
        keyboard.write(str(text))
    time.sleep(0.3)

def them_san_pham(product_info):
    window_handle = bring_product_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_product_coordinates(window_handle)
    
    # Click nút thêm
    pyautogui.click(coords['btn_them'])
    time.sleep(0.5)
    
    # Nhập thông tin sản phẩm
    for field, value in product_info.items():
        if field in coords:
            if field == 'ten_hang':
                input_text(coords[field], value, is_combobox=True)
            else:
                input_text(coords[field], value)
    
    # Lưu sản phẩm
    pyautogui.click(coords['btn_luu'])
    time.sleep(0.5)
    
    # Thêm nhấn Enter để xác nhận thông báo thành công
    pyautogui.press('enter')
    return True

def get_first_row_position(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    # Sử dụng tỷ lệ tương đối giống như các nút khác
    grid_x = int(left + width * 0.028)  # Tương tự vị trí X của ma_sp
    grid_y = int(top + height * 0.588)   # Khoảng 35% chiều cao của cửa sổ
    
    return (grid_x, grid_y)

def sua_san_pham(product_info):
    window_handle = bring_product_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_product_coordinates(window_handle)
    
    # Click vào dòng trong DataGridView sử dụng vị trí tương đối
    first_row_pos = get_first_row_position(window_handle)
    pyautogui.click(first_row_pos[0], first_row_pos[1])
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_sua'])
    time.sleep(0.5)
    
    for field, value in product_info.items():
        if field in coords:
            if field == 'ten_hang':
                input_text(coords[field], value, is_combobox=True)
            else:
                input_text(coords[field], value)
    
    pyautogui.click(coords['btn_luu'])
    time.sleep(0.5)
    
    # Thêm nhấn Enter để xác nhận thông báo thành công
    pyautogui.press('enter')
    return True

def xoa_san_pham():
    window_handle = bring_product_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_product_coordinates(window_handle)
    
    # Click vào dòng trong DataGridView sử dụng vị trí tương đối
    first_row_pos = get_first_row_position(window_handle)
    pyautogui.click(first_row_pos[0], first_row_pos[1])
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_xoa'])
    time.sleep(0.5)
    
    pyautogui.press('enter')
    time.sleep(0.5)
    
    pyautogui.press('enter')
    return True

# Ví dụ sử dụng:
if __name__ == "__main__":
    product_info = {
        'ma_sp': '001',
        'ten_hang': 'Samsung',
        'ten_sp': 'Galaxy S23',
        'mo_ta': 'Điện thoại cao cấp',
        'gia_ban': '25000000',
        'ton_kho': '50',
        'mau_sac': 'Đen',
        'dung_luong': '256GB',
        'he_dieu_hanh': 'Android 13',
        'kich_thuoc': '6.1 inch'
    }
    
    action = sys.argv[1] if len(sys.argv) > 1 else '1'
    
    if action == '1':
        if them_san_pham(product_info):
            print("Thêm sản phẩm thành công!")
    elif action == '2':
        sua_san_pham(product_info)
        print("Sửa sản phẩm thành công!")
    elif action == '0':
        xoa_san_pham()
        print("Xóa sản phẩm thành công!")
