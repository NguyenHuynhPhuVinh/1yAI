import os
from login_automation import perform_login
from admin_handler import handle_admin_actions
from position_tracker import track_relative_position
from mouse_position_checker import check_mouse_position
from powerpoint_handler import close_powerpoint_slide

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def show_menu():
    clear_screen()
    print("=== MENU CHƯƠNG TRÌNH ===")
    print("1. Kiểm tra tọa độ chuột")
    print("2. Theo dõi tọa độ tương đối") 
    print("3. Tự động đăng nhập")
    print("4. Đóng PowerPoint và click")
    print("5. Xử lý form quản trị")
    print("0. Thoát")
    print("=======================")

def main():
    while True:
        show_menu()
        choice = input("Vui lòng chọn chức năng (0-5): ")
        
        if choice == "1":
            check_mouse_position()
        elif choice == "2":
            track_relative_position()
        elif choice == "3":
            perform_login()
        elif choice == "4":
            close_powerpoint_slide()
        elif choice == "5":
            if handle_admin_actions():
                print("Xử lý form quản trị thành công")
            else:
                print("Có lỗi khi xử lý form quản trị")
        elif choice == "0":
            print("Cảm ơn bạn đã sử dụng chương trình!")
            break
        else:
            print("Lựa chọn không hợp lệ. Vui lòng thử lại!")
        
        input("\nNhấn Enter để tiếp tục...")

if __name__ == "__main__":
    main()