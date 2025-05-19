import xml.etree.ElementTree as ET

# Đọc file XML
def read_xml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    return {text.attrib['Key']: text.text for text in root.findall('Text')}

# Tạo file XML mới
def create_xml(data, file_path):
    root = ET.Element('STBLKeyStringList')
    for key, text in data.items():
        text_elem = ET.SubElement(root, 'Text')
        text_elem.set('Key', key)
        text_elem.text = text
    
    tree = ET.ElementTree(root)
    tree.write(file_path, encoding='UTF-8', xml_declaration=True)

# Đọc dữ liệu từ cả hai file
vn_data = read_xml('BASE/BASE_VN.xml')
eng_data = read_xml('BASE/BASE_ENG.xml')

# Tìm các key bị thiếu trong file VN
missing_keys = {key: eng_data[key] for key in eng_data.keys() if key not in vn_data}

# Tạo file FIX.xml với nội dung tiếng Anh được thay thế bằng tiếng Việt khi có
fix_data = {}
for key, eng_text in eng_data.items():
    fix_data[key] = vn_data.get(key, eng_text)

# Tạo các file mới
create_xml(missing_keys, 'MISS_KEY.xml')
create_xml(fix_data, 'FIX.xml')