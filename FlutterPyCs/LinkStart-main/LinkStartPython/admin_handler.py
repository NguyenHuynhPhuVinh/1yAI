import win32gui
import win32con
import pyautogui
import time
import sys

def find_admin_window():
    target_window = None
    
    def window_enum_handler(hwnd, result):
        nonlocal target_window
        if win32gui.IsWindowVisible(hwnd):
            class_name = win32gui.GetClassName(hwnd)
            window_text = win32gui.GetWindowText(hwnd)
            if (class_name == "WindowsForms10.Window.8.app.0.141b42a_r7_ad1" and 
                window_text == "Quản Trị"):
                target_window = hwnd
        return True
    
    win32gui.EnumWindows(window_enum_handler, None)
    return target_window

def get_admin_coordinates(hwnd, action_type='quanly'):
    left, top, right, bottom = win32gui.GetWindowRect(hwnd)
    window_width = right - left
    window_height = bottom - top
    
    base_coordinates = {
        'menu_quanly': (left + (window_width * 0.054), top + (window_height * 0.079)),
        'menu_tracuu': (left + (window_width * 0.132), top + (window_height * 0.081)),
        'menu_tinhtoan': (left + (window_width * 0.216), top + (window_height * 0.076)),
        'menu_thongke': (left + (window_width * 0.310), top + (window_height * 0.076)),
        'menu_baobieu': (left + (window_width * 0.399), top + (window_height * 0.076)),
        'menu_laphoadon': (left + (window_width * 0.497), top + (window_height * 0.076)),
        'menu_nhapsanpham': (left + (window_width * 0.622), top + (window_height * 0.076))
    }
    
    if action_type in ['quanly', 'tracuu']:
        if action_type == 'quanly':
            base_coordinates.update({
                'menu_sanpham': (left + (window_width * 0.092), top + (window_height * 0.129)),
                'menu_nhanvien': (left + (window_width * 0.095), top + (window_height * 0.169)),
                'menu_khachhang': (left + (window_width * 0.097), top + (window_height * 0.211)),
                'menu_taikhoan': (left + (window_width * 0.093), top + (window_height * 0.254)),
                'menu_nhacungcap': (left + (window_width * 0.098), top + (window_height * 0.299))
            })
        else:  # tracuu
            base_coordinates.update({
                'menu_sanpham': (left + (window_width * 0.176), top + (window_height * 0.129)),
                'menu_nhanvien': (left + (window_width * 0.176), top + (window_height * 0.169)),
                'menu_khachhang': (left + (window_width * 0.176), top + (window_height * 0.211)),
                'menu_taikhoan': (left + (window_width * 0.176), top + (window_height * 0.254))
            })
    
    return {k: (int(x), int(y)) for k, (x, y) in base_coordinates.items()}

def handle_admin_actions(action_type='quanly', menu_type=None):
    admin_window = find_admin_window()
    if not admin_window:
        print("Không tìm thấy cửa sổ Quản Trị!")
        return False
        
    # Kích hoạt cửa sổ
    win32gui.ShowWindow(admin_window, win32con.SW_RESTORE)
    time.sleep(0.5)
    win32gui.SetForegroundWindow(admin_window)
    time.sleep(0.5)
    
    coordinates = get_admin_coordinates(admin_window, action_type)
    
    try:
        # Với các action đặc biệt, chỉ cần click một lần
        if action_type in ['tinhtoan', 'thongke', 'baobieu', 'laphoadon', 'nhapsanpham']:
            menu_key = f'menu_{action_type}'
            if menu_key in coordinates:
                pyautogui.click(coordinates[menu_key])
                time.sleep(0.5)
        else:
            # Xử lý cho quanly và tracuu như cũ
            menu_key = f'menu_{action_type}'
            if menu_key in coordinates:
                pyautogui.click(coordinates[menu_key])
                time.sleep(0.5)
            
            if menu_type:
                submenu_key = f'menu_{menu_type}'
                if submenu_key in coordinates:
                    pyautogui.click(coordinates[submenu_key])
                    time.sleep(0.5)
        
        return True
        
    except Exception as e:
        print(f"Lỗi khi xử lý form quản trị: {str(e)}")
        return False

if __name__ == "__main__":
    # Mặc định là quản lý sản phẩm
    action_type = 'quanly'
    menu_type = 'sanpham'
    
    # Xử lý tham số dòng lệnh
    if len(sys.argv) > 1:
        action_type = sys.argv[1]
    if len(sys.argv) > 2:
        menu_type = sys.argv[2]
    
    # Kiểm tra tham số hợp lệ
    valid_actions = ['quanly', 'tracuu', 'tinhtoan', 'thongke', 'baobieu', 'laphoadon', 'nhapsanpham']
    
    if action_type not in valid_actions:
        print(f"Tham số action không hợp lệ. Sử dụng một trong các giá trị: {', '.join(valid_actions)}")
        sys.exit(1)
    
    # Chỉ kiểm tra menu_type nếu action là quanly hoặc tracuu
    if action_type in ['quanly', 'tracuu']:
        valid_menus = ['sanpham', 'nhanvien', 'khachhang', 'taikhoan']
        if action_type == 'quanly':
            valid_menus.append('nhacungcap')
            
        if menu_type not in valid_menus:
            print(f"Tham số menu không hợp lệ. Sử dụng một trong các giá trị: {', '.join(valid_menus)}")
            sys.exit(1)
    else:
        menu_type = None
    
    if handle_admin_actions(action_type, menu_type):
        if menu_type:
            print(f"Xử lý form quản trị thành công với {action_type} {menu_type}")
        else:
            print(f"Xử lý form quản trị thành công với {action_type}")
    else:
        print("Có lỗi khi xử lý form quản trị") 