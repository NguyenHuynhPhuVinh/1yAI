import os
import json

def process_hit_areas(data):
    if 'HitAreas' in data:
        for hit_area in data['HitAreas']:
            if "Motion" not in hit_area:
                hit_area["Motion"] = "Tap" + hit_area["Name"]
    return data

def process_motions(data):
    if 'FileReferences' in data and 'Motions' in data['FileReferences']:
        motions = data['FileReferences']['Motions']
        keys_to_delete = []

        for key, value in motions.items():
            if isinstance(value, list):
                filtered_value = []
                for item in value:
                    if 'File' in item or 'Sound' in item:
                        # Giữ lại các mục 'File' và 'Sound', thêm giá trị 'File' mặc định nếu chỉ có 'Sound'
                        filtered_item = {k: item[k] for k in ('File', 'Sound') if k in item}
                        if 'Sound' in item and 'File' not in item:
                            filtered_item['File'] = "motions/Motions_Idle_0_File_0.json"
                        filtered_value.append(filtered_item)

                if filtered_value:
                    motions[key] = filtered_value
                else:
                    keys_to_delete.append(key)
            else:
                keys_to_delete.append(key)

        for key in keys_to_delete:
            del motions[key]

        animation_data = []
        for value in motions.values():
            animation_data.extend(value)

        data['FileReferences']['Motions']['Animation'] = animation_data

        if 'Animation' in data['FileReferences']['Motions']:
            animation_items = data['FileReferences']['Motions']['Animation']
            
            for index, item in enumerate(animation_items):
                new_key = f"Animation_{index+1}"
                if new_key not in motions:
                    motions[new_key] = [item]

    return data

def process_files_in_directory(base_directory):
    for item in os.listdir(base_directory):
        item_path = os.path.join(base_directory, item)
        if os.path.isdir(item_path):
            if item == 'character':
                model0_path = os.path.join(item_path, 'model0.json')
                if os.path.isfile(model0_path):
                    try:
                        # Đọc dữ liệu từ tệp model0.json
                        with open(model0_path, 'r', encoding='utf-8') as file:
                            data = json.load(file)
                        
                        # Xử lý dữ liệu
                        data = process_hit_areas(data)
                        data = process_motions(data)
                        
                        # Ghi dữ liệu đã xử lý vào tệp model0.json
                        with open(model0_path, 'w', encoding='utf-8') as file:
                            json.dump(data, file, ensure_ascii=False, indent=4)
                        
                        print(f"Đã xử lý và lưu tệp {model0_path} thành công.")
                    except Exception as e:
                        print(f"Đã xảy ra lỗi khi xử lý tệp {model0_path}: {e}")
                else:
                    print(f"Tệp {model0_path} không tồn tại.")
            else:
                process_files_in_directory(item_path)

# Thư mục gốc chứa script Python
base_directory = os.path.dirname(os.path.abspath(__file__))

# Xử lý các tệp trong thư mục gốc
process_files_in_directory(base_directory)
