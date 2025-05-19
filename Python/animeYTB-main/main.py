import requests
from moviepy.editor import *
from moviepy.config import change_settings
import os
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime, timedelta
import time
import os.path
from google.auth.transport.requests import Request
from youtube_uploader import upload_to_youtube  # Thêm dòng này
from video_processor import create_anime_video  # Thêm dòng này
from gemini_handler import GeminiHandler
import google.generativeai as genai
from config import GEMINI_API_KEY

# Khởi tạo Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://animeytb-9ddc8-default-rtdb.asia-southeast1.firebasedatabase.app/'
})

def get_anime_info(anime_id):
    # Gọi Jikan API
    url = f"https://api.jikan.moe/v4/anime/{anime_id}"
    response = requests.get(url)
    data = response.json()
    
    return data['data']

def get_anime_season():
    current_date = datetime.now()
    # Lùi lại 1 mùa bằng cách trừ đi 3 tháng
    adjusted_date = current_date - timedelta(days=90)
    current_month = adjusted_date.month
    current_year = adjusted_date.year
    
    # Xác định mùa dựa vào tháng đã điều chỉnh
    if current_month in [1, 2, 3]:
        season = 'winter'
    elif current_month in [4, 5, 6]:
        season = 'spring'
    elif current_month in [7, 8, 9]:
        season = 'summer'
    else:
        season = 'fall'
        
    return current_year, season

def get_previous_season(year, season):
    seasons = ['winter', 'spring', 'summer', 'fall']
    current_idx = seasons.index(season)
    
    if current_idx == 0:  # Nếu là mùa winter
        return year - 1, seasons[-1]  # Trả về năm trước và mùa fall
    else:
        return year, seasons[current_idx - 1]

def check_season_completed(year, season):
    ref = db.reference(f'/completed_seasons/{year}/{season}')
    return ref.get() is not None

def mark_season_completed(year, season):
    ref = db.reference(f'/completed_seasons/{year}/{season}')
    ref.set({
        'completed_at': datetime.now().isoformat()
    })

def get_seasonal_anime():
    year, season = get_anime_season()
    
    while True:
        if check_season_completed(year, season):
            print(f"Mùa {season} {year} đã hoàn thành, chuyển sang mùa trước")
            year, season = get_previous_season(year, season)
            continue
            
        try:
            url = f"https://api.jikan.moe/v4/seasons/{year}/{season}"
            print(f"Đang lấy danh sách anime mùa {season} {year}")
            response = requests.get(url, timeout=30)
            data = response.json()
            anime_list = [anime for anime in data['data'] if anime['type'] == 'TV']
            
            # Nếu tất cả anime trong mùa đã được xử lý
            if all(check_anime_in_database(anime['mal_id']) for anime in anime_list):
                print(f"Tất cả anime trong mùa {season} {year} đã được xử lý")
                mark_season_completed(year, season)
                year, season = get_previous_season(year, season)
                continue
                
            return anime_list
            
        except requests.exceptions.RequestException as e:
            print(f"Lỗi khi kết nối với API: {e}")
            time.sleep(5)
            continue

def check_anime_in_database(anime_id):
    # Kiểm tra xem anime đã có trong database chưa
    ref = db.reference(f'/anime/{anime_id}')
    return ref.get() is not None

def save_to_database(anime_id, anime_info, video_path, youtube_video_id):
    # Lưu thông tin anime và đường dẫn video vào database
    ref = db.reference(f'/anime/{anime_id}')
    ref.set({
        'title': anime_info['title'],
        'synopsis': anime_info['synopsis'],
        'video_path': video_path,
        'youtube_video_id': youtube_video_id,
        'created_at': datetime.now().isoformat()
    })

def check_jikan_api():
    try:
        response = requests.get("https://api.jikan.moe/v4/anime/1", timeout=10)
        if response.status_code == 200:
            print("✓ API Jikan hoạt động bình thường")
            return True
        else:
            print("✗ API Jikan không phản hồi đúng cách")
            return False
    except requests.exceptions.RequestException as e:
        print(f"✗ Không thể kết nối đến API Jikan: {e}")
        return False

def check_gemini_api():
    try:
        # Cấu hình và test Gemini
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        response = model.generate_content("Xin chào, đây là tin nhắn test.")
        
        if response and response.text:
            print("✓ API Gemini hoạt động bình thường")
            return True
        else:
            print("✗ API Gemini không phản hồi đúng cách")
            return False
            
    except Exception as e:
        print(f"✗ Không thể kết nối đến API Gemini: {e}")
        return False

def main(upload_to_youtube_enabled=False):
    # Kiểm tra API trước khi chạy
    if not check_jikan_api():
        print("Dừng chương trình do API Jikan không hoạt động")
        return

    if not check_gemini_api():
        print("Dừng chương trình do API Gemini không hoạt động")
        return
        
    # Khởi tạo GeminiHandler sau khi đã kiểm tra API thành công
    gemini = GeminiHandler()
    
    # Tạo thư mục videos nếu chưa tồn tại
    if not os.path.exists('videos'):
        os.makedirs('videos')
        
    seasonal_anime = get_seasonal_anime()
    
    # Tìm anime đầu tiên chưa được xử lý
    for anime in seasonal_anime:
        try:
            anime_id = anime['mal_id']
            
            if not check_anime_in_database(anime_id):
                print(f"Đang xử lý anime: {anime['title']}")
                
                anime_info = get_anime_info(anime_id)
                video_path = create_anime_video(anime_info, gemini)
                
                youtube_video_id = None
                if upload_to_youtube_enabled:
                    try:
                        # Tính toán độ dài tối đa cho tên anime
                        suffix = " - AI Phân tích Anime"  # 20 ký tự
                        max_title_length = 100 - len(suffix)  # 80 ký tự cho tên anime
                        
                        # Tạo tiêu đề với độ dài phù hợp
                        anime_title = anime_info['title']
                        if len(anime_title) > max_title_length:
                            anime_title = anime_title[:max_title_length-3] + "..."
                        
                        video_title = f"{anime_title}{suffix}"
                        
                        # Thêm tiêu đề gốc vào phần mô tả
                        video_description = (
                            f"Anime: {anime_info['title']}\n\n"
                            "Đây là video phân tích Anime được tạo tự động bằng AI"
                        )
                        
                        youtube_video_id = upload_to_youtube(video_path, video_title, video_description)
                        print(f"Đã upload video lên YouTube với ID: {youtube_video_id}")
                    except Exception as upload_error:
                        print(f"Lỗi khi upload video lên YouTube: {upload_error}")
                        return
                else:
                    print("Bỏ qua bước upload YouTube (đã tắt)")
                
                save_to_database(anime_id, anime_info, video_path, youtube_video_id)
                print(f"Đã hoàn thành xử lý anime: {anime['title']}")
                break
            else:
                print(f"Anime {anime['title']} đã tồn tại trong database")
                
        except Exception as e:
            print(f"Lỗi khi xử lý anime {anime['title']}: {e}")
            continue

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Tạo và upload video anime preview')
    parser.add_argument('--upload', 
                       action='store_true',
                       help='Bật tính năng upload lên YouTube')
    
    args = parser.parse_args()
    main(upload_to_youtube_enabled=args.upload)