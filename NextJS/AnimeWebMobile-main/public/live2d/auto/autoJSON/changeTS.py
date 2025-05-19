import json
import os

def create_typescript_file(json_file_path, ts_file_path):
    try:
        # Đọc dữ liệu từ tệp JSON
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        
        # Chuyển đổi dữ liệu JSON thành định dạng TypeScript
        ts_content = 'const modelData = {\n'
        ts_content += '    models: [\n'
        
        for model in data.get('models', []):
            ts_content += '        {\n'
            ts_content += f'            model: \'{model["model"]}\',\n'
            ts_content += f'            modelname: \'{model["modelname"]}\',\n'
            ts_content += f'            modelid: \'{model["modelid"]}\',\n'
            ts_content += f'            name: \'{model["name"]}\'\n'
            ts_content += '        },\n'
        
        ts_content += '    ]\n'
        ts_content += '};\n'
        ts_content += 'export default modelData;\n'

        # Ghi nội dung vào tệp TypeScript
        with open(ts_file_path, 'w', encoding='utf-8') as ts_file:
            ts_file.write(ts_content)
        
        print(f'Created {ts_file_path}')

    except Exception as e:
        print(f'Error creating TypeScript file: {e}')

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_file_path = os.path.join(base_dir, 'data.json')
    ts_file_path = os.path.join(base_dir, 'modelData.ts')
    create_typescript_file(json_file_path, ts_file_path)

if __name__ == '__main__':
    main()
