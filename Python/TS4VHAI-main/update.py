import xml.etree.ElementTree as ET
import json
import os
import sys

def load_case_translations(package_name):
    """Tải các bản dịch từ case file JSON"""
    case_file = f"{package_name}/translation_cache.json"
    if os.path.exists(case_file):
        with open(case_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def update_translations(package_name):
    """Cập nhật bản dịch từ case file vào file Vietnamese"""
    base_path = f"{package_name}/{package_name}"
    input_file = f"{base_path}.xml"
    output_file = f"{base_path}_vietnamese.xml"
    
    # Kiểm tra các file cần thiết
    if not os.path.exists(input_file):
        print(f"Lỗi: Không tìm thấy file gốc {input_file}")
        return
    
    # Tải case translations
    case_translations = load_case_translations(package_name)
    if not case_translations:
        print("Không tìm thấy case file hoặc case file trống")
        return
    
    try:
        # Đọc file gốc
        input_tree = ET.parse(input_file)
        input_root = input_tree.getroot()
        
        # Tạo root mới cho file Vietnamese
        output_root = ET.Element('STBLKeyStringList')
        
        # Đọc file Vietnamese hiện có nếu tồn tại
        existing_translations = {}
        if os.path.exists(output_file):
            existing_tree = ET.parse(output_file)
            existing_root = existing_tree.getroot()
            existing_translations = {elem.get('Key'): elem.text for elem in existing_root.findall('Text')}
        
        # Đếm số lượng cập nhật
        updates = {
            'total': 0,
            'from_case': 0,
            'from_existing': 0,
            'untranslated': 0
        }
        
        # Xử lý từng phần tử trong file gốc
        for elem in input_root.findall('Text'):
            key = elem.get('Key')
            original_text = elem.text
            updates['total'] += 1
            
            # Tạo phần tử mới
            new_elem = ET.Element('Text')
            new_elem.set('Key', key)
            
            # Ưu tiên lấy từ case file trước
            if original_text in case_translations:
                new_elem.text = case_translations[original_text]
                updates['from_case'] += 1
            # Nếu không có trong case, kiểm tra trong bản dịch hiện có
            elif key in existing_translations:
                new_elem.text = existing_translations[key]
                updates['from_existing'] += 1
            # Nếu không có cả hai, giữ nguyên text gốc
            else:
                new_elem.text = original_text
                updates['untranslated'] += 1
            
            output_root.append(new_elem)
        
        # Lưu file
        output_tree = ET.ElementTree(output_root)
        output_tree.write(output_file, encoding='UTF-8', xml_declaration=True)
        
        # Hiển thị thống kê
        print(f"\nKết quả cập nhật cho {package_name}:")
        print(f"Tổng số KEY: {updates['total']}")
        print(f"- Cập nhật từ case file: {updates['from_case']}")
        print(f"- Giữ nguyên từ file Vietnamese hiện có: {updates['from_existing']}")
        print(f"- Chưa được dịch (giữ nguyên bản gốc): {updates['untranslated']}")
        print(f"\nĐã lưu kết quả vào: {output_file}")
        
    except ET.ParseError as e:
        print(f"Lỗi khi đọc file XML: {e}")
    except Exception as e:
        print(f"Lỗi không mong đợi: {e}")

def main():
    """
    Sử dụng: python update.py <package_name>
    Ví dụ: python update.py GP11
    """
    if len(sys.argv) != 2:
        print("Cách sử dụng: python update.py <package_name>")
        print("Ví dụ: python update.py GP11")
        sys.exit(1)
        
    package_name = sys.argv[1]
    update_translations(package_name)

if __name__ == "__main__":
    main()
