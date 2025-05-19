import win32gui
import win32con
import time
import pyautogui
import sys
import keyboard

def bring_employee_window_to_front():
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

def get_employee_coordinates(hwnd):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    width = right - left
    height = bottom - top
    
    return {
        'ma_nv': (int(left + width * 0.235), int(top + height * 0.198)),
        'ten_tk': (int(left + width * 0.455), int(top + height * 0.201)),
        'ten_nv': (int(left + width * 0.344), int(top + height * 0.263)),
        'dia_chi': (int(left + width * 0.346), int(top + height * 0.326)),
        'sdt': (int(left + width * 0.351), int(top + height * 0.388)),
        'email': (int(left + width * 0.794), int(top + height * 0.205)),
        'chuc_vu': (int(left + width * 0.794), int(top + height * 0.269)),
        'btn_them': (int(left + width * 0.728), int(top + height * 0.104)),
        'btn_sua': (int(left + width * 0.829), int(top + height * 0.111)),
        'btn_xoa': (int(left + width * 0.937), int(top + height * 0.104)),
        'btn_luu': (int(left + width * 0.832), int(top + height * 0.404)),
        'btn_huy': (int(left + width * 0.937), int(top + height * 0.409))
    }

def input_text(coordinates, text, is_combobox=False):
    pyautogui.click(coordinates)
    if is_combobox:
        time.sleep(0.3)
        keyboard.write(text)
        time.sleep(0.3)
        pyautogui.press('enter')
    else:
        pyautogui.hotkey('ctrl', 'a')
        pyautogui.press('delete')
        keyboard.write(str(text))
    time.sleep(0.3)

def them_nhan_vien(employee_info):
    window_handle = bring_employee_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_employee_coordinates(window_handle)
    
    pyautogui.click(coords['btn_them'])
    time.sleep(0.5)
    
    for field, value in employee_info.items():
        if field in coords:
            if field == 'chuc_vu':
                input_text(coords[field], value)
            else:
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
    grid_y = int(top + height * 0.539)
    
    return (grid_x, grid_y)

def sua_nhan_vien(employee_info):
    window_handle = bring_employee_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_employee_coordinates(window_handle)
    
    first_row_pos = get_first_row_position(window_handle)
    pyautogui.click(first_row_pos[0], first_row_pos[1])
    time.sleep(0.5)
    
    pyautogui.click(coords['btn_sua'])
    time.sleep(0.5)
    
    for field, value in employee_info.items():
        if field in coords:
            if field == 'chuc_vu':
                input_text(coords[field], value)
            else:
                input_text(coords[field], value)
    
    pyautogui.click(coords['btn_luu'])
    time.sleep(0.5)
    pyautogui.press('enter')
    return True

def xoa_nhan_vien():
    window_handle = bring_employee_window_to_front()
    if not window_handle:
        print("Không tìm thấy cửa sổ ứng dụng!")
        return False
        
    win32gui.ShowWindow(window_handle, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(window_handle)
    time.sleep(0.5)
    
    coords = get_employee_coordinates(window_handle)
    
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
    employee_info = {
        'ma_nv': '001',
        'ten_tk': 'admin',
        'ten_nv': 'Nguyễn Văn A',
        'dia_chi': 'Hà Nội',
        'sdt': '0987654321',
        'email': 'nva@gmail.com',
        'chuc_vu': 'Nhân viên bán hàng'
    }
    
    action = sys.argv[1] if len(sys.argv) > 1 else '1'
    
    if action == '1':
        if them_nhan_vien(employee_info):
            print("Thêm nhân viên thành công!")
    elif action == '2':
        sua_nhan_vien(employee_info)
        print("Sửa nhân viên thành công!")
    elif action == '0':
        xoa_nhan_vien()
        print("Xóa nhân viên thành công!") 