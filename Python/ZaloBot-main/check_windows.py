import uiautomation as auto

def list_all_windows():
    """Liệt kê tất cả các cửa sổ đang mở"""
    print("Danh sách tất cả các cửa sổ đang mở:")
    for window in auto.GetRootControl().GetChildren():
        try:
            if window.Name:
                print(f"Tên cửa sổ: {window.Name}")
                print(f"ClassName: {window.ClassName}")
                print("-" * 50)
        except Exception as e:
            continue

if __name__ == "__main__":
    list_all_windows()
