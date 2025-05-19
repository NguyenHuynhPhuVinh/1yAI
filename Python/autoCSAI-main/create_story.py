import requests
import json
import base64
import os
from dotenv import load_dotenv
from typing import Dict, List, Any

load_dotenv()

class StoryCreator:
    def __init__(self, base_url: str = os.getenv("BASE_URL")):
        self.base_url = base_url
        self.session = requests.Session()
        self.user_data = None

    def login(self, email: str, password: str) -> Dict:
        """Đăng nhập và lưu session"""
        try:
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json={"email": email, "password": password}
            )
            
            if response.status_code == 200:
                self.user_data = response.json()["user"]
                return self.user_data
            else:
                raise Exception(response.json().get("error", "Đăng nhập thất bại"))
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

    def create_story(self, story_data: Dict, cover_image_path: str) -> Dict:
        """Tạo truyện mới với thông tin và ảnh bìa"""
        try:
            # Chuẩn bị form data
            form_data = {
                "title": story_data["title"],
                "description": story_data["description"],
                "mainCategoryId": story_data["mainCategory"],
                "tagIds": json.dumps(story_data["suggestedTags"]),
                "userId": str(self.user_data["user_id"])
            }

            print("Dữ liệu gửi đi:", form_data)

            # Thêm ảnh bìa nếu có
            files = None
            if cover_image_path and os.path.exists(cover_image_path):
                files = {
                    "coverImage": ("cover.jpg", open(cover_image_path, "rb"), "image/jpeg")
                }

            # Sử dụng API endpoint mới với API key
            headers = {
                "x-api-key": os.getenv("CHATSTORYAI_API_KEY")
            }

            response = self.session.post(
                f"{self.base_url}/api/stories/create-with-key",
                data=form_data,
                files=files,
                headers=headers
            )

            if response.status_code == 201:
                return response.json()
            else:
                error_msg = response.json().get("error", "Tạo truyện thất bại")
                print("Response error:", error_msg)
                raise Exception(error_msg)

        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

    def create_chapter(self, story_id: int, title: str, summary: str) -> Dict:
        """Tạo chương mới cho truyện"""
        try:
            headers = {
                "Content-Type": "application/json",  # Thêm header Content-Type
                "x-api-key": os.getenv("CHATSTORYAI_API_KEY")
            }
        
            chapter_data = {
                "title": title,
                "summary": summary,
                "status": "draft"  # Mặc định là bản nháp
            }
        
            response = self.session.post(
                f"{self.base_url}/api/stories/{story_id}/chapters",
                json=chapter_data,
                headers=headers
            )
        
            if response.status_code in [200, 201]:  # Chấp nhận cả 200 và 201
                return response.json()
            else:
                error_msg = response.json().get("error", "Tạo chương thất bại")
                print("Response error:", error_msg)
                # In thêm response để debug
                print("Response status:", response.status_code)
                print("Response full:", response.text)
                raise Exception(error_msg)
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

    def create_dialogue(self, chapter_id: int, content: str, type: str = 'dialogue', character_id: int = None) -> Dict:
        """Tạo dialogue mới cho chương"""
        try:
            headers = {
                "Content-Type": "application/json",
                "x-api-key": os.getenv("CHATSTORYAI_API_KEY")
            }
            
            # Lấy order_number lớn nhất hiện tại
            response = self.session.get(
                f"{self.base_url}/api/stories/0/chapters/{chapter_id}/dialogues",
                headers=headers
            )
            
            if response.status_code != 200:
                raise Exception("Không thể lấy danh sách dialogue")
            
            dialogues = response.json()["dialogues"]
            next_order = 1
            if dialogues:
                next_order = max(d["order_number"] for d in dialogues) + 1
            
            # Tạo dialogue mới
            dialogue_data = {
                "content": content,
                "type": type,
                "order_number": next_order,
                "character_id": character_id  # Có thể là None
            }
            
            response = self.session.post(
                f"{self.base_url}/api/stories/0/chapters/{chapter_id}/dialogues",
                json=dialogue_data,
                headers=headers
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                print("Response full:", result)
                return result
            else:
                error_msg = response.json().get("error", "Tạo dialogue thất bại")
                print("Response status:", response.status_code)
                print("Response full:", response.text)
                raise Exception(error_msg)
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

    def publish_chapter(self, story_id: int, chapter_id: int) -> Dict:
        """Cập nhật trạng thái chapter thành published"""
        try:
            headers = {
                "x-api-key": os.getenv("CHATSTORYAI_API_KEY")
            }
            
            update_data = {
                "status": "published",
                "title": "Chương 1: Test báo cáo",  # Giữ nguyên title
                "summary": "Test"  # Giữ nguyên summary
            }
            
            response = self.session.put(
                f"{self.base_url}/api/stories/{story_id}/chapters/{chapter_id}",
                json=update_data,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"Cập nhật chapter thành công! Status: {result['chapter']['status']}")
                return result
            else:
                error_msg = response.json().get("error", "Cập nhật chapter thất bại")
                print("Response error:", error_msg)
                raise Exception(error_msg)
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")
        
    def publish_story(self, story_id: int) -> Dict:
        """Xuất bản truyện"""
        try:
            headers = {
                "x-api-key": os.getenv("CHATSTORYAI_API_KEY")
            }
            
            response = self.session.put(
                f"{self.base_url}/api/stories/{story_id}/publish",
                headers=headers
            )
        
            if response.status_code == 200:
                result = response.json()
                print(f"Xuất bản truyện thành công!")
                return result
            else:
                error_msg = response.json().get("error", "Xuất bản truyện thất bại")
                print("Response error:", error_msg)
                raise Exception(error_msg)
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

def main():
    creator = StoryCreator()
    
    try:
        # Bước 1: Đăng nhập
        print("Đang đăng nhập...")
        user = creator.login("tomisakae@gmail.com", "tomisakae0000")
        print(f"Đăng nhập thành công với user ID: {user['user_id']}")

        # Bước 2: Đọc thông tin truyện từ file JSON
        with open("story.json", "r", encoding="utf-8") as f:
            story_data = json.load(f)

        # Bước 3: Tạo truyện mới
        print("\nĐang tạo truyện mới...")
        result = creator.create_story(story_data, "story.jpg")
        story_id = result['storyId']
        print(f"Tạo truyện thành công! Story ID: {story_id}")

        # Tạo chương đầu tiên
        print("\nĐang tạo chương mới...")
        chapter_result = creator.create_chapter(
            story_id=story_id,
            title="Chương 1: Test báo cáo",
            summary="Test"
        )
        chapter_id = chapter_result['chapter_id']
        print(f"Tạo chương thành công! Chapter ID: {chapter_id}")

        # Tạo dialogue
        print("\nĐang tạo dialogue mới...")
        dialogue_result = creator.create_dialogue(
            chapter_id=chapter_id,
            content="Test",
            type="aside"
        )
        print(f"Tạo dialogue thành công!")

        # Xuất bản chapter
        print("\nĐang xuất bản chapter...")
        publish_chapter_result = creator.publish_chapter(
            story_id=story_id,
            chapter_id=chapter_id
        )
        print("Xuất bản chapter thành công!")

        # Xuất bản truyện
        print("\nĐang xuất bản truyện...")
        publish_story_result = creator.publish_story(story_id)
        print("Xuất bản truyện thành công!")

    except Exception as e:
        print(f"Lỗi: {str(e)}")

if __name__ == "__main__":
    main()