import os
import shutil
import subprocess

def move_folders_up_and_rename_if_needed(src_directory, target_directory):
    # Ensure the target directory exists
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)

    # List all directories in the source directory
    folders = [f for f in os.listdir(src_directory) if os.path.isdir(os.path.join(src_directory, f))]

    for folder in folders:
        src_folder_path = os.path.join(src_directory, folder)

        # Get the highest existing id in the target directory
        existing_folders = [f for f in os.listdir(target_directory) if os.path.isdir(os.path.join(target_directory, f))]
        existing_ids = [int(f) for f in existing_folders if f.isdigit()]
        max_id = max(existing_ids) if existing_ids else 0

        # Calculate the new id by adding 1 to the highest existing id
        new_id = max_id + 1
        dest_folder_path = os.path.join(target_directory, str(new_id))
        
        shutil.move(src_folder_path, dest_folder_path)
        print(f"Moved {src_folder_path} to {dest_folder_path}")

if __name__ == "__main__":
    current_directory = os.path.dirname(os.path.abspath(__file__))
    parent_directory = os.path.dirname(current_directory)
    grandparent_directory = os.path.dirname(parent_directory)
    great_grandparent_directory = os.path.dirname(grandparent_directory)
    steam_models_directory = os.path.join(great_grandparent_directory, 'steam_models')
    
    move_folders_up_and_rename_if_needed(current_directory, steam_models_directory)
    
    # Run the "changeTS.py" script
    subprocess.run(["python", "changeTS.py"], cwd=steam_models_directory)
