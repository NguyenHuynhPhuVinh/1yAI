import uiautomation as auto
import time
import pyperclip
import pyautogui
import google.generativeai as genai
import re
import emoji
import traceback

last_message = ""

class ZaloChatBot:
    def __init__(self):
        # Thêm biến để lưu tin nhắn cuối từ AI
        genai.configure(api_key='AIzaSyB_eNpMTroPTupXzl_oey08M0d-luxJ3OE')
        self.model = genai.GenerativeModel('gemini-1.5-flash-002')
        self.last_user_message = None
        self.last_ai_response = None
        # Thêm list lưu lịch sử hội thoại
        self.conversation_history = []
        # Giới hạn số lượng tin nhắn lưu trong lịch sử
        self.max_history = 10

    def find_zalo_window(self):
        """Tìm cửa sổ Zalo"""
        try:
            # Thêm logging để debug
            print("Đang tìm cửa sổ Zalo...")
            chrome_windows = auto.PaneControl(ClassName="Chrome_WidgetWin_1")
            print(f"Số cửa sổ Chrome tìm thấy: {len(chrome_windows.GetChildren())}")
            
            for window in chrome_windows.GetChildren():
                try:
                    print(f"Tên cửa sổ: {window.Name}")
                    if "Zalo" in window.Name:
                        print("Đã tìm thấy cửa sổ Zalo!")
                        return window
                except Exception as e:
                    print(f"Lỗi khi kiểm tra cửa sổ: {e}")
                    continue
            print("Không tìm thấy cửa sổ Zalo")
            return None
        except Exception as e:
            print(f"Lỗi trong find_zalo_window: {e}")
            return None

    def clean_message(self, text):
        """Lọc bỏ emoji, heart và ký tự đặc biệt"""
        try:
            # Xóa emoji
            text = emoji.replace_emoji(text, '')
            
            # Xóa các ký tự heart phổ biến
            text = re.sub(r'[❤️💕💖💗💓💞💘💝🫶]', '', text)
            
            # Xóa từ 'heart' và các biến thể của nó
            text = re.sub(r'heart|HEART|Heart', '', text)
            
            # Xóa từ 'strong' và các biến thể của nó
            text = re.sub(r'strong|STRONG|Strong', '', text)
            
            # Xóa các ký tự markdown như */_~
            text = re.sub(r'[*/_~-]', '', text)
            
            # Xóa các thẻ HTML như <strong>
            text = re.sub(r'<[^>]+>', '', text)
            
            # Xóa nhiều khoảng trắng liên tiếp
            text = re.sub(r'\s+', ' ', text)
            
            # Cắt khoảng trắng đầu cuối
            text = text.strip()
            
            return text
        except Exception as e:
            print(f"Lỗi khi lọc tin nhắn: {e}")
            return text

    def get_latest_message(self, control, level=0, max_depth=20):
        """Lấy tin nhắn mới nhất từ người khác"""
        if level > max_depth:
            return None
            
        try:
            valid_messages = []
            messages_buffer = []  # Buffer để lưu tạm tin nhắn và sender
            
            def collect_messages(control):
                if control.Name and control.ControlTypeName == "TextControl":
                    text = control.Name.strip()
                    
                    print(f">>> Đang xử lý text: '{text}'")
                    
                    # Bỏ qua các text không cần thiết
                    if (text.isdigit() or 
                        text.startswith("Đang nhập") or 
                        text.startswith("Đã") or
                        text in [' ', 'Tin nhắn', 'Hình ảnh', 'File', 'Sticker']):
                        return
                    
                    # Nếu là một dòng có chứa dấu ":" (có thể là sender)
                    if ":" in text and not text.startswith("AI:"):
                        sender, content = text.split(":", 1)
                        sender = sender.strip()
                        content = content.strip()
                        print(f">>> Tìm thấy format sender: '{sender}' với nội dung: '{content}'")
                        messages_buffer.append({"sender": sender, "content": content})
                    else:
                        # Nếu là dòng text đơn thuần
                        print(f">>> Thêm vào buffer như content: '{text}'")
                        messages_buffer.append({"content": text})
                
                for child in control.GetChildren():
                    collect_messages(child)
            
            # Thu thập tất cả tin nhắn
            collect_messages(control)
            
            # Xử lý buffer để tìm tin nhắn hợp lệ
            print("\n>>> Processing buffer:", messages_buffer)
            
            for i, msg in enumerate(messages_buffer):
                if "@ai" in msg.get("content", "").lower():
                    sender = msg.get("sender")
                    # Nếu không có sender trong tin nhắn hiện tại, 
                    # tìm sender từ tin nhắn trước đó
                    if not sender:
                        for prev_msg in reversed(messages_buffer[:i]):
                            if "sender" in prev_msg:
                                sender = prev_msg["sender"]
                                break
                    
                    if sender:
                        content = msg["content"].replace("@ai", "", 1).strip()
                        valid_messages.append((sender, content))
                        print(f">>> Đã tìm thấy tin nhắn hợp lệ - Sender: {sender}, Content: {content}")
            
            print(f">>> Kết quả cuối cùng: {valid_messages}")
            return valid_messages if valid_messages else None
                
        except Exception as e:
            print(f"Lỗi khi đọc tin nhắn: {e}")
            traceback.print_exc()  # In ra stack trace đầy đủ
            return None

    def send_message(self, message):
        """Gửi tin nhắn"""
        try:
            # Thêm prefix "AI:" vào tin nhắn
            ai_message = f"AI: {message}"
            formatted_message = self.format_message(ai_message)
            pyperclip.copy(formatted_message)
            pyautogui.hotkey('ctrl', 'v')
            time.sleep(0.2)  # Giảm từ 0.5s xuống 0.2s
            pyautogui.press('enter')
            # Lưu lại response của AI
            self.last_ai_response = formatted_message
            print(f"Đã gửi: {formatted_message}")
        except Exception as e:
            print(f"Lỗi khi gửi tin nhắn: {e}")

    def format_message(self, message, max_chars_per_line=50):
        """Format tin nhắn với ngắt dòng tự động"""
        words = message.split()
        lines = []
        current_line = []
        current_length = 0
        
        for word in words:
            word_length = len(word)
            if current_length + word_length + 1 <= max_chars_per_line:
                current_line.append(word)
                current_length += word_length + 1
            else:
                lines.append(' '.join(current_line))
                current_line = [word]
                current_length = word_length
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return '\n'.join(lines)

    def generate_response(self, messages):
        """Tạo câu trả lời từ AI với context và danh sách tin nhắn"""
        try:
            # Tạo context từ danh sách tin nhắn đã lọc
            messages_context = "\n".join([
                f"{sender}: {msg}" for sender, msg in messages
            ])
            
            # Context từ lịch sử hội thoại
            history_context = "\n".join([
                f"User: {self.clean_message(msg['user'])}\nAI: {self.clean_message(msg['ai'])}" 
                for msg in self.conversation_history[-3:]
            ])
            
            prompt = f"""
            Bạn là trợ lý AI trả lời tin nhắn Zalo. Hãy tuân thủ nghiêm ngặt:
            1. LUÔN trả lời trực tiếp, không được hỏi lại người dùng
            2. Sử dụng tiếng Việt có dấu
            3. KHÔNG ĐƯỢC dùng các cụm từ như "Xin lỗi", "Tôi không hiểu"
            4. PHẢI trả lời dứt khoát và hữu ích
            
            Lịch sử hội thoại gần đây:
            {history_context}
            
            Danh sách tin nhắn hiện tại:
            {messages_context}
            
            Hãy phân tích và trả lời tin nhắn mới nhất cần phản hồi như tin nhắn này: {last_message}.
            Trả lời ngay và dứt khoát:
            """
            
            response = self.model.generate_content(prompt)
            response_text = response.text.strip()
            # Bỏ giới hạn độ dài tin nhắn
            return response_text
        except Exception as e:
            print(f"Lỗi khi tạo câu trả lời: {e}")
            return "Tôi đã hiểu và sẽ giúp bạn."

    def run(self):
        print("Bot đang chạy. Nhấn Ctrl+C để dừng.")
        zalo_window = None
        
        while True:
            try:
                if not zalo_window:
                    print("Đang tìm cửa sổ Zalo...")
                    zalo_window = self.find_zalo_window()
                    if not zalo_window:
                        print("Không tìm thấy cửa sổ Zalo! Đảm bảo Zalo Web đang mở trong Chrome")
                        time.sleep(2)
                        continue
                
                # Thêm logging
                print("Đang đọc tin nhắn...")
                messages = self.get_latest_message(zalo_window)
                print(f"Tin nhắn đọc được: {messages}")
                
                if messages and len(messages) > 0:  # Kiểm tra messages có tồn tại và không rỗng
                    # Lấy tin nhắn cuối cùng thay vì tin nhắn gần cuối
                    last_sender, last_message = messages[-1]
                    
                    if (last_message and 
                        last_message != self.last_user_message and 
                        last_message != self.last_ai_response):
                        
                        print(f"\nTin nhắn mới: {last_message}")
                        response = self.generate_response(messages)
                        
                        if response:
                            print(f"Đang trả lời: {response}")
                            self.send_message(response)
                            
                            self.conversation_history.append({
                                'user': last_message,
                                'ai': response
                            })
                            
                            if len(self.conversation_history) > self.max_history:
                                self.conversation_history.pop(0)
                                
                            self.last_user_message = last_message
                            self.last_ai_response = response
                
                time.sleep(0.5)
                
            except KeyboardInterrupt:
                print("\nĐang dừng bot...")
                break
            except Exception as e:
                print(f"Lỗi: {e}")
                zalo_window = None
                time.sleep(1)

if __name__ == "__main__":
    # Khởi tạo và chạy bot
    bot = ZaloChatBot()
    print("Khởi động bot...")
    time.sleep(2)  # Đi để Zalo load hoàn toàn
    bot.run()
