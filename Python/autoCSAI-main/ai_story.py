import requests
from typing import Dict, List, Any
import json
import base64
import os
from dotenv import load_dotenv

load_dotenv()
    

class StoryGenerator:
    def __init__(self, base_url: str = os.getenv("BASE_URL"), 
                 api_key: str = os.getenv("GEMINI_API_KEY"),
                 together_api_key: str = os.getenv("TOGETHER_API_KEY")):
        self.base_url = base_url
        self.api_key = api_key
        self.together_api_key = together_api_key

    def generate_story_and_cover(self, prompt: str, categories: List[int], tags: List[int]) -> Dict:
        """
        Tạo ý tưởng truyện và ảnh bìa
        """
        try:
            # 1. Tạo ý tưởng truyện
            story_idea = self.generate_story(prompt, categories, tags)
            
            # 2. Tạo prompt cho ảnh bìa
            cover_prompt = self.generate_cover_prompt(story_idea)
            
            # 3. Tạo ảnh bìa
            cover_image = self.generate_cover_image(cover_prompt)
            
            # 4. Kết hợp kết quả
            result = {
                **story_idea,
                "coverImage": cover_image,
                "imagePrompt": cover_prompt
            }
            
            return result
            
        except Exception as e:
            raise Exception(f"Lỗi trong quá trình tạo truyện và ảnh bìa: {str(e)}")

    def generate_story(self, prompt: str, categories: List[int], tags: List[int]) -> Dict:
        """
        Tạo ý tưởng truyện bằng AI
        """
        try:
            payload = {
                "prompt": prompt,
                "categories": categories,
                "tags": tags
            }
            
            if self.api_key:
                payload["apiKey"] = self.api_key
            
            response = requests.post(
                f"{self.base_url}/api/ai/story",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                error_msg = response.json().get("error", "Lỗi khi tạo truyện")
                raise Exception(error_msg)
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

    def generate_cover_prompt(self, story_info: Dict) -> Dict:
        """
        Tạo prompt cho ảnh bìa
        """
        try:
            payload = {
                "storyInfo": {
                    "title": story_info["title"],
                    "description": story_info["description"],
                    "mainCategory": story_info["mainCategory"],
                    "tags": story_info["suggestedTags"]
                }
            }

            if self.api_key:
                payload["apiKey"] = self.api_key
            
            response = requests.post(
                f"{self.base_url}/api/ai/cover-prompt",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                error_msg = response.json().get("error", "Lỗi khi tạo prompt ảnh bìa")
                raise Exception(error_msg)
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

    def generate_cover_image(self, prompt_data: Dict) -> str:
        """
        Tạo ảnh bìa từ prompt
        """
        try:
            payload = {
                "prompt": prompt_data["prompt"],
                "negativePrompt": prompt_data["negativePrompt"],
                "type": "cover"
            }
            
            if self.together_api_key:
                payload["apiKey"] = self.together_api_key
            
            response = requests.post(
                f"{self.base_url}/api/together/generate",
                json=payload,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                return response.json()["imageData"]
            else:
                error_msg = response.json().get("error", "Lỗi khi tạo ảnh bìa")
                raise Exception(error_msg)
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

    def get_categories_and_tags(self) -> Dict[str, List[int]]:
        """
        Lấy danh sách ID của tất cả thể loại và tag
        """
        try:
            response = requests.get(f"{self.base_url}/api/categories")
            
            if response.status_code == 200:
                data = response.json()
                category_ids = [cat["id"] for cat in data["mainCategories"]]
                tag_ids = [tag["id"] for tag in data["tags"]]
                
                return {
                    "category_ids": category_ids,
                    "tag_ids": tag_ids
                }
            else:
                raise Exception("Không thể lấy danh sách thể loại và tag")
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Lỗi kết nối: {str(e)}")

def main():
    # Khởi tạo generator với API key
    api_key = os.getenv("GEMINI_API_KEY")
    together_api_key = os.getenv("TOGETHER_API_KEY")
    generator = StoryGenerator(api_key=api_key, together_api_key=together_api_key)
    
    try:
        # Bước 1: Lấy tất cả ID của thể loại và tag
        print("Đang lấy thông tin thể loại và tag...")
        ids = generator.get_categories_and_tags()
        
        # Bước 2: Nhập ý tưởng truyện
        prompt = input("\nNhập ý tưởng truyện của bạn: ")
        
        # Bước 3: Tạo truyện và ảnh bìa
        print("\nĐang tạo ý tưởng truyện và ảnh bìa...")
        result = generator.generate_story_and_cover(
            prompt=prompt,
            categories=ids["category_ids"],
            tags=ids["tag_ids"]
        )
        
        # In kết quả
        print("\nKết quả từ AI:")
        story_data = {
            "title": result["title"],
            "description": result["description"],
            "mainCategory": result["mainCategory"],
            "suggestedTags": result["suggestedTags"]
        }
        print("\nThông tin truyện:")
        print(json.dumps(story_data, ensure_ascii=False, indent=2))
        
        # Lưu dữ liệu JSON vào file
        with open("story.json", "w", encoding="utf-8") as f:
            json.dump(story_data, f, ensure_ascii=False, indent=2)
        print("\nĐã lưu thông tin truyện vào file 'story.json'")
        
        # Lưu ảnh bìa
        if result["coverImage"]:
            image_data = base64.b64decode(result["coverImage"])
            with open("story.jpg", "wb") as f:
                f.write(image_data)
            print("\nĐã lưu ảnh bìa vào file 'story.jpg'")
        
    except Exception as e:
        print(f"Lỗi: {str(e)}")

if __name__ == "__main__":
    main()