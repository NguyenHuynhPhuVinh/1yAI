import xml.etree.ElementTree as ET
from collections import defaultdict

def read_xml_file(file_path):
    """Đọc file XML và trả về dict với key là Key và value là text"""
    tree = ET.parse(file_path)
    root = tree.getroot()
    return {elem.attrib['Key']: elem.text for elem in root.findall('Text')}

def write_xml_file(translations, output_file):
    """Ghi dict translations ra file XML"""
    root = ET.Element('STBLKeyStringList')
    
    # Sắp xếp theo key để dễ đọc
    for key in sorted(translations.keys()):
        text_elem = ET.SubElement(root, 'Text')
        text_elem.set('Key', key)
        text_elem.text = translations[key]
    
    # Ghi file với encoding UTF-8
    tree = ET.ElementTree(root)
    tree.write(output_file, encoding='UTF-8', xml_declaration=True)

def check_translation_coverage(eng_dict, vn_dict, xx_dict):
    """Kiểm tra độ phủ của bản dịch"""
    total_eng = len(eng_dict)
    total_vn = len(vn_dict)
    total_xx = len(xx_dict)
    
    # Tìm các KEY trùng lặp
    duplicate_keys = set(vn_dict.keys()) & set(xx_dict.keys())
    num_duplicates = len(duplicate_keys)
    
    # Tính tổng số KEY đã dịch thực tế (loại bỏ trùng lặp)
    total_translated = total_vn + total_xx - num_duplicates
    
    # Tính phần trăm hoàn thành
    coverage_rate = (total_translated / total_eng) * 100
    
    return {
        'total_eng': total_eng,
        'total_vn': total_vn,
        'total_xx': total_xx,
        'total_translated': total_translated,
        'coverage_rate': coverage_rate,
        'duplicate_count': num_duplicates
    }

def merge_translations():
    """Ghép các file translation lại với nhau"""
    # Đọc các file
    eng_dict = read_xml_file('BASE/BASE.xml')
    vn_dict = read_xml_file('BASE/BASE_VN.xml')
    xx_dict = read_xml_file('BASE/XX_vietnamese.xml')
    
    # Dict để lưu kết quả cuối cùng
    final_translations = {}
    
    # Duyệt qua từng key trong file tiếng Anh
    for key in eng_dict:
        # Ưu tiên lấy từ BASE_VN trước
        if key in vn_dict:
            final_translations[key] = vn_dict[key]
        # Nếu không có trong BASE_VN thì tìm trong XX_vietnamese
        elif key in xx_dict:
            final_translations[key] = xx_dict[key]
        # Nếu không tìm thấy bản dịch thì giữ nguyên tiếng Anh
        else:
            final_translations[key] = eng_dict[key]
    
    # Kiểm tra độ phủ
    coverage = check_translation_coverage(eng_dict, vn_dict, xx_dict)
    
    # In báo cáo
    print("\nBáo cáo độ phủ bản dịch:")
    print(f"Tổng số chuỗi trong file gốc (US): {coverage['total_eng']}")
    print(f"Tổng số chuỗi đã dịch (VN + XX - trùng lặp): {coverage['total_translated']}")
    print(f"- Số chuỗi từ BASE_VN: {coverage['total_vn']}")
    print(f"- Số chuỗi từ XX_vietnamese: {coverage['total_xx']}")
    print(f"- Số chuỗi trùng lặp: {coverage['duplicate_count']}")
    print(f"Tỷ lệ hoàn thành: {coverage['coverage_rate']:.2f}%")
    
    # Ghi ra file kết quả
    write_xml_file(final_translations, 'BASE/BASE_vietnamese.xml')

if __name__ == "__main__":
    try:
        merge_translations()
        print("\nĐã tạo file BASE_vietnamese.xml thành công!")
    except Exception as e:
        print(f"Có lỗi xảy ra: {str(e)}")
