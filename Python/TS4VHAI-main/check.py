import xml.etree.ElementTree as ET
import sys
import os
import re
import json

def has_strange_characters(text):
    """Kiểm tra xem văn bản có chứa các ký tự lạ đã biết không"""
    if not text or text.isspace():
        return False, set()
    
    # Danh sách các ký tự lạ cần kiểm tra
    strange_chars = set('абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'  # Chữ Nga
                       'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω'  # Chữ Hy Lạp
                       '中国日本한국'  # Chữ Trung, Nhật, Hàn
                       '★☆♠♡♢♣♤♥♦♧♨♩♪♫♬♭♮♯'  # Các ký tự đặc biệt không mong muốn
                       )
    
    # Bỏ qua các placeholder như {0.SimFirstName}, {M0.he}, etc.
    text = ' '.join(word for word in text.split() if not (word.startswith('{') and word.endswith('}')))
    
    # Tìm các ký tự lạ trong văn bản
    found_chars = set(char for char in text if char in strange_chars)
    
    return len(found_chars) > 0, found_chars

def extract_placeholders(text):
    """Trích xuất tất cả các placeholder và thẻ trong văn bản"""
    if not text:
        return [], []
    
    # Tách riêng placeholders {...} và thẻ <...>
    placeholders = re.findall(r'{[^}]+}', text)
    tags = re.findall(r'<[^>]+>', text)
    
    return placeholders, tags

def compare_placeholders(original_text, translated_text, key):
    """So sánh placeholder và thẻ giữa văn bản gốc và bản dịch"""
    original_placeholders, original_tags = extract_placeholders(original_text)
    translated_placeholders, translated_tags = extract_placeholders(translated_text)
    
    errors = []
    
    # Kiểm tra số lượng và nội dung placeholder {...}
    if len(original_placeholders) != len(translated_placeholders):
        errors.append(f"Số lượng placeholder không khớp. Gốc: {original_placeholders}, Dịch: {translated_placeholders}")
    else:
        for orig, trans in zip(original_placeholders, translated_placeholders):
            if orig != trans:
                errors.append(f"Placeholder không khớp. Gốc: {orig}, Dịch: {trans}")
    
    # Kiểm tra số lượng và nội dung thẻ <...>
    if len(original_tags) != len(translated_tags):
        errors.append(f"Số lượng thẻ không khớp. Gốc: {original_tags}, Dịch: {translated_tags}")
    else:
        for orig, trans in zip(original_tags, translated_tags):
            if orig.lower() != trans.lower():  # So sánh không phân biệt hoa thường với thẻ
                errors.append(f"Thẻ không khớp. Gốc: {orig}, Dịch: {trans}")
    
    if errors:
        return False, "; ".join(errors)
    return True, None

