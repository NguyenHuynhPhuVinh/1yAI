import os
import subprocess
import json
import shutil

# Hàm để làm đẹp lại file JSON
def beautify_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4, ensure_ascii=False)
        
        print(f"Đã làm đẹp file JSON: {file_path}")
    except Exception as e:
        print(f"Không thể làm đẹp file JSON {file_path}: {e}")

# Hàm để cập nhật đường dẫn trong file model0.json
def update_json_paths(file_path, updates):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        def update_paths(item):
            if isinstance(item, dict):
                for k, v in item.items():
                    if isinstance(v, str):
                        for old_path, new_path in updates.items():
                            if v.endswith(old_path):
                                item[k] = os.path.join(new_path, os.path.basename(v)).replace("\\", "/")
                    elif isinstance(v, (dict, list)):
                        update_paths(v)
            elif isinstance(item, list):
                for i in item:
                    if isinstance(i, str):
                        for old_path, new_path in updates.items():
                            if i.endswith(old_path):
                                item[item.index(i)] = os.path.join(new_path, os.path.basename(i)).replace("\\", "/")
                    else:
                        update_paths(i)

        # Cập nhật đường dẫn trong mục "FileReferences_Textures"
        if "FileReferences" in data and "Textures" in data["FileReferences"]:
            for idx, texture in enumerate(data["FileReferences"]["Textures"]):
                for old_path, new_path in updates.items():
                    if texture.endswith(old_path):
                        data["FileReferences"]["Textures"][idx] = os.path.join(new_path, os.path.basename(texture)).replace("\\", "/")
        
        update_paths(data)
        
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=4, ensure_ascii=False)
        
        print(f"Đã cập nhật đường dẫn trong file JSON: {file_path}")
    except Exception as e:
        print(f"Không thể cập nhật đường dẫn trong file JSON {file_path}: {e}")

# Lấy đường dẫn đến thư mục chứa file Python này
base_directory = os.path.dirname(os.path.abspath(__file__))

# Lấy đường dẫn đến thư mục cha của thư mục chứa file Python
parent_directory = os.path.dirname(base_directory)

# Đường dẫn đến thư mục output nằm ngoài thư mục chứa file Python một cấp
output_directory = os.path.join(parent_directory, 'output')

# Tạo thư mục output nếu chưa tồn tại
if not os.path.exists(output_directory):
    os.makedirs(output_directory)

# Biến đếm để đặt tên thứ tự cho các thư mục
folder_count = 1

# Lưu trữ thông tin về các thư mục đã đổi tên
renamed_folders = []

# Lặp qua tất cả các thư mục con trong thư mục chứa file Python này
for subdir, _, files in os.walk(base_directory):
    # Bỏ qua thư mục gốc chứa file Python và thư mục output
    if subdir == base_directory or subdir.startswith(output_directory):
        continue
    
    lpk_found = False
    for filename in files:
        if filename.endswith('.lpk'):
            # Đường dẫn đầy đủ đến file hiện tại
            old_path = os.path.join(subdir, filename)
            
            # Đường dẫn đầy đủ đến file mới
            new_path = os.path.join(subdir, 'target.lpk')
            
            # Đổi tên file
            os.rename(old_path, new_path)
            
            print(f"Đã đổi tên '{filename}' trong thư mục '{subdir}' thành 'target.lpk'")
            lpk_found = True
    
    # Nếu tìm thấy file .lpk và đã đổi tên, tiến hành đổi tên thư mục
    if lpk_found:
        new_subdir_name = os.path.join(base_directory, str(folder_count))
        os.rename(subdir, new_subdir_name)
        print(f"Đã đổi tên thư mục '{subdir}' thành '{new_subdir_name}'")
        
        # Tạo thư mục tương ứng trong thư mục output
        output_subdir_name = os.path.join(output_directory, str(folder_count))
        os.makedirs(output_subdir_name)
        print(f"Đã tạo thư mục '{output_subdir_name}' trong thư mục output")
        
        # Lưu lại thông tin thư mục đã đổi tên
        renamed_folders.append((new_subdir_name, str(folder_count)))
        
        folder_count += 1

# Chạy lệnh cmd cho từng thư mục đã đổi tên
for folder, folder_id in renamed_folders:
    config_path = os.path.join(folder, 'config.json')
    lpk_path = os.path.join(folder, 'target.lpk')
    output_path = os.path.join(output_directory, folder_id)
    
    # Lệnh cmd cần chạy
    cmd = f'python LpkUnpacker.py -c "{config_path}" "{lpk_path}" "{output_path}"'
    
    # Thực thi lệnh cmd và chờ đợi hoàn thành
    subprocess.run(cmd, shell=True, cwd=parent_directory, check=True)
    print(f"Đã thực thi lệnh: {cmd}")

    # Đường dẫn đến thư mục chứa file model0.json
    character_directory = os.path.join(output_directory, folder_id, 'character')
    model_json_path = os.path.join(character_directory, 'model0.json')
    
    # Làm đẹp file model0.json
    beautify_json(model_json_path)

    # Tạo các thư mục voice, motions, textures, và expressions
    voice_directory = os.path.join(character_directory, 'voice')
    motions_directory = os.path.join(character_directory, 'motions')
    textures_directory = os.path.join(character_directory, 'textures')
    expressions_directory = os.path.join(character_directory, 'expressions')
    
    os.makedirs(voice_directory, exist_ok=True)
    os.makedirs(motions_directory, exist_ok=True)
    os.makedirs(textures_directory, exist_ok=True)
    os.makedirs(expressions_directory, exist_ok=True)

    # Di chuyển các file vào các thư mục tương ứng
    updates = {}
    for filename in os.listdir(character_directory):
        file_path = os.path.join(character_directory, filename)
        if filename.endswith(('.ogg', '.mp3', '.wav')):
            new_path = os.path.join(voice_directory, filename)
            shutil.move(file_path, new_path)
            updates[filename] = 'voice'
        elif filename.endswith('.json') and 'motions' in filename.casefold():
            new_path = os.path.join(motions_directory, filename)
            shutil.move(file_path, new_path)
            updates[filename] = 'motions'
        elif filename.endswith('.png'):
            new_path = os.path.join(textures_directory, filename)
            shutil.move(file_path, new_path)
            updates[filename] = 'textures'
        elif filename.endswith('.json') and 'Expressions' in filename:
            new_path = os.path.join(expressions_directory, filename)
            shutil.move(file_path, new_path)
            updates[filename] = 'expressions'
    
    # Cập nhật đường dẫn trong file model0.json
    update_json_paths(model_json_path, updates)

    # Di chuyển và đổi tên file .png từ thư mục chứa file lpk vào thư mục output tương ứng
    source_textures_directory = os.path.join(base_directory, folder_id)
    for root, _, files in os.walk(source_textures_directory):
        for filename in files:
            if filename.endswith('.png'):
                source_file_path = os.path.join(root, filename)
                destination_file_path = os.path.join(output_path, 'background.png')
                shutil.move(source_file_path, destination_file_path)
                print(f"Đã di chuyển và đổi tên '{filename}' từ '{source_file_path}' đến '{destination_file_path}'")

                # Chạy lệnh cmd sau khi tất cả các bước xử lý đã hoàn tất
final_cmd = 'python changeName.py'
subprocess.run(final_cmd, shell=True, cwd=output_directory, check=True)
print("Đã thực thi lệnh cuối cùng: python changeName.py")

# Chạy lệnh cmd tiếp theo
final_cmd2 = 'python changeJSON.py'
subprocess.run(final_cmd2, shell=True, cwd=output_directory, check=True)
print("Đã thực thi lệnh cuối cùng: python changeJSON.py")

# Chạy lệnh cmd tiếp theo
final_cmd3 = 'python moveJSON.py'
subprocess.run(final_cmd3, shell=True, cwd=output_directory, check=True)
print("Đã thực thi lệnh cuối cùng: python moveJSON.py")

# Hàm để xóa thư mục và file ngoại trừ các file cụ thể
def delete_folder_contents(folder_path, exclude_extensions):
    for root, dirs, files in os.walk(folder_path, topdown=False):
        for name in files:
            if not any(name.endswith(ext) for ext in exclude_extensions):
                file_path = os.path.join(root, name)
                os.remove(file_path)
                print(f"Đã xóa file: {file_path}")
        for name in dirs:
            dir_path = os.path.join(root, name)
            shutil.rmtree(dir_path)
            print(f"Đã xóa thư mục: {dir_path}")

# Đường dẫn đến thư mục chứa file Python
base_directory = os.path.dirname(os.path.abspath(__file__))

# Xóa các thư mục nằm cùng với file Python, ngoại trừ các file .py và .cmd
delete_folder_contents(base_directory, exclude_extensions=['.py', '.cmd'])

print("Đã xóa các thư mục và file ngoại trừ các file .py và .cmd")