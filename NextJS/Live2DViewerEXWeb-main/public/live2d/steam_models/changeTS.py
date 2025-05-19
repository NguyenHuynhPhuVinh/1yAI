import os
import json

# Đường dẫn tới thư mục cần duyệt
base_dir = os.path.dirname(os.path.abspath(__file__))

# Đường dẫn tới file img.ts
img_ts_path = os.path.join(base_dir, 'img.ts')

# Tìm kiếm tất cả các tệp background.png trong thư mục và các thư mục con
image_files = []
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.lower() == 'background.png':
            relative_path = os.path.relpath(os.path.join(root, file), base_dir)
            image_files.append(relative_path)

# Tạo danh sách hình ảnh cho img.ts
images = [{'id': idx + 1, 'src': f'/live2d/steam_models/{idx + 1}/background.png', 'alt': f'Image {idx + 1}'} for idx, path in enumerate(image_files)]

# Chuyển danh sách hình ảnh sang dạng string để ghi vào file img.ts
images_str = json.dumps(images, indent=4).replace('},', '},\n    ').replace('[', '[\n    ').replace(']', '\n]')

# Nội dung của file img.ts
img_ts_content = f"""const images = {images_str};

export default images;
"""

# Ghi nội dung vào file img.ts
with open(img_ts_path, 'w') as f:
    f.write(img_ts_content)

print(f"Đã cập nhật file img.ts với {len(images)} hình ảnh.")
