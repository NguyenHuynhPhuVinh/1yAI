import uiautomation as auto
import time

def print_control_tree(control, level=0, max_depth=10):
    """In ra cây control chi tiết"""
    if level > max_depth:
        return
        
    indent = "  " * level
    try:
        print(f"{indent}Control: '{control.Name}' ({control.ClassName})")
        print(f"{indent}Type: {control.ControlTypeName}")
        print(f"{indent}AutomationId: {control.AutomationId}")
        print(f"{indent}---")
        
        for child in control.GetChildren():
            print_control_tree(child, level + 1, max_depth)
    except Exception as e:
        print(f"{indent}Error: {e}")

def find_chat_content(control, messages=None, level=0, max_depth=20):
    """Tìm nội dung chat một cách đệ quy"""
    if messages is None:
        messages = []
    if level > max_depth:
        return messages
        
    try:
        # Kiểm tra nếu control hiện tại chứa text
        if control.Name and control.ControlTypeName == "TextControl":
            # Lọc ra những text có ý nghĩa
            if (len(control.Name) > 1 and 
                not control.Name.isdigit() and 
                control.Name not in ['giờ', 'phút', 'ngày', 'Bạn:', ' ']):
                messages.append(control.Name)
        
        # Duyệt qua các control con
        for child in control.GetChildren():
            find_chat_content(child, messages, level + 1, max_depth)
            
    except Exception as e:
        print(f"Lỗi khi đọc control: {e}")
        
    return messages

def find_zalo_window():
    """Tìm cửa sổ Zalo"""
    print("Đang tìm kiếm cửa sổ Zalo...")
    
    # Tìm tất cả cửa sổ Chrome_WidgetWin_1
    chrome_windows = auto.PaneControl(ClassName="Chrome_WidgetWin_1")
    
    # Tìm cửa sổ Zalo trong số các cửa sổ Chrome
    for window in chrome_windows.GetChildren():
        try:
            name = window.Name
            class_name = window.ClassName
            print(f"Kiểm tra cửa sổ: '{name}' (ClassName: {class_name})")
            
            # Kiểm tra nếu là cửa sổ Zalo
            if "Zalo" in name:
                print(f"\nĐã tìm thấy cửa sổ Zalo!")
                print(f"Name: {name}")
                print(f"ClassName: {class_name}")
                return window
                
        except Exception as e:
            print(f"Lỗi khi đọc cửa sổ: {e}")
            continue
    
    print("\nKhông tìm thấy cửa sổ Zalo!")
    return None

if __name__ == "__main__":
    # Đợi Zalo khởi động
    print("Đợi 3 giây để đảm bảo Zalo đã khởi động...")
    time.sleep(3)
    
    # Tìm cửa sổ Zalo
    zalo_window = find_zalo_window()
    
    if zalo_window:
        print("\nĐang phân tích cấu trúc cửa sổ...")
        print_control_tree(zalo_window)
        
        print("\nĐang tìm nội dung chat...")
        messages = find_chat_content(zalo_window)
        
        if messages:
            print("\nCác tin nhắn tìm thấy:")
            for msg in messages:
                print(f"- {msg}")
        else:
            print("\nKhông tìm thấy tin nhắn nào!")
    
    print("\nNhấn Enter để thoát...")
    input()
