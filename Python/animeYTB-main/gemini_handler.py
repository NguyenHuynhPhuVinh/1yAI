import google.generativeai as genai
from config import GEMINI_API_KEY
import json

class GeminiHandler:
    def __init__(self):
        # Cấu hình Gemini
        self.generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "application/json",
        }

        self.safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE",
            },
        ]

        genai.configure(api_key=GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config=self.generation_config,
            safety_settings=self.safety_settings
        )

    def summarize_synopsis(self, synopsis, max_words=100):
        chat = self.model.start_chat(history=[])
        prompt = f"""
        Hãy tóm tắt nội dung anime sau đây bằng tiếng việt và trả về dưới dạng JSON với format:
        {{
            "summary": "<tóm tắt trong khoảng {max_words} từ>"
        }}
        
        Nội dung cần tóm tắt:
        {synopsis}
        """
        response = chat.send_message(prompt)
        try:
            result = json.loads(response.text)
            return result["summary"]
        except:
            return response.text

    def analyze_anime(self, anime_info):
        chat = self.model.start_chat(history=[])
        prompt = f"""
        Hãy phân tích chi tiết anime sau đây bằng tiếng việt và trả về kết quả dưới dạng JSON với format:
        {{
            "strengths_weaknesses": {{
                "strengths": [
                    "<điểm mạnh 1 (20-30 từ, chi tiết)>",
                    "<điểm mạnh 2 (20-30 từ, chi tiết)>"
                ],
                "weaknesses": [
                    "<điểm yếu 1 (20-30 từ, chi tiết)>",
                    "<điểm yếu 2 (20-30 từ, chi tiết)>"
                ]
            }},
            "target_audience": {{
                "age_groups": ["<nhóm tuổi phù hợp>"],
                "interests": ["<sở thích liên quan>"],
                "description": "<mô tả chi tiết về đối tượng khán giả (70-100 từ)>"
            }},
            "similar_anime": [
                {{
                    "title": "<tên anime>",
                    "comparison": "<so sánh chi tiết (40-50 từ)>"
                }},
                {{
                    "title": "<tên anime>",
                    "comparison": "<so sánh chi tiết (40-50 từ)>"
                }}
            ],
            "overall_rating": {{
                "score": <điểm số từ 1-10>,
                "summary": "<nhận xét tổng quan chi tiết (80-100 từ)>"
            }}
        }}
        
        Thông tin anime:
        Tên: {anime_info['title']}
        Thể loại: {', '.join(genre['name'] for genre in anime_info.get('genres', []))}
        Synopsis: {anime_info['synopsis']}
        Điểm số MAL: {anime_info.get('score', 'N/A')}
        Số tập: {anime_info.get('episodes', 'N/A')}
        Studio: {', '.join(studio['name'] for studio in anime_info.get('studios', []))}
        """
        
        response = chat.send_message(prompt)
        try:
            return json.loads(response.text)
        except:
            return None