import pyautogui
import time

def check_mouse_position():
    print("Chương trình sẽ hiển thị tọa độ chuột mỗi giây.")
    print("Nhấn Ctrl+C để dừng chương trình.")
    print("\nĐang theo dõi tọa độ chuột...")
    
    try:
        while True:
            # Lấy tọa độ chuột hiện tại
            x, y = pyautogui.position()
            
            # Xóa dòng trước đó và in tọa độ mới
            print(f"Tọa độ chuột: X: {x}, Y: {y}", end='\r')
            
            # Đợi 1 giây trước khi cập nhật
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n\nĐã dừng chương trình.")

if __name__ == "__main__":
    check_mouse_position() 