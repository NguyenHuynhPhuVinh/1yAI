from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from concurrent.futures import ThreadPoolExecutor, TimeoutError

class ZaloBot:
    def __init__(self):
        # Cấu hình cho Cốc Cốc
        coc_coc_options = webdriver.ChromeOptions()
        coc_coc_options.binary_location = "C:\\Program Files\\CocCoc\\Browser\\Application\\browser.exe"  # Thay đổi đường dẫn phù hợp
        
        # Thêm các tùy chọn nếu cần
        # coc_coc_options.add_argument('--start-maximized')
        # coc_coc_options.add_argument('--disable-notifications')
        
        self.driver = webdriver.Chrome(options=coc_coc_options)
        self.wait = WebDriverWait(self.driver, 10)
        # Thêm biến để lưu lịch sử chat
        self.chat_history = []
        self.ai_enabled = False  # Thêm biến để theo dõi trạng thái AI
        # Thêm biến lưu system message mặc định
        self.system_message = "Bạn là trợ lý AI trả lời tin nhắn Zalo. Hãy tuân thủ: 1. Trả lời trực tiếp, không hỏi lại 2. Dùng tiếng Việt có dấu 3. Không dùng 'Xin lỗi', 'Tôi không hiểu' 4. Trả lời dứt khoát và hữu ích 5. Không dùng emoji/ký tự đặc biệt 6. Trả lời như chat thông thường 7. Trả lời trong một đoạn văn ngắn gọn dưới 50 từ"
        # Thêm biến lưu model mặc định
        self.current_model = "google/gemma-2-9b-it:free"
        self.prefix_ai = False  # Thêm biến để kiểm soát việc thêm tiền tố @ai
        self.current_api = "openrouter"  # Thêm biến theo dõi API đang dùng
        self.gemini_api_key = "AIzaSyB_eNpMTroPTupXzl_oey08M0d-luxJ3OE"  # Thêm API key cho Gemini
    
    def login_zalo(self):
        self.driver.get("https://chat.zalo.me")
        # Đợi người dùng đăng nhập thủ công bằng QR code
        input("Vui lòng quét mã QR để đăng nhập và nhấn Enter để tiếp tục...")
    
    def get_latest_message(self):
        try:
            # Đợi và lấy tất cả tin nhắn (bao gồm cả tin nhắn của mình)
            message_elements = self.wait.until(
                EC.presence_of_all_elements_located((
                    By.CSS_SELECTOR, 
                    "div.chat-item span.text"  # Bỏ :not(.me) để lấy cả tin nhắn của mình
                ))
            )
            if message_elements:
                latest_message = message_elements[-1].text
                print(f"Tin nhắn mới nhất: {latest_message}")
                return latest_message
            return None
        except Exception as e:
            print(f"Lỗi khi đọc tin nhắn: {e}")
            return None

    def clean_message(self, message):
        try:
            import re
            # Nếu tin nhắn bắt đầu bằng @ai và prefix_ai được bật
            if self.prefix_ai and message.startswith("@ai"):
                # Tách phần @ai và phần còn lại
                prefix = "@ai "
                remaining = message[4:].strip()
                # Chỉ làm sạch phần còn lại
                cleaned_remaining = re.sub(r'[^\w\s.,!?()-]', '', remaining)
                # Ghép lại với prefix
                return prefix + cleaned_remaining.strip()
            else:
                # Xử lý bình thường cho các trường hợp khác
                cleaned = re.sub(r'[^\w\s.,!?()-]', '', message)
                return cleaned.strip()
        except Exception as e:
            print(f"Lỗi khi xử lý tin nhắn: {e}")
            return message

    def send_message(self, message):
        try:
            # Thêm tiền tố @ai nếu được bật
            if self.prefix_ai:
                message = "@ai " + message
            
            # Làm sạch tin nhắn trước khi gửi
            clean_msg = self.clean_message(message)
            
            # Tìm ô nhập tin nhắn và gửi
            input_box = self.wait.until(
                EC.presence_of_element_located((
                    By.CSS_SELECTOR, 
                    "#richInput"
                ))
            )
            input_box.send_keys(clean_msg)
            
            # Tìm nút gửi
            send_button = self.driver.find_element(
                By.CSS_SELECTOR, 
                "div[data-translate-title='STR_SEND']"
            )
            send_button.click()
        except Exception as e:
            print(f"Lỗi khi gửi tin nhắn: {e}")

    def process_messages(self):
        print("Bắt đầu theo dõi tin nhắn...")
        last_processed_message = None
        consecutive_errors = 0  # Đếm số lần lỗi liên tiếp
    
        while True:
            try:
                latest_message = self.get_latest_message()
                
                if latest_message and latest_message != last_processed_message:
                    print(f"Tin nhắn mới nhận được: {latest_message}")
                    
                    # Kiểm tra các lệnh @ai
                    if latest_message.lower().startswith("@ai"):
                        command = latest_message[4:].strip().lower()
                        
                        # Thêm xử lý lệnh prefix ai
                        if command == "ai":
                            self.prefix_ai = not self.prefix_ai  # Đảo ngược trạng thái
                            status = "bật" if self.prefix_ai else "tắt"
                            self.send_message(f"Đã {status} chế độ thêm @ai vào đầu câu trả lời")
                            consecutive_errors = 0
                            last_processed_message = latest_message
                            continue
                        elif command.startswith("sys "):
                            new_system_msg = latest_message[8:].strip()  # Lấy nội dung sau "@ai sys "
                            if new_system_msg:
                                self.system_message = new_system_msg
                                self.send_message(f"Đã cập nhật system message mới: {new_system_msg}")
                            else:
                                self.send_message("Vui lòng cung cấp nội dung system message")
                            consecutive_errors = 0
                            last_processed_message = latest_message
                            continue
                        elif command.startswith("m "):
                            new_model = latest_message[6:].strip()  # Lấy tên model sau "@ai m "
                            if new_model:
                                self.current_model = new_model
                                self.send_message(f"Đã chuyển sang sử dụng model: {new_model}")
                            else:
                                self.send_message("Vui lòng cung cấp tên model")
                            consecutive_errors = 0
                            last_processed_message = latest_message
                            continue
                        elif command == "on":
                            self.ai_enabled = True
                            self.send_message("AI đã được bật")
                            consecutive_errors = 0
                            last_processed_message = latest_message
                            continue
                        elif command == "off":
                            self.ai_enabled = False
                            self.send_message("AI đã được tắt")
                            consecutive_errors = 0
                            last_processed_message = latest_message
                            continue
                        elif command == "gemini":
                            self.current_api = "gemini"
                            self.send_message("Đã chuyển sang sử dụng Gemini API")
                            consecutive_errors = 0
                            last_processed_message = latest_message
                            continue
                        elif command == "openrouter":
                            self.current_api = "openrouter" 
                            self.send_message("Đã chuyển sang sử dụng OpenRouter API")
                            consecutive_errors = 0
                            last_processed_message = latest_message
                            continue
                        elif command:  # Nếu có nội dung sau @ai
                            print("Xử lý lệnh trực tiếp với AI...")
                            try:
                                with ThreadPoolExecutor() as executor:
                                    future = executor.submit(self.get_ai_response, command)
                                    try:
                                        ai_response = future.result(timeout=30)
                                        if ai_response:
                                            print(f"Phản hồi từ AI: {ai_response}")
                                            self.send_message(ai_response)
                                            print("Đã gửi phản hồi")
                                            consecutive_errors = 0
                                        else:
                                            raise Exception("Không nhận được phản hồi từ AI")
                                    except TimeoutError:
                                        raise Exception("AI phản hồi quá thời gian")
                            except Exception as ai_error:
                                print(f"Lỗi AI: {ai_error}")
                                consecutive_errors += 1
                                if consecutive_errors >= 3:
                                    self.ai_enabled = False
                                    self.send_message("AI đã tự động tắt do gặp lỗi liên tục. Vui lòng kiểm tra kết nối và bật lại bằng lệnh @ai on")
                                    consecutive_errors = 0
                            last_processed_message = latest_message
                            continue
                    
                    # Xử lý tin nhắn thông thường khi AI được bật
                    is_own_message = self.driver.find_elements(By.CSS_SELECTOR, "div.chat-item.me span.text")[-1].text == latest_message
                    if not is_own_message and self.ai_enabled:
                        print("Đang xử lý với AI...")
                        while True:  # Thêm vòng lặp vô hạn
                            try:
                                with ThreadPoolExecutor() as executor:
                                    future = executor.submit(self.get_ai_response, latest_message)
                                    try:
                                        ai_response = future.result(timeout=30)
                                        if ai_response:
                                            print(f"Phản hồi từ AI: {ai_response}")
                                            self.send_message(ai_response)
                                            print("Đã gửi phản hồi")
                                            consecutive_errors = 0
                                            break  # Thoát vòng lặp nếu thành công
                                        else:
                                            print("Không nhận được phản hồi từ AI, đợi 1 giây và thử lại...")
                                            time.sleep(1)
                                            continue  # Thử lại
                                    except TimeoutError:
                                        print("AI phản hồi quá thời gian, đợi 1 giây và thử lại...")
                                        time.sleep(1)
                                        continue  # Thử lại
                            except Exception as ai_error:
                                print(f"Lỗi AI: {ai_error}, đợi 1 giây và thử lại...")
                                time.sleep(1)
                                continue  # Thử lại
                    
                    last_processed_message = latest_message
                
                time.sleep(1)
                
            except Exception as e:
                print(f"Có lỗi xảy ra: {e}")
                consecutive_errors += 1
                if consecutive_errors >= 3:  # Nếu lỗi 3 lần liên tiếp
                    self.ai_enabled = False
                    try:
                        self.send_message("AI đã tự động tắt do gặp lỗi liên tục. Vui lòng kiểm tra kết nối và bật lại bằng lệnh @ai on")
                    except:
                        print("Không thể gửi thông báo lỗi")
                    consecutive_errors = 0
                time.sleep(1)
    
    def get_ai_response(self, message):
        if self.current_api == "gemini":
            return self.get_gemini_response(message)
        else:
            return self.get_openrouter_response(message)

    def get_openrouter_response(self, message):
        try:
            import requests
            import json
            import os

            # Lấy API key từ biến môi trường
            OPENROUTER_API_KEY = "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"
            
            # Chuẩn bị headers
            headers = {
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "",  # Thay thế bằng URL của bạn
                "X-Title": ""  # Tên ứng dụng của bạn
            }

            # Chuẩn bị messages từ lịch sử chat
            messages = []
            
            # Sử dụng system message từ biến instance
            messages.append({
                "role": "system",
                "content": self.system_message
            })
            
            # Thêm lịch sử chat
            for msg in self.chat_history[-3:]: # Chỉ lấy 3 tin nhắn gần nhất
                messages.append({
                    "role": msg["role"], 
                    "content": msg["content"]
                })

            # Thêm tin nhắn mới vào
            messages.append({
                "role": "user",
                "content": message
            })

            # Gọi API OpenRouter
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json={
                    "model": self.current_model,  # Sử dụng model được chọn
                    "messages": messages
                }
            )

            # Xử lý phản hồi
            if response.status_code == 200:
                result = response.json()
                ai_response = result['choices'][0]['message']['content']
                
                # Xử lý phản hồi để loại bỏ xuống dòng
                cleaned_response = ' '.join(ai_response.split())
                
                # Lưu vào lịch sử chat
                self.chat_history.append({
                    "role": "assistant",
                    "content": cleaned_response
                })
                
                return cleaned_response
            else:
                raise Exception(f"API error: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"Lỗi khi lấy phản hồi từ OpenRouter: {e}")
            return None

    def get_gemini_response(self, message):
        try:
            import google.generativeai as genai

            genai.configure(api_key=self.gemini_api_key)
            # Đổi sang model gemini-1.5-flash và thêm các tham số generation
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            generation_config = {
                "temperature": 0.9,
                "top_p": 1,
                "top_k": 1,
                "max_output_tokens": 2048,
            }
            
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_NONE",
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE",
                },
            ]

            # Chuẩn bị prompt
            prompt = f"{self.system_message}\n\nUser: {message}"
            
            response = model.generate_content(
                prompt,
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            # Kiểm tra và xử lý phản hồi
            if hasattr(response, 'text'):
                cleaned_response = ' '.join(response.text.split())
                self.chat_history.append({
                    "role": "assistant",
                    "content": cleaned_response
                })
                return cleaned_response
            elif hasattr(response, 'parts'):
                text = ' '.join([part.text for part in response.parts])
                cleaned_response = ' '.join(text.split())
                self.chat_history.append({
                    "role": "assistant",
                    "content": cleaned_response
                })
                return cleaned_response
            return None

        except Exception as e:
            print(f"Lỗi khi lấy phản hồi từ Gemini: {e}")
            return None

def main():
    bot = ZaloBot()
    bot.login_zalo()
    bot.process_messages()

if __name__ == "__main__":
    main()
