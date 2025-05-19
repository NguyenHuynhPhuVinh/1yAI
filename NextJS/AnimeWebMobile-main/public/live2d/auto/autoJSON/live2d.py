import json
import glob
import os
import re

def build_motions_dict(motions_dir):
    motions = {}
    idle_files = []
    idle_keys = {}
    idle_zero_files = []

    motion_files = glob.glob(os.path.join(motions_dir, '*.motion3.json'))
    
    for motion_file in motion_files:
        file_name = os.path.basename(motion_file)
        motion_name = file_name.replace('.motion3.json', '')
        motion_name_cap = motion_name.capitalize()
        file_path = os.path.join("motions", file_name).replace("\\", "/")
        
        if motion_name.lower().startswith('idle'):
            idle_files.append({"File": file_path})
            if len(motion_name) > 4 and motion_name[4:].isdigit():
                specific_idle_key = f"Idle{motion_name[4:]}"
            else:
                specific_idle_key = "Idle0"
            
            if specific_idle_key not in idle_keys:
                idle_keys[specific_idle_key] = []
            idle_keys[specific_idle_key].append({"File": file_path})
        else:
            if motion_name_cap not in motions:
                motions[motion_name_cap] = []
            motions[motion_name_cap].append({"File": file_path})
    
    if len(idle_files) == 1:
        motions["Idle"] = idle_files
    else:
        motions["Idle"] = idle_files
        for key, files in idle_keys.items():
            motions[key] = files

    animation_files = set()
    motions["Animation"] = []
    for key, files in motions.items():
        if key != "Idle" and not key.startswith('Idle'):
            for file in files:
                file_path = file["File"]
                if file_path not in animation_files:
                    animation_files.add(file_path)
                    motions["Animation"].append({"File": file_path})

    return motions

def update_model_files(model_file_path, motions):
    try:
        with open(model_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        if "FileReferences" in data and "Motions" in data["FileReferences"]:
            data["FileReferences"]["Motions"] = motions

        with open(model_file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=2)

        print(f'Updated {model_file_path}')

    except Exception as e:
        print(f'Error updating {model_file_path}: {e}')

def process_directory(base_dir):
    models_data = []
    model_id = 97
    subdirectories = [d for d in glob.glob(os.path.join(base_dir, '*')) if os.path.isdir(d)]
    
    for subdirectory in subdirectories:
        motions_dir = os.path.join(subdirectory, 'motions')
        
        if os.path.exists(motions_dir):
            motions = build_motions_dict(motions_dir)
            
            model_files = glob.glob(os.path.join(subdirectory, '*.model3.json'))
            
            for model_file_path in model_files:
                update_model_files(model_file_path, motions)
                
                # Prepare model information for data.json
                model_name = os.path.basename(subdirectory).replace('_', ' ')
                model_name = ' '.join(word.capitalize() for word in model_name.split())
                model_file_name = os.path.basename(model_file_path)
                
                models_data.append({
                    "model": f'/live2d/models/{os.path.basename(subdirectory)}/{model_file_name}',
                    "modelname": model_name,
                    "modelid": str(model_id),
                    "name": model_name
                })
                
                model_id += 1
    
    # Write models data to data.json
    data_output_path = os.path.join(base_dir, 'data.json')
    with open(data_output_path, 'w', encoding='utf-8') as file:
        json.dump({"models": models_data}, file, ensure_ascii=False, indent=2)
    
    print(f'Created {data_output_path}')

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    process_directory(base_dir)

if __name__ == '__main__':
    main()
