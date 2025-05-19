import pyautogui
import time
import keyboard
from PIL import ImageGrab

def check_coordinates():
    print("Chương trình kiểm tra tọa độ đang chạy...")
    print("Di chuyển chuột đến vị trí cần kiểm tra")
    print("Nhấn 'q' để thoát")
    print("Nhấn 't' để chụp ảnh test vùng được chọn")
    
    last_x = last_y = None
    
    while True:
        try:
            # Lấy tọa độ chuột hiện tại
            x, y = pyautogui.position()
            # Lấy màu pixel tại vị trí chuột
            pixel_color = ImageGrab.grab().getpixel((x, y))
            
            # Chỉ in khi tọa độ thay đổi
            if (x, y) != (last_x, last_y):
                print(f'Tọa độ: X: {x}, Y: {y}, Màu RGB: {pixel_color}')
                last_x, last_y = x, y
            
            # Chụp ảnh test khi nhấn 't'
            if keyboard.is_pressed('t'):
                width = int(input("\nNhập chiều rộng vùng chụp: "))
                height = int(input("Nhập chiều cao vùng chụp: "))
                
                # Chụp màn hình với vùng đã chọn
                screenshot = pyautogui.screenshot(region=(x, y, width, height))
                screenshot.save(f'test_region_{x}_{y}_{width}x{height}.png')
                print(f"\nĐã lưu ảnh test_region_{x}_{y}_{width}x{height}.png")
                print("Tiếp tục kiểm tra tọa độ...\n")
                time.sleep(1)
            
            # Thoát khi nhấn 'q'
            if keyboard.is_pressed('q'):
                print("\nKết thúc kiểm tra tọa độ!")
                print(f"Tọa độ cuối cùng - X: {x}, Y: {y}")
                break
                
            time.sleep(0.1)  # Giảm tải CPU
            
        except KeyboardInterrupt:
            print("\nĐã dừng chương trình")
            break

if __name__ == "__main__":
    # Đợi 3 giây để người dùng chuẩn bị
    print("Chương trình sẽ bắt đầu sau 3 giây...")
    time.sleep(3)
    check_coordinates()

