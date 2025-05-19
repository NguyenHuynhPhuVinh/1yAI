import xml.etree.ElementTree as ET

def load_xml_keys(file_path):
    """Đọc file XML và trả về dictionary với key và text"""
    tree = ET.parse(file_path)
    root = tree.getroot()
    return {elem.get('Key'): elem.text for elem in root.findall('Text')}

def find_missing_keys(base_file, vh_file, output_file):
    """Tìm các key có trong base nhưng không có trong vh và xuất ra file mới"""
    try:
        # Đọc cả hai file
        base_dict = load_xml_keys(base_file)
        vh_dict = load_xml_keys(vh_file)
        
        # Tìm các key có trong base nhưng không có trong vh
        missing_keys = set(base_dict.keys()) - set(vh_dict.keys())
        
        if not missing_keys:
            print("Không có key nào bị thiếu!")
            return
        
        # Tạo XML mới với các key bị thiếu
        root = ET.Element('STBLKeyStringList')
        
        for key in sorted(missing_keys):
            text_elem = ET.SubElement(root, 'Text')
            text_elem.set('Key', key)
            text_elem.text = base_dict[key]
        
        # Ghi file với định dạng UTF-8 và XML declaration
        tree = ET.ElementTree(root)
        tree.write(output_file, encoding='UTF-8', xml_declaration=True)
        
        print(f"Đã tìm thấy {len(missing_keys)} key bị thiếu")
        print(f"Kết quả đã được lưu vào {output_file}")
        
    except Exception as e:
        print(f"Lỗi: {e}")

if __name__ == "__main__":
    base_file = "BASE/BASE.xml"
    vh_file = "BASE/BASEVH.xml" 
    output_file = "BASE/MISSING_KEYS.xml"
    
    find_missing_keys(base_file, vh_file, output_file)