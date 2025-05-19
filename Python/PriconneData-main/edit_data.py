import json

# Đọc file JSON
with open('data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Bảng ánh xạ vai trò
role_mapping = {
    "攻撃型": "DPS",                  # Nhân vật tấn công chính
    "攻撃支援型": "DPS Hỗ trợ",        # Nhân vật vừa DPS vừa hỗ trợ tăng sát thương
    "支援型": "Hỗ trợ",               # Nhân vật hỗ trợ thuần túy (buff, heal)
    "耐久型": "Tank",                 # Nhân vật chống chịu, hứng sát thương
    "耐久支援型": "Tank Hỗ trợ",       # Nhân vật có khả năng chống chịu và hỗ trợ đồng đội
    "耐久攻撃型": "Tank DPS"           # Nhân vật có khả năng chống chịu và tấn công mạnh
}

# Đếm tổng số nhân vật
total_characters = len(data['characters'])

# Duyệt qua từng nhân vật để cập nhật thông tin
for i, character in enumerate(data['characters']):
    # Xóa ID cũ
    if 'id' in character:
        del character['id']
    
    # Đánh lại ID mới từ 1 đến số lượng nhân vật
    character['id'] = i + 1
    
    # Chuyển đổi vai trò sang tiếng Việt
    if character['role'] in role_mapping:
        character['role'] = role_mapping[character['role']]
    
    # Cập nhật định dạng điểm đánh giá
    if character['rating_below_6_stars'] == '-' or character['rating_below_6_stars'] == '-点':
        character['rating_below_6_stars'] = 'chưa đánh giá'
    elif '点' in character['rating_below_6_stars']:
        character['rating_below_6_stars'] = character['rating_below_6_stars'].replace('点', ' điểm')
        character['rating_below_6_stars'] = character['rating_below_6_stars'].replace('(仮)', '(tạm thời)')
    
    if character['rating_6_stars'] == '-' or character['rating_6_stars'] == '-点':
        character['rating_6_stars'] = 'chưa đánh giá'
    elif '点' in character['rating_6_stars']:
        character['rating_6_stars'] = character['rating_6_stars'].replace('点', ' điểm')
        character['rating_6_stars'] = character['rating_6_stars'].replace('(仮)', '(tạm thời)')

# Lưu file JSON đã cập nhật
with open('data.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print(f"Đã hoàn thành cập nhật cho {total_characters} nhân vật.")