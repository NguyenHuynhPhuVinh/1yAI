import json
import os
import base64
from datetime import datetime
from typing import List, Dict
from ai_story import StoryGenerator
from create_story import StoryCreator

def load_existing_stories() -> List[Dict]:
    """Đọc các truyện đã có từ random.json"""
    try:
        if os.path.exists("random.json"):
            with open("random.json", "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return []

def save_story_to_random(story_data: Dict):
    """Lưu truyện mới vào random.json"""
    stories = load_existing_stories()
    story_data["created_at"] = datetime.now().isoformat()
    stories.append(story_data)
    
    with open("random.json", "w", encoding="utf-8") as f:
        json.dump(stories, f, ensure_ascii=False, indent=2)

def generate_prompt(existing_stories: List[Dict]) -> str:
    """Tạo prompt với yêu cầu khác biệt từ các truyện đã có"""
    titles = [story["title"] for story in existing_stories]
    titles_str = "\n".join(f"- {title}" for title in titles)
    
    prompt = f"""Tạo truyện mới nhưng khác với những truyện dưới đây:

{titles_str}

Hãy tạo một truyện hoàn toàn độc đáo và khác biệt."""
    
    return prompt

def main():
    # Khởi tạo các đối tượng cần thiết
    generator = StoryGenerator()
    creator = StoryCreator()
    
    try:
        print("=== PHẦN 1: TẠO TRUYỆN MỚI ===")
        # 1. Đọc truyện đã có
        existing_stories = load_existing_stories()
        
        # 2. Tạo prompt
        prompt = generate_prompt(existing_stories)
        print("\nPrompt được tạo:")
        print(prompt)
        
        # 3. Lấy categories và tags
        ids = generator.get_categories_and_tags()
        
        # 4. Tạo truyện mới
        print("\nĐang tạo truyện mới...")
        result = generator.generate_story_and_cover(
            prompt=prompt,
            categories=ids["category_ids"],
            tags=ids["tag_ids"]
        )
        
        # 5. Lưu thông tin truyện
        story_data = {
            "title": result["title"],
            "description": result["description"],
            "mainCategory": result["mainCategory"],
            "suggestedTags": result["suggestedTags"]
        }
        
        # Lưu vào story.json cho create_story.py
        with open("story.json", "w", encoding="utf-8") as f:
            json.dump(story_data, f, ensure_ascii=False, indent=2)
            
        # Lưu vào random.json để theo dõi
        save_story_to_random(story_data)
        
        # 6. Lưu ảnh bìa
        if result["coverImage"]:
            image_data = base64.b64decode(result["coverImage"])
            with open("story.jpg", "wb") as f:
                f.write(image_data)
        
        print("\nĐã tạo xong truyện mới!")
        
        print("\n=== PHẦN 2: ĐĂNG TRUYỆN ===")
        # Bước 1: Đăng nhập
        print("Đang đăng nhập...")
        user = creator.login("tomisakae@gmail.com", "tomisakae0000")
        print(f"Đăng nhập thành công với user ID: {user['user_id']}")

        # Bước 2: Tạo truyện mới
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
        
        print("\n=== HOÀN THÀNH QUY TRÌNH ===")
        
    except Exception as e:
        print(f"Lỗi: {str(e)}")

if __name__ == "__main__":
    main()
