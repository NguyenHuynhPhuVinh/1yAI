import keyboard
import pyautogui
from PIL import ImageGrab
import tkinter as tk
from datetime import datetime
import os
from tkinter import scrolledtext
import PIL.Image
from google import genai
from google.genai import types
import json
import base64
from io import BytesIO
import traceback

# Các hàm config và history cần được đặt ở đầu file
def create_default_config():
    default_config = {
        "api_key": "AIzaSyA111V_GcyH9yJUR7wDeAr3Z5dgTwfBaew",
        "model": "gemini-2.0-flash",
        "system_prompt": """Bạn là một dịch giả chuyên nghiệp, nhiệm vụ của bạn là dịch văn bản tiếng Anh sang tiếng Việt một cách chính xác và tự nhiên.
        Bạn cần đặc biệt chú ý đến các yếu tố sau:
        - **Bối cảnh:** Văn bản bạn đang dịch là một phần của trò chơi visual novel, một thể loại game tập trung vào cốt truyện và đối thoại.
        - **Phong cách:** Giữ giọng văn phù hợp với nhân vật và tình huống trong trò chơi. Sử dụng ngôn ngữ đời thường, dễ hiểu, nhưng vẫn đảm bảo tính trang trọng khi cần thiết.
        - **Từ ngữ:** Lựa chọn từ ngữ chính xác, phù hợp với văn hóa Việt Nam và quen thuộc với người chơi game. Ưu tiên sự trôi chảy và tự nhiên của câu văn.
        - **Đồng nhất:** Đảm bảo tính nhất quán trong cách dịch các thuật ngữ, tên riêng và các yếu tố quan trọng khác trong suốt quá trình dịch.
        - **Mục tiêu:** Bản dịch của bạn phải truyền tải được đầy đủ ý nghĩa, cảm xúc và sắc thái của văn bản gốc, đồng thời mang lại trải nghiệm đọc tốt nhất cho người chơi Việt Nam.
        - **Lưu ý:** Tránh dịch quá sát nghĩa, hãy tập trung vào việc truyền tải ý chính và tạo ra một bản dịch tự nhiên, dễ đọc và hấp dẫn.
        """,
        "history_file": "chat_history.json"
    }
    
    with open('config.json', 'w', encoding='utf-8') as f:
        json.dump(default_config, f, ensure_ascii=False, indent=2)
    return default_config

def load_config():
    try:
        with open('config.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return create_default_config()

def load_chat_history():
    config = load_config()
    history_file = config['history_file']
    if os.path.exists(history_file):
        with open(history_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_chat_history(history):
    config = load_config()
    with open(config['history_file'], 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

# Khởi tạo client với config
config = load_config()
client = genai.Client(api_key=config['api_key'])

# Thay thế biến selected_region bằng dictionary để lưu nhiều vùng
selected_regions = {}
current_region = '1'  # Vùng mặc định
current_translation_window = None # Biến toàn cục để theo dõi cửa sổ dịch

# ---- Định nghĩa cấu hình an toàn để tắt filter (sử dụng dict) ----
safety_settings_none = [
    {
        "category": genai.types.HarmCategory.HARM_CATEGORY_HARASSMENT,
        "threshold": genai.types.HarmBlockThreshold.BLOCK_NONE,
    },
    {
        "category": genai.types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        "threshold": genai.types.HarmBlockThreshold.BLOCK_NONE,
    },
    {
        "category": genai.types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        "threshold": genai.types.HarmBlockThreshold.BLOCK_NONE,
    },
    {
        "category": genai.types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        "threshold": genai.types.HarmBlockThreshold.BLOCK_NONE,
    },
    # Mặc dù ít gặp hơn, thêm cả CIVIC_INTEGRITY cho chắc chắn nếu API hỗ trợ
    # {
    #     "category": HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
    #     "threshold": HarmBlockThreshold.BLOCK_NONE,
    # },
]

def save_region(region_key, bbox):
    global selected_regions
    selected_regions[region_key] = bbox

def get_region(region_key):
    return selected_regions.get(region_key)

def show_translation(translation):
    global current_translation_window

    # Đóng cửa sổ dịch cũ nếu đang mở
    if current_translation_window and tk.Toplevel.winfo_exists(current_translation_window):
        current_translation_window.destroy()

    # Tạo cửa sổ hiển thị bản dịch mới (sử dụng Toplevel thay vì Tk)
    translation_window = tk.Toplevel()
    translation_window.title("Bản dịch")
    translation_window.geometry("600x400")
    # Đặt cửa sổ luôn trên cùng
    translation_window.attributes('-topmost', True)

    # Lấy kích thước màn hình
    screen_width = translation_window.winfo_screenwidth()
    screen_height = translation_window.winfo_screenheight()

    # Tính toán vị trí để cửa sổ hiển thị ở bên phải
    window_width = 600  # Kích thước cửa sổ bản dịch
    window_height = 400
    x = screen_width - window_width - 50  # Cách lề phải 50px
    y = (screen_height - window_height) // 2  # Canh giữa theo chiều dọc

    # Đặt vị trí cửa sổ
    translation_window.geometry(f"{window_width}x{window_height}+{x}+{y}")
    
    translation_window.lift()
    translation_window.focus_force()

    text_area = scrolledtext.ScrolledText(translation_window, wrap=tk.WORD, width=60, height=20)
    text_area.pack(padx=10, pady=10, expand=True, fill='both')

    text_area.insert(tk.END, translation)
    text_area.configure(state='disabled')

    # Hàm xử lý khi đóng cửa sổ
    def on_close():
        global current_translation_window
        translation_window.destroy()
        current_translation_window = None # Đặt lại biến theo dõi

    close_button = tk.Button(translation_window, text="Đóng", command=on_close)
    close_button.pack(pady=5)

    # Xử lý khi nhấn nút X của sổ
    translation_window.protocol("WM_DELETE_WINDOW", on_close)

    # Cập nhật biến theo dõi
    current_translation_window = translation_window

    # Không cần translation_window.mainloop() khi dùng Toplevel nếu cửa sổ chính vẫn chạy

def get_translation_from_image(screenshot: PIL.Image.Image):
    try:
        # Load config
        config = load_config()
        history_json = load_chat_history()
        system_prompt = config.get('system_prompt', '')

        # ---- Chuyển đổi lịch sử sang định dạng Gemini ----
        gemini_history = []
        for entry in history_json:
            if 'role' in entry and 'content' in entry:
                text_content = entry['content']
                role = entry['role'] if entry['role'] in ['user', 'model'] else 'user'
                gemini_history.append(types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=text_content)]
                ))

        # ---- Tạo nội dung cho lượt yêu cầu hiện tại (multimodal) ----
        # Prompt này giờ chỉ là phần yêu cầu cụ thể cho lượt này
        user_prompt = "Hãy dịch toàn bộ text trong ảnh game này sang tiếng Việt. Chỉ trả về bản dịch, không cần giải thích thêm."
        # Tạo Part cho text
        text_part = types.Part.from_text(text=user_prompt)

        # Chuyển đổi PIL Image sang bytes (PNG)
        buffer = BytesIO()
        screenshot.save(buffer, format="PNG")
        image_bytes = buffer.getvalue()
        buffer.close()

        # Tạo Blob chứa dữ liệu hình ảnh
        image_blob = types.Blob(
            mime_type='image/png',
            data=image_bytes
        )

        # Tạo Part chứa Blob hình ảnh
        image_part = types.Part(inline_data=image_blob)

        # ---- Kết hợp lịch sử và nội dung mới ----
        # Đóng gói lượt cuối thành Content object với vai trò 'user'
        current_user_content = types.Content(role="user", parts=[text_part, image_part])
        combined_contents = gemini_history + [current_user_content]

        # ---- Gửi lịch sử, ảnh, prompt và system instruction đến Gemini ----
        global client
        if client is None:
             # Có thể trả về chuỗi rỗng hoặc None nếu client chưa sẵn sàng
             print("Lỗi: Gemini client chưa được khởi tạo.")
             return "" # Hoặc return None

        # Gọi generate_content thông qua client.models
        response = client.models.generate_content(
            model=config['model'],
            contents=combined_contents,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                safety_settings=safety_settings_none
            )
        )

        # ---- Lưu vào lịch sử chỉ khi thành công ----
        if response and response.text: # Chỉ lưu nếu có phản hồi và nội dung text
            history_json.append({
                "role": "user",
                "content": f"{user_prompt}\n[Image Translation Request]",
                "timestamp": datetime.now().isoformat()
            })
            history_json.append({
                "role": "model",
                "content": response.text,
                "timestamp": datetime.now().isoformat()
            })
            save_chat_history(history_json)
            return response.text
        else:
            # Nếu không có response.text (ví dụ bị block hoặc lỗi khác không raise Exception)
            print("Lỗi: Không nhận được nội dung hợp lệ từ API.")
            # In thêm thông tin về response nếu có để debug
            if response:
                print(f"API Response: {response}")
            return ""

    except Exception as e:
        print(f"Đã xảy ra lỗi trong get_translation_from_image:")
        traceback.print_exc() # In chi tiết lỗi và dòng gây lỗi ra console
        # Trả về một chuỗi rỗng hoặc giá trị mặc định khác
        return "" # Trả về chuỗi rỗng để không hiển thị gì trong cửa sổ dịch

def on_screenshot(capture_only=False, region_key=None):
    global selected_regions, current_region
    
    # Nếu có region_key và vùng đã được lưu, chụp ngay
    if capture_only and region_key and region_key in selected_regions:
        bbox = selected_regions[region_key]
        # Kiểm tra xem bbox có hợp lệ không
        if bbox and len(bbox) == 4 and bbox[0] < bbox[2] and bbox[1] < bbox[3]:
            try:
                screenshot = ImageGrab.grab(bbox=bbox)
                translation = get_translation_from_image(screenshot)
                # Chỉ hiển thị cửa sổ nếu có bản dịch trả về
                if translation:
                    show_translation(translation)
                else:
                    # Thông báo nếu không có bản dịch (tùy chọn)
                    print(f"Không nhận được bản dịch cho vùng {region_key}.")
            except Exception as e:
                print(f"Lỗi khi chụp màn hình hoặc dịch vùng {region_key}: {e}")
                # Có thể hiển thị lỗi cho người dùng nếu muốn
        else:
            print(f"Vùng {region_key} chưa được chọn hoặc không hợp lệ.")
            # Cân nhắc việc có nên tự động mở lại cửa sổ chọn vùng hay không
            # on_screenshot(capture_only=True, region_key=region_key) # Tạm thời bỏ comment dòng này nếu muốn tự mở lại
        return # Thoát hàm sau khi xử lý xong phần chụp nhanh
    
    # Tạo cửa sổ chính tạm thời để chọn vùng (nếu chưa có)
    # Sử dụng Toplevel thay vì Tk để tránh lỗi khi Tk đã có instance chạy
    root = tk.Toplevel()
    root.attributes('-alpha', 0.3)
    root.attributes('-fullscreen', True)
    root.withdraw() # Ẩn cửa sổ chính tạm thời ban đầu

    # Chỉ hiển thị cửa sổ chọn vùng khi cần
    root.deiconify()
    
    canvas = tk.Canvas(root, cursor="cross")
    canvas.pack(fill=tk.BOTH, expand=True)
    
    # Hiển thị các vùng đã lưu với số và màu khác nhau
    saved_rects = {}
    for key, bbox in selected_regions.items():
        x1, y1, x2, y2 = bbox
        # Tạo hình chữ nhật với viền dày hơn
        rect = canvas.create_rectangle(x1, y1, x2, y2, outline='blue', width=2)
        # Tạo background cho số
        bg_size = 20
        bg = canvas.create_oval(
            (x1+x2)/2 - bg_size/2, 
            (y1+y2)/2 - bg_size/2,
            (x1+x2)/2 + bg_size/2, 
            (y1+y2)/2 + bg_size/2,
            fill='white',
            outline='blue'
        )
        # Tạo số với font to hơn
        text = canvas.create_text(
            (x1+x2)/2, 
            (y1+y2)/2, 
            text=key,
            fill='blue',
            font=('Arial', 12, 'bold')
        )
        saved_rects[key] = (rect, bg, text)
    
    start_x = None
    start_y = None
    rect = None
    temp_text = None
    temp_bg = None

    def on_press(event):
        nonlocal start_x, start_y
        start_x = event.x
        start_y = event.y

    def on_drag(event):
        nonlocal rect, temp_text, temp_bg
        # Xóa hình chữ nhật và text cũ nếu có
        if rect:
            canvas.delete(rect)
        if temp_text:
            canvas.delete(temp_text)
        if temp_bg:
            canvas.delete(temp_bg)
            
        # Vẽ hình chữ nhật mới
        rect = canvas.create_rectangle(
            start_x, start_y, event.x, event.y, 
            outline='red',
            width=2
        )
        
        # Tạo background cho số
        center_x = (start_x + event.x) / 2
        center_y = (start_y + event.y) / 2
        bg_size = 20
        temp_bg = canvas.create_oval(
            center_x - bg_size/2,
            center_y - bg_size/2,
            center_x + bg_size/2,
            center_y + bg_size/2,
            fill='white',
            outline='red'
        )
        
        # Hiển thị số của vùng đang chọn
        temp_text = canvas.create_text(
            center_x,
            center_y,
            text=region_key or current_region,
            fill='red',
            font=('Arial', 12, 'bold')
        )

    def on_release(event):
        nonlocal root # Cần truy cập root để đóng
        x1 = min(start_x, event.x)
        y1 = min(start_y, event.y)
        x2 = max(start_x, event.x)
        y2 = max(start_y, event.y)
        
        # Lưu vùng với key được chỉ định
        effective_region_key = region_key or current_region
        save_region(effective_region_key, (x1, y1, x2, y2))
        
        root.destroy() # Đóng cửa sổ chọn vùng

        if not capture_only:
            # Chụp ảnh màn hình vùng vừa chọn
            try:
                screenshot = ImageGrab.grab(bbox=(x1, y1, x2, y2))
                translation = get_translation_from_image(screenshot)
                # Chỉ hiển thị cửa sổ nếu có bản dịch trả về
                if translation:
                    show_translation(translation)
                else:
                    # Thông báo nếu không có bản dịch (tùy chọn)
                    print(f"Không nhận được bản dịch cho vùng {effective_region_key} vừa chọn.")
            except Exception as e:
                print(f"Lỗi khi chụp màn hình hoặc dịch vùng {effective_region_key}: {e}")
        # Không cần else vì root.destroy() đã được gọi

    canvas.bind("<Button-1>", on_press)
    canvas.bind("<B1-Motion>", on_drag)
    canvas.bind("<ButtonRelease-1>", on_release)
    
    # Không cần root.mainloop() vì script chính đã có keyboard.wait()

def quick_capture():
    # Chụp vùng hiện tại khi nhấn ~
    on_screenshot(capture_only=True, region_key=current_region)

def set_current_region(key):
    global current_region
    current_region = key

# Đăng ký các phím tắt
keyboard.add_hotkey('alt+p', lambda: on_screenshot(capture_only=False))  # Chọn vùng và chụp ngay
keyboard.add_hotkey('alt+s', lambda: on_screenshot(capture_only=True))   # Chỉ chọn vùng
keyboard.add_hotkey('`', quick_capture)  # Chụp vùng hiện tại

# Đăng ký phím tắt cho việc chọn vùng 1-9
for i in range(1, 10):
    # Phím Alt + số để lưu vùng mới
    keyboard.add_hotkey(f'alt+{i}', lambda x=str(i): on_screenshot(capture_only=True, region_key=x))
    # Phím số để chọn vùng hiện tại
    keyboard.add_hotkey(str(i), lambda x=str(i): set_current_region(x))

# Giữ chương trình chạy bằng vòng lặp chính của Tkinter thay vì keyboard.wait()
# Điều này cần thiết để Toplevel hoạt động đúng cách
if __name__ == "__main__":
    # Tạo một cửa sổ Tk ẩn để làm cửa sổ chính
    root_main = tk.Tk()
    root_main.withdraw() # Ẩn cửa sổ chính này đi

    print("Chương trình đang chạy. Sử dụng các phím tắt:")
    print("- Alt+P: Chọn vùng mới và dịch")
    print("- Alt+S: Chỉ chọn vùng mới (lưu vào số hiện tại)")
    print("- Alt+[1-9]: Chọn và lưu vùng vào số tương ứng")
    print("- [1-9]: Chọn vùng số tương ứng làm vùng hiện tại")
    print("- `: Dịch vùng hiện tại")
    print("Nhấn Ctrl+C trong console để thoát.")

    # Bắt đầu vòng lặp chính của Tkinter
    root_main.mainloop()

# Phần generate() có thể không cần thiết trong ngữ cảnh này trừ khi bạn muốn chạy nó riêng biệt
# def generate():
#     # ... (code generate giữ nguyên) ...

# if __name__ == "__main__":
#     # Bỏ generate() ở đây nếu chỉ muốn chạy phần phím tắt
#     # generate()
