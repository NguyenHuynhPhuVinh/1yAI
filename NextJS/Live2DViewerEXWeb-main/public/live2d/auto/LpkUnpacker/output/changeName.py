import os
import json

def rename_files_in_directory(directory, prefix_to_remove):
    """
    Đổi tên các file trong thư mục `directory` mà tên file bắt đầu bằng `prefix_to_remove`.
    """
    renamed_files = {}
    for root, _, files in os.walk(directory):
        for file_name in files:
            if file_name.startswith(prefix_to_remove) or '#' in file_name:
                new_name = file_name.replace(prefix_to_remove, '').replace('#', '')
                old_file_path = os.path.join(root, file_name)
                new_file_path = os.path.join(root, new_name)
                os.rename(old_file_path, new_file_path)
                print(f'Renamed: {old_file_path} -> {new_file_path}')
                renamed_files[old_file_path.replace('\\', '/')] = new_file_path.replace('\\', '/')
    return renamed_files

def update_json_file(json_file_path, prefix_to_remove):
    """
    Cập nhật các đường dẫn file trong tệp JSON để phản ánh các tên file mới.
    Loại bỏ tiền tố `prefix_to_remove` và ký tự `#` từ các đường dẫn file.
    """
    with open(json_file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Hàm thay thế các đường dẫn trong JSON
    def replace_paths(d):
        if isinstance(d, dict):
            for key, value in d.items():
                if isinstance(value, (dict, list)):
                    replace_paths(value)
                elif isinstance(value, str):
                    if prefix_to_remove in value or '#' in value:
                        d[key] = value.replace(prefix_to_remove, '').replace('#', '')
        elif isinstance(d, list):
            for i in range(len(d)):
                item = d[i]
                if isinstance(item, (dict, list)):
                    replace_paths(item)
                elif isinstance(item, str):
                    if prefix_to_remove in item or '#' in item:
                        d[i] = item.replace(prefix_to_remove, '').replace('#', '')

    replace_paths(data)

    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    print(f'Updated JSON file: {json_file_path}')

def process_directory(base_directory, prefix_to_remove):
    """
    Duyệt qua từng thư mục con trong thư mục chứa tệp Python và vào thư mục `character`
    để đổi tên các file và cập nhật tệp `model0.json`.
    """
    for sub_dir in os.listdir(base_directory):
        sub_dir_path = os.path.join(base_directory, sub_dir)
        if os.path.isdir(sub_dir_path):
            character_dir = os.path.join(sub_dir_path, 'character')
            if os.path.isdir(character_dir):
                print(f'Processing directory: {character_dir}')
                renamed_files = rename_files_in_directory(character_dir, prefix_to_remove)
                
                for sub_sub_dir in os.listdir(character_dir):
                    sub_sub_dir_path = os.path.join(character_dir, sub_sub_dir)
                    if os.path.isdir(sub_sub_dir_path) and sub_sub_dir in ['motions', 'voice', 'textures']:
                        print(f'Processing subdirectory: {sub_sub_dir_path}')
                        renamed_files.update(rename_files_in_directory(sub_sub_dir_path, prefix_to_remove))
                
                model_json_path = os.path.join(character_dir, 'model0.json')
                if os.path.isfile(model_json_path):
                    update_json_file(model_json_path, prefix_to_remove)

# Đường dẫn tới thư mục chứa tệp Python
base_directory = os.path.dirname(os.path.abspath(__file__))

# Tiền tố của file cần đổi tên
prefix_to_remove = 'FileReferences_'

# Xử lý các thư mục
process_directory(base_directory, prefix_to_remove)