def check_xml_files(package_name):
    """Kiểm tra tính đầy đủ của các KEY và nội dung trong các file XML"""
    base_path = f"{package_name}/{package_name}"
    input_file = f"{base_path}.xml"
    output_file = f"{base_path}_vietnamese.xml"
    invalid_file = f"{package_name}/invalid_keys.xml"
    invalid_json = f"{package_name}/invalid_keys.json"
    
    if not os.path.exists(input_file):
        print(f"Lỗi: Không tìm thấy file gốc {input_file}")
        return
    if not os.path.exists(output_file):
        print(f"Lỗi: Không tìm thấy file việt hóa {output_file}")
        return

    try:
        # Đọc các file XML
        input_tree = ET.parse(input_file)
        output_tree = ET.parse(output_file)
        
        input_root = input_tree.getroot()
        output_root = output_tree.getroot()
        
        # Lấy tất cả các phần tử Text
        input_elements = input_root.findall('Text')
        output_elements = output_root.findall('Text')
        
        # Tạo dict cho cả hai file
        input_dict = {elem.get('Key'): elem.text for elem in input_elements}
        output_dict = {elem.get('Key'): elem.text for elem in output_elements}
        
        # Tạo root cho file invalid_keys.xml
        invalid_root = ET.Element('STBLKeyStringList')
        has_invalid_keys = False
        
        # Dictionary để lưu thông tin chi tiết cho file JSON
        invalid_details = {
            "strange_characters": {},
            "placeholder_errors": {}
        }
        
        # Kiểm tra ký tự lạ
        strange_char_keys = {}
        for key, value in output_dict.items():
            has_strange, found_chars = has_strange_characters(value)
            if has_strange:
                strange_char_keys[key] = {
                    'text': value,
                    'strange_chars': list(found_chars)
                }
        
        if strange_char_keys:
            has_invalid_keys = True
            print(f"\nCó {len(strange_char_keys)} KEY chứa ký tự lạ:")
            for key, info in strange_char_keys.items():
                print(f"- {key}:")
                print(f"  Ký tự lạ: {', '.join(info['strange_chars'])}")
                print(f"  Nội dung: {info['text']}\n")
                
                # Thêm vào file invalid_keys.xml
                if key in input_dict:
                    original_elem = ET.Element('Text')
                    original_elem.set('Key', f"{key}_original")
                    original_elem.text = input_dict[key]
                    invalid_root.append(original_elem)
                
                translated_elem = ET.Element('Text')
                translated_elem.set('Key', key)
                translated_elem.text = info['text']
                invalid_root.append(translated_elem)
                
                # Thêm vào JSON
                invalid_details["strange_characters"][key] = {
                    "original": input_dict.get(key, ''),
                    "translated": info['text'],
                    "strange_chars": list(found_chars),
                    "error": f"Chứa ký tự lạ: {', '.join(info['strange_chars'])}"
                }
        
        # Kiểm tra placeholder và thẻ
        placeholder_errors = {}
        for key in output_dict:
            if key in input_dict:
                is_valid, error_msg = compare_placeholders(input_dict[key], output_dict[key], key)
                if not is_valid:
                    placeholder_errors[key] = error_msg
        
        if placeholder_errors:
            has_invalid_keys = True
            print(f"\nCó {len(placeholder_errors)} KEY có lỗi placeholder hoặc thẻ:")
            for key, error in placeholder_errors.items():
                print(f"- {key}: {error}")
                # Thêm vào file invalid_keys.xml
                original_elem = ET.Element('Text')
                original_elem.set('Key', f"{key}_original")
                original_elem.text = input_dict[key]
                invalid_root.append(original_elem)
                
                translated_elem = ET.Element('Text')
                translated_elem.set('Key', key)
                translated_elem.text = output_dict[key]
                invalid_root.append(translated_elem)
                
                # Thêm vào JSON
                invalid_details["placeholder_errors"][key] = {
                    "original": input_dict[key],
                    "translated": output_dict[key],
                    "error": error
                }
        
        # Lưu file invalid_keys.xml và invalid_keys.json nếu có lỗi
        if has_invalid_keys:
            # Lưu XML
            invalid_tree = ET.ElementTree(invalid_root)
            invalid_tree.write(invalid_file, encoding='UTF-8', xml_declaration=True)
            
            # Lưu JSON
            with open(invalid_json, 'w', encoding='utf-8') as f:
                json.dump(invalid_details, f, ensure_ascii=False, indent=2)
            
            print(f"\nĐã lưu các KEY không hợp lệ vào:")
            print(f"- File XML: {invalid_file}")
            print(f"- File JSON: {invalid_json}")
        else:
            print("\nKhông tìm thấy KEY nào có lỗi!")
            
    except ET.ParseError as e:
        print(f"Lỗi khi đọc file XML: {e}")
    except Exception as e:
        print(f"Lỗi không mong đợi: {e}")

def main():
    """
    Sử dụng: python check.py <package_name>
    Ví dụ: python check.py GP11
    """
    if len(sys.argv) != 2:
        print("Cách sử dụng: python check.py <package_name>")
        print("Ví dụ: python check.py GP11")
        sys.exit(1)
        
    package_name = sys.argv[1]
    check_xml_files(package_name)

if __name__ == "__main__":
    main()
