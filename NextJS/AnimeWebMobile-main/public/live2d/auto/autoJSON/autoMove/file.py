import os
import shutil

# Đường dẫn tới thư mục chứa file Python và các thư mục cần di chuyển
source_directory = os.path.dirname(os.path.abspath(__file__))

# Đường dẫn tới thư mục đích cho các thư mục cần di chuyển
destination_directory = 'C:/Users/TomiSakae/Documents/tomisakae.github.io/public/live2d/auto/LpkUnpacker/lpkfolder'

# Đường dẫn tới tệp models.txt trong thư mục nguồn
models_file_path = os.path.join(source_directory, 'models.txt')

# Đường dẫn tới tệp models.txt trong thư mục đích
destination_models_file_path = 'C:/Users/TomiSakae/Documents/tomisakae.github.io/public/live2d/auto/autoJSON/autoMove/models.txt'

# Đọc danh sách ID từ tệp models.txt và bỏ qua phần số thứ tự
with open(models_file_path, 'r') as file:
    id_list = [line.strip().split(' - ', 1)[1] for line in file]

# Tạo thư mục đích nếu chưa tồn tại
os.makedirs(destination_directory, exist_ok=True)

# Mở tệp models.txt ở chế độ append
with open(models_file_path, 'a') as file:
    # Đếm số lượng ID đã tồn tại trong tệp
    id_count = len(id_list)
    
    # Duyệt qua tất cả các mục trong thư mục nguồn
    for item in os.listdir(source_directory):
        item_path = os.path.join(source_directory, item)
        
        # Kiểm tra nếu mục đó là một thư mục và tên thư mục không nằm trong danh sách ID
        if os.path.isdir(item_path) and item not in id_list:
            # Di chuyển thư mục đến thư mục đích
            shutil.move(item_path, os.path.join(destination_directory, item))
            
            # Ghi tên thư mục đã di chuyển vào tệp models.txt với số thứ tự
            file.write(f"{id_count + 1} - {item}\n")
            id_count += 1

# Sao chép tệp models.txt đến vị trí đích
shutil.copy(models_file_path, destination_models_file_path)
