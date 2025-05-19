from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError

class FacebookBot:
    def __init__(self):
        # Cấu hình cho Chrome/CocCoc
        options = webdriver.ChromeOptions()
        # options.binary_location = "Đường dẫn tới trình duyệt của bạn"
        
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        self.chat_history = []
        self.ai_enabled = False

    def login_facebook(self):
        self.driver.get("https://www.facebook.com/messages")
        # Đợi người dùng đăng nhập thủ công
        input("Vui lòng đăng nhập Facebook và nhấn Enter để tiếp tục...")

    def get_latest_message(self):
        try:
            # Đợi và lấy tin nhắn mới nhất trong Messenger
            message_elements = self.wait.until(
                EC.presence_of_all_elements_located((
                    By.CSS_SELECTOR,
                    "div[dir='auto'][class*='xexx8yu x4uap5 x18d9i69 xkhd6sd x1gslohp x11i5rnm x12nagc x1mh8g0r x1yc453h x126k92a x18lvrbx']"
                ))
            )
            if message_elements:
                latest_message = message_elements[-1].text
                return latest_message
            return None
        except Exception as e:
            print(f"Lỗi khi đọc tin nhắn: {e}")
            return None

    def send_message(self, message):
        try:
            # Tìm ô nhập tin nhắn
            input_box = self.wait.until(
                EC.presence_of_element_located((
                    By.CSS_SELECTOR,
                    "div[role='textbox'][contenteditable='true']"  # Selector có thể cần điều chỉnh
                ))
            )
            input_box.send_keys(message)
            
            # Nhấn Enter để gửi
            from selenium.webdriver.common.keys import Keys
            input_box.send_keys(Keys.RETURN)
        except Exception as e:
            print(f"Lỗi khi gửi tin nhắn: {e}")

    def get_ai_response(self, message):
        # Giữ nguyên phần xử lý AI như trong ZaloBot
        # Copy phần get_ai_response từ code Zalo của bạn
        pass

    def process_messages(self):
        print("Bắt đầu theo dõi tin nhắn...")
        last_processed_message = None
        consecutive_errors = 0

        while True:
            try:
                latest_message = self.get_latest_message()
                
                if latest_message and latest_message != last_processed_message:
                    # Xử lý lệnh @ai giống như ZaloBot
                    if latest_message.lower().startswith("@ai"):
                        command = latest_message[4:].strip().lower()
                        
                        if command == "on":
                            self.ai_enabled = True
                            self.send_message("AI đã được bật")
                        elif command == "off":
                            self.ai_enabled = False
                            self.send_message("AI đã được tắt")
                        elif command:
                            # Xử lý lệnh AI trực tiếp
                            self.handle_ai_command(command)
                    
                    # Xử lý tin nhắn thông thường
                    elif self.ai_enabled:
                        self.handle_normal_message(latest_message)
                    
                    last_processed_message = latest_message
                
                time.sleep(1)
                
            except Exception as e:
                print(f"Lỗi: {e}")
                time.sleep(1)

def main():
    bot = FacebookBot()
    bot.login_facebook()
    bot.process_messages()

if __name__ == "__main__":
    main()

