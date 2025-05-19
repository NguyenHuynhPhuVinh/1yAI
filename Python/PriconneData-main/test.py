import json

def add_name_jp_field():
    # Đọc file data_raw.json
    with open('Priconne/data_raw.json', 'r', encoding='utf-8') as f:
        data_raw = json.load(f)
    
    # Đọc file data.json
    with open('Priconne/data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Tạo dictionary ánh xạ từ URL avatar đến tên tiếng Nhật
    avatar_to_name_jp = {}
    for character in data_raw['characters']:
        if 'avatar' in character and 'name' in character:
            avatar_to_name_jp[character['avatar']] = character['name']
    
    # Thêm trường name_jp vào data.json
    for character in data['characters']:
        if 'avatar' in character and character['avatar'] in avatar_to_name_jp:
            character['name_jp'] = avatar_to_name_jp[character['avatar']]
        else:
            # Nếu không tìm thấy avatar tương ứng, đặt giá trị mặc định
            character['name_jp'] = ""
    
    # Ghi lại file data.json đã được cập nhật
    with open('Priconne/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("Đã thêm trường name_jp vào data.json thành công.")

if __name__ == "__main__":
    add_name_jp_field()