import xml.etree.ElementTree as ET
import google.generativeai as genai
import os
import time
import json
from dotenv import load_dotenv
import sys  # Thêm import này ở đầu file

# Tải biến môi trường từ file .env
load_dotenv()

# Cấu hình cho model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "application/json",
}

safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
    }
]

def init_chat():
    """Khởi tạo chat session với lịch sử mẫu"""
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
    
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=generation_config,
        safety_settings=safety_settings
    )
    
    chat = model.start_chat(history=[
    {
      "role": "user",
      "parts": [
        "You are a Vietnamese translator for The Sims 4.\nRETURN ONLY THE VIETNAMESE TRANSLATION.\n- Keep all tags and placeholders unchanged\n- Use casual Vietnamese tone\n\nTranslate to Vietnamese: This abstract sculpture doesn't have a specific shape intended. It's made to let you imagine what you want. Apparently some people see a llama in it.",
      ],
    },
    {
      "role": "model",
      "parts": [
        "Cái tượng trừu tượng này không có hình dáng cụ thể nào cả. Nó được làm ra để bạn tha hồ tưởng tượng đó. Nghe đâu có người còn nhìn ra con lạc đà không bướu trong đó nữa cơ.\n",
      ],
    },
    {
      "role": "user",
      "parts": [
        "When translating nouns, avoid adding particles such as \"nè\", \"hả\", \"á\" at the end. For example, \"Ancient Bust\" should be translated as \"Tượng Cổ\", not \"Tượng Cổ nè\"\nTranslate to Vietnamese: Wishmaker",
      ],
    },
    {
      "role": "model",
      "parts": [
        "Người Ước Nguyện\n",
      ],
    },
    {
      "role": "user",
      "parts": [
        "With the format (From...) when translating, keep it as (Từ...) for example: (From Designing Jewelry) -> (Từ Việc Thiết Kế Trang Sức)\nTranslate to Vietnamese: (From Crystal Crafter Aspiration)",
      ],
    },
    {
      "role": "model",
      "parts": [
        "(Từ Nguyện Vọng Chế Tạo Pha Lê)\n",
      ],
    },
    {
      "role": "user",
      "parts": [
        "All forms such as {M0.he}{F0.she} or {M0.his}{F0.her} or {F0.Lady}{M0.Lord} and other {M0.}, {F0.} MUST BE KEPT UNCHANGED.\nTranslate to Vietnamese: {0.SimFirstName} befriended a Dust Bunny! Since {M0.he}{F0.she} made {M0.his}{F0.her} fluffy companion feel so welcomed and cared for in {M0.his}{F0.her} house, this dust bunny will behave a bit differently. It can now survive in even the cleanest environments and will no longer be destroyed by cleaning around the house - it's here to stay. \\n\\nBefriended Dust Bunnies will also show their appreciation by finding rarer items and occasionally even digging up substantial piles of Simoleons. ",
      ],
    },
    {
      "role": "model",
      "parts": [
        "{0.SimFirstName} đã kết bạn với Thỏ Bụi! Vì {M0.he}{F0.she} đã làm cho người bạn lông xù của {M0.his}{F0.her} cảm thấy được chào đón và chăm sóc trong nhà của {M0.his}{F0.her}, nên thỏ bụi này sẽ cư xử hơi khác một chút. Giờ nó có thể sống sót ngay cả trong môi trường sạch sẽ nhất và sẽ không còn bị tiêu diệt khi dọn dẹp nhà cửa nữa - nó sẽ ở lại đây. \\n\\nThỏ Bụi đã kết bạn cũng sẽ thể hiện sự cảm kích bằng cách tìm kiếm những vật phẩm hiếm hơn và đôi khi thậm chí còn đào được những đống Simoleon đáng kể.\n",
      ],
    },
    {
      "role": "user",
      "parts": [
        " If there are multiple pieces of content to translate, return them as key-value pairs (KEY1, KEY2, etc.) according to the number of contents.\nKEY1-Translate to Vietnamese: Thank you for your hat donation. This will surely keep someone's head warm!\nKEY2-Translate to Vietnamese: {0.SimFirstName} befriended a Dust Bunny! Since {M0.he}{F0.she} made {M0.his}{F0.her} fluffy companion feel so welcomed and cared for in {M0.his}{F0.her} house, this dust bunny will behave a bit differently. It can now survive in even the cleanest environments and will no longer be destroyed by cleaning around the house - it's here to stay. \\n\\nBefriended Dust Bunnies will also show their appreciation by finding rarer items and occasionally even digging up substantial piles of Simoleons.\nKEY3-Translate to Vietnamese: (From Crystal Crafter Aspiration)\nKEY4-Translate to Vietnamese: Wishmaker\nKEY5-Translate to Vietnamese: {0.SimFirstName} befriended a Dust Bunny! Since {M0.he}{F0.she} made {M0.his}{F0.her} fluffy companion feel so welcomed and cared for in {M0.his}{F0.her} house, this dust bunny will behave a bit differently. It can now survive in even the cleanest environments and will no longer be destroyed by cleaning around the house - it's here to stay. \\n\\nBefriended Dust Bunnies will also show their appreciation by finding rarer items and occasionally even digging up substantial piles of Simoleons.",
      ],
    },
    {
      "role": "model",
      "parts": [
        "```json\n{\n\"KEY1\": \"Cảm ơn bạn đã quyên góp mũ. Chắc chắn nó sẽ giúp ai đó giữ ấm đầu!\",\n\"KEY2\": \"{0.SimFirstName} đã kết bạn với Thỏ Bụi! Vì {M0.he}{F0.she} đã làm cho người bạn lông xù của {M0.his}{F0.her} cảm thấy được chào đón và chăm sóc trong nhà của {M0.his}{F0.her}, nên thỏ bụi này sẽ cư xử hơi khác một chút. Giờ nó có thể sống sót ngay cả trong môi trường sạch sẽ nhất và sẽ không còn bị tiêu diệt khi dọn dẹp nhà cửa nữa - nó sẽ ở lại đây. \\n\\nThỏ Bụi đã kết bạn cũng sẽ thể hiện sự cảm kích bằng cách tìm kiếm những vật phẩm hiếm hơn và đôi khi thậm chí còn đào được những đống Simoleon đáng kể.\",\n\"KEY3\": \"(Từ Nguyện Vọng Chế Tạo Pha Lê)\",\n\"KEY4\": \"Người Ước Nguyện\",\n\"KEY5\": \"{0.SimFirstName} đã kết bạn với Thỏ Bụi! Vì {M0.he}{F0.she} đã làm cho người bạn lông xù của {M0.his}{F0.her} cảm thấy được chào đón và chăm sóc trong nhà của {M0.his}{F0.her}, nên thỏ bụi này sẽ cư xử hơi khác một chút. Giờ nó có thể sống sót ngay cả trong môi trường sạch sẽ nhất và sẽ không còn bị tiêu diệt khi dọn dẹp nhà cửa nữa - nó sẽ ở lại đây. \\n\\nThỏ Bụi đã kết bạn cũng sẽ thể hiện sự cảm kích bằng cách tìm kiếm những vật phẩm hiếm hơn và đôi khi thậm chí còn đào được những đống Simoleon đáng kể.\"\n}\n```",
      ],
    },
  ])
    
    return chat

def load_translation_cache(cache_file):
    """Đọc cache từ file JSON"""
    if os.path.exists(cache_file):
        with open(cache_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_translation_cache(cache_file, cache):
    """Lưu cache vào file JSON"""
    with open(cache_file, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

def load_request_count(count_file):
    """Đọc số request đã thực hiện"""
    if os.path.exists(count_file):
        with open(count_file, 'r') as f:
            return int(f.read().strip())
    return 0

def save_request_count(count_file, count):
    """Lưu số request đã thực hiện"""
    with open(count_file, 'w') as f:
        f.write(str(count))

def translate_multiple_texts(texts, translation_cache, cache_file, chat_session):
    """Dịch nhiều văn bản cùng lúc và trả về dạng JSON"""
    prompt = "\n".join([f"KEY{i+1}-Translate to Vietnamese: {text}" for i, text in enumerate(texts)])
    
    retry_delay = 10  # Thời gian chờ cố định 10 giây
    time.sleep(4)

    while True:
        try:
            print(f"Đang dịch {len(texts)} văn bản")
            
            response = chat_session.send_message(prompt)
            # Chuyển đổi response text thành dict
            response_text = response.text.strip()
            try:
                translations = json.loads(response_text)
            except json.JSONDecodeError:
                print("Lỗi: Không thể parse JSON từ phản hồi của AI")
                raise
            
            # Cập nhật cache cho từng bản dịch
            for i, text in enumerate(texts):
                key = f"KEY{i+1}"
                if key in translations:
                    translation_cache[text] = translations[key]
            
            save_translation_cache(cache_file, translation_cache)
            return translations
            
        except Exception as e:
            error_message = str(e).lower()
            if "429" in error_message or "resource has been exhausted" in error_message:
                print(f"Lỗi giới hạn quota (429). Thử lại sau {retry_delay} giây...")
                time.sleep(retry_delay)
                continue
            else:
                print(f"Lỗi nghiêm trọng: {e}")
                raise

def process_xml(input_file, output_file, cache_file, chat_session, batch_size=5):
    """
    Xử lý file XML với khả năng dịch nhiều phần tử cùng lúc
    batch_size: số lượng phần tử cần dịch trong một lần
    """
    print(f"\nBắt đầu xử lý file {input_file}")
    
    translation_cache = load_translation_cache(cache_file)
    
    # Đọc file output hiện có nếu tồn tại
    last_translated_index = -1
    if os.path.exists(output_file):
        print(f"Đọc file output hiện có: {output_file}")
        existing_tree = ET.parse(output_file)
        existing_root = existing_tree.getroot()
        existing_translations = {elem.get('Key'): elem.text for elem in existing_root.findall('Text')}
        
        # Đọc file input để tìm vị trí cuối cùng đã dịch
        input_tree = ET.parse(input_file)
        input_elements = input_tree.getroot().findall('Text')
        
        for i, elem in enumerate(input_elements):
            if elem.get('Key') not in existing_translations:
                last_translated_index = i - 1
                break
        
        if last_translated_index == -1 and input_elements:  # Nếu tất cả đã được dịch
            last_translated_index = len(input_elements) - 1
            
        print(f"Đã dịch đến phần tử thứ: {last_translated_index + 1}")
    else:
        existing_translations = {}

    tree = ET.parse(input_file)
    root = tree.getroot()
    new_root = ET.Element('STBLKeyStringList')
    
    # Sao chép các phần tử đã dịch vào new_root
    elements = root.findall('Text')
    for i in range(last_translated_index + 1):
        elem = elements[i]
        new_elem = ET.Element('Text')
        new_elem.set('Key', elem.get('Key'))
        new_elem.text = existing_translations[elem.get('Key')]
        new_root.append(new_elem)
    
    # Tiếp tục dịch từ vị trí cuối cùng
    remaining_elements = elements[last_translated_index + 1:]
    total_remaining = len(remaining_elements)
    print(f"Số phần tử còn lại cần dịch: {total_remaining}")
    
    try:
        # Xử lý theo batch
        for i in range(0, total_remaining, batch_size):
            batch_elements = remaining_elements[i:i + batch_size]
            texts_to_translate = []
            keys = []
            
            for elem in batch_elements:
                key = elem.get('Key')
                if key in existing_translations:
                    # Thêm phần tử đã có vào output
                    new_elem = ET.Element('Text')
                    new_elem.set('Key', key)
                    new_elem.text = existing_translations[key]
                    new_root.append(new_elem)
                    print(f"Đã có bản dịch cho key {key}")
                else:
                    texts_to_translate.append(elem.text)
                    keys.append(key)
            
            if texts_to_translate:
                translations = translate_multiple_texts(
                    texts_to_translate,
                    translation_cache,
                    cache_file,
                    chat_session
                )
                
                # Thêm các bản dịch mới vào output
                for j, key in enumerate(keys):
                    new_elem = ET.Element('Text')
                    new_elem.set('Key', key)
                    new_elem.text = translations[f"KEY{j+1}"]
                    new_root.append(new_elem)
            
            # Lưu file sau mỗi batch
            tree = ET.ElementTree(new_root)
            tree.write(output_file, encoding='UTF-8', xml_declaration=True)
            
    except Exception as e:
        print(f"Lỗi nghiêm trọng: {e}")
        print("Đã lưu các bản dịch đã hoàn thành. Có thể chạy lại để tiếp tục.")
        return

    print(f"\nĐã hoàn thành! Kết quả được lưu vào {output_file}")

def get_file_paths(package_name):
    """Tạo đường dẫn cho các file dựa trên tên gói"""
    base_path = f"{package_name}/{package_name}"
    return {
        'input': f"{base_path}.xml",
        'output': f"{base_path}_vietnamese.xml",
        'cache': f"{package_name}/translation_cache.json",
        'count': "total_request_count.txt"
    }

def main():
    """
    Usage: python main.py <package_name> <batch_size>
    Example: python main.py GP11 5
    """
    if len(sys.argv) != 3:
        print("Cách sử dụng: python main.py <package_name> <batch_size>")
        print("Ví dụ: python main.py GP11 5")
        sys.exit(1)
    
    try:
        package_name = sys.argv[1]
        batch_size = int(sys.argv[2])
        
        if not (1 <= batch_size <= 5):
            print("Số lượng KEY phải từ 1-5")
            sys.exit(1)
            
        print(f"Đang xử lý gói: {package_name}")
        print(f"Số lượng KEY mỗi lần: {batch_size}")
        
        # Tải API key từ .env
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            print("Lỗi: Không tìm thấy GEMINI_API_KEY trong file .env")
            sys.exit(1)
            
        genai.configure(api_key=api_key)
        
        paths = get_file_paths(package_name)
        chat_session = init_chat()
        
        process_xml(
            input_file=paths['input'],
            output_file=paths['output'],
            cache_file=paths['cache'],
            chat_session=chat_session,
            batch_size=batch_size
        )
        
    except ValueError:
        print("Lỗi: batch_size phải là số nguyên")
        sys.exit(1)
    except Exception as e:
        print(f"Lỗi không mong đợi: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
