from moviepy.editor import *
from moviepy.video.fx.all import *
import requests
import numpy as np
import os
import time

def summarize_synopsis(synopsis, model, max_words=100):
    return model.summarize_synopsis(synopsis, max_words)

def ease_out_quad(t):
    return 1 - (1 - t) * (1 - t)

def ease_out_cubic(t):
    return 1 - pow(1 - t, 3)

def ease_out_bounce(t):
    n1 = 7.5625
    d1 = 2.75

    if t < 1 / d1:
        return n1 * t * t
    elif t < 2 / d1:
        t -= 1.5 / d1
        return n1 * t * t + 0.75
    elif t < 2.5 / d1:
        t -= 2.25 / d1
        return n1 * t * t + 0.9375
    else:
        t -= 2.625 / d1
        return n1 * t * t + 0.984375

def sliding_effect(clip, duration=1, side='left', easing='quad'):
    w, h = clip.size
    
    # Chọn easing function
    if easing == 'cubic':
        ease_func = ease_out_cubic
    elif easing == 'bounce':
        ease_func = ease_out_bounce
    else:  # default quad
        ease_func = ease_out_quad
        
    if side == 'left':
        def slide(t):
            if t > duration:
                return ('left', 'center')
            else:
                progress = t/duration
                eased_progress = ease_func(progress)
                return (-w + (w * eased_progress), 'center')
        return clip.set_position(slide)
    return clip

def adjust_fontsize(text, base_size=35):
    """Điều chỉnh kích thước chữ dựa trên độ dài văn bản"""
    length = len(text)
    if length > 500:
        return base_size - 4  # Giảm mạnh hơn cho văn bản rất dài
    elif length > 400:
        return base_size - 3.5
    elif length > 300:
        return base_size - 3
    elif length > 200:
        return base_size - 2.5
    elif length > 150:
        return base_size - 2
    elif length > 100:
        return base_size - 1.5
    elif length > 80:
        return base_size - 1
    elif length > 60:
        return base_size - 0.5
    return base_size

def create_analysis_scenes(W, H, image_width, title_width, image_clip, title_clip, analysis_data):
    scenes = []
    
    # Điều chỉnh các thông số chung
    CONTENT_FONT_SIZE = 28
    LINE_SPACING = 1.2  # Giảm từ 1.5 xuống 1.2
    SCENE_DURATION = 8  # Tăng từ 6 lên 8 giây

    # Cảnh Điểm mạnh & Điểm yếu
    if "strengths_weaknesses" in analysis_data:
        scene_duration = SCENE_DURATION
        intro_duration = 1.5
        
        # Intro
        intro_bg = ColorClip(size=(W, H), color=(30, 30, 40)).set_duration(intro_duration)
        intro_text = TextClip("ĐIỂM MẠNH & ĐIỂM YẾU",
                            fontsize=60,
                            color='white',
                            font='Arial',
                            align='center')
        intro_text = intro_text.set_position('center').set_duration(intro_duration)
        intro_text = intro_text.fx(vfx.fadein, duration=0.5)
        intro_text = intro_text.fx(vfx.resize, lambda t: 1 + 0.1*t)
        scene_intro = CompositeVideoClip([intro_bg, intro_text])
        
        # Main content
        scene_bg = ColorClip(size=(W, H), color=(30, 30, 40)).set_duration(scene_duration)
        image_clip_scene = sliding_effect(
            image_clip.set_duration(scene_duration),
            duration=1,
            easing='cubic'
        )
        title_clip_scene = title_clip.set_duration(scene_duration).fx(vfx.fadein, duration=1)
        
        strengths = analysis_data["strengths_weaknesses"]["strengths"]
        weaknesses = analysis_data["strengths_weaknesses"]["weaknesses"]
        
        # Cập nhật font size và spacing
        TITLE_FONT_SIZE = 55
        HEADING_FONT_SIZE = 35  
        CONTENT_FONT_SIZE = 28
        LINE_SPACING = 1.2
        
        content_text = "🔸 ĐIỂM MẠNH:\n"  # Bỏ \n thừa
        content_text += "\n".join(f"• {s}" for s in strengths)  # Giảm khoảng cách
        content_text += "\n\n🔸 ĐIỂM YẾU:\n"  # Bỏ \n thừa
        content_text += "\n".join(f"• {w}" for w in weaknesses)
        
        content_fontsize = adjust_fontsize(content_text, base_size=28)
        content_clip = TextClip(
            content_text,
            fontsize=content_fontsize,
            color='white',
            size=(title_width, None),
            method='caption',
            font='Arial',
            align='west',
            interline=LINE_SPACING
        ).set_duration(scene_duration)
        
        content_clip = content_clip.set_position((image_width + 20, 150))
        content_clip = content_clip.fx(vfx.fadein, duration=1)
        
        scene_main = CompositeVideoClip([scene_bg, image_clip_scene, title_clip_scene, content_clip])
        scenes.append(create_crossfade(scene_intro, scene_main, cross_duration=0.5))
    
    # Cảnh Đối tượng khán giả
    if "target_audience" in analysis_data:
        scene_duration = SCENE_DURATION
        intro_duration = 1.5
        
        # Intro
        intro_bg = ColorClip(size=(W, H), color=(35, 35, 45)).set_duration(intro_duration)
        intro_text = TextClip("ĐỐI TƯỢNG KHÁN GIẢ",
                            fontsize=60,
                            color='white',
                            font='Arial',
                            align='center')
        intro_text = intro_text.set_position('center').set_duration(intro_duration)
        intro_text = intro_text.fx(vfx.fadein, duration=0.5)
        intro_text = intro_text.fx(vfx.resize, lambda t: 1 + 0.1*t)
        scene_intro = CompositeVideoClip([intro_bg, intro_text])
        
        # Main content
        scene_bg = ColorClip(size=(W, H), color=(35, 35, 45)).set_duration(scene_duration)
        image_clip_scene = sliding_effect(
            image_clip.set_duration(scene_duration),
            duration=1,
            easing='bounce'
        )
        title_clip_scene = title_clip.set_duration(scene_duration).fx(vfx.fadein, duration=1)
        
        target = analysis_data["target_audience"]
        content_text = "🎯 NHÓM TUỔI:\n"
        content_text += "\n".join(f"• {age}" for age in target["age_groups"])
        content_text += "\n\n🎯 SỞ THÍCH:\n"
        content_text += "\n".join(f"• {interest}" for interest in target["interests"])
        content_text += f"\n\n🎯 MÔ TẢ CHI TIẾT:\n{target['description']}"
        
        content_fontsize = adjust_fontsize(content_text, base_size=28)
        content_clip = TextClip(
            content_text,
            fontsize=content_fontsize,
            color='white',
            size=(title_width, None),
            method='caption',
            font='Arial',
            align='west',
            interline=LINE_SPACING
        ).set_duration(scene_duration)
        
        content_clip = content_clip.set_position((image_width + 20, 150))
        content_clip = content_clip.fx(vfx.fadein, duration=1)
        
        scene_main = CompositeVideoClip([scene_bg, image_clip_scene, title_clip_scene, content_clip])
        scenes.append(create_crossfade(scene_intro, scene_main, cross_duration=0.5))
    
    # Cảnh Anime tương tự
    if "similar_anime" in analysis_data:
        scene_duration = SCENE_DURATION
        intro_duration = 1.5
        
        # Intro
        intro_bg = ColorClip(size=(W, H), color=(40, 40, 50)).set_duration(intro_duration)
        intro_text = TextClip("ANIME TƯƠNG TỰ",
                            fontsize=60,
                            color='white',
                            font='Arial',
                            align='center')
        intro_text = intro_text.set_position('center').set_duration(intro_duration)
        intro_text = intro_text.fx(vfx.fadein, duration=0.5)
        intro_text = intro_text.fx(vfx.resize, lambda t: 1 + 0.1*t)
        scene_intro = CompositeVideoClip([intro_bg, intro_text])
        
        # Main content
        scene_bg = ColorClip(size=(W, H), color=(40, 40, 50)).set_duration(scene_duration)
        image_clip_scene = sliding_effect(
            image_clip.set_duration(scene_duration),
            duration=1,
            easing='cubic'
        )
        title_clip_scene = title_clip.set_duration(scene_duration).fx(vfx.fadein, duration=1)
        
        similar_anime = analysis_data["similar_anime"]
        content_text = "🎬 ANIME TƯƠNG TỰ:\n\n"
        for anime in similar_anime:
            content_text += f"• {anime['title']}\n  {anime['comparison']}\n\n"
        
        content_fontsize = adjust_fontsize(content_text, base_size=28)
        content_clip = TextClip(
            content_text,
            fontsize=content_fontsize,
            color='white',
            size=(title_width, None),
            method='caption',
            font='Arial',
            align='west',
            interline=LINE_SPACING
        ).set_duration(scene_duration)
        
        content_clip = content_clip.set_position((image_width + 20, 150))
        content_clip = content_clip.fx(vfx.fadein, duration=1)
        
        scene_main = CompositeVideoClip([scene_bg, image_clip_scene, title_clip_scene, content_clip])
        scenes.append(create_crossfade(scene_intro, scene_main, cross_duration=0.5))
    
    # Cảnh Đánh giá tổng quan
    if "overall_rating" in analysis_data:
        scene_duration = SCENE_DURATION
        intro_duration = 1.5
        
        # Intro
        intro_bg = ColorClip(size=(W, H), color=(45, 45, 55)).set_duration(intro_duration)
        intro_text = TextClip("ĐÁNH GIÁ TỔNG QUAN",
                            fontsize=60,
                            color='white',
                            font='Arial',
                            align='center')
        intro_text = intro_text.set_position('center').set_duration(intro_duration)
        intro_text = intro_text.fx(vfx.fadein, duration=0.5)
        intro_text = intro_text.fx(vfx.resize, lambda t: 1 + 0.1*t)
        scene_intro = CompositeVideoClip([intro_bg, intro_text])
        
        # Main content
        scene_bg = ColorClip(size=(W, H), color=(45, 45, 55)).set_duration(scene_duration)
        image_clip_scene = sliding_effect(
            image_clip.set_duration(scene_duration),
            duration=1,
            easing='bounce'
        )
        title_clip_scene = title_clip.set_duration(scene_duration).fx(vfx.fadein, duration=1)
        
        rating = analysis_data["overall_rating"]
        content_text = f"⭐ ĐIỂM SỐ: {rating['score']}/10\n\n"
        content_text += f"📝 NHẬN XÉT:\n{rating['summary']}"
        
        content_fontsize = adjust_fontsize(content_text, base_size=28)
        content_clip = TextClip(
            content_text,
            fontsize=content_fontsize,
            color='white',
            size=(title_width, None),
            method='caption',
            font='Arial',
            align='west',
            interline=LINE_SPACING
        ).set_duration(scene_duration)
        
        content_clip = content_clip.set_position((image_width + 20, 150))
        content_clip = content_clip.fx(vfx.fadein, duration=1)
        
        scene_main = CompositeVideoClip([scene_bg, image_clip_scene, title_clip_scene, content_clip])
        scenes.append(create_crossfade(scene_intro, scene_main, cross_duration=0.5))
    
    return scenes

def get_character_images(anime_id):
    """Lấy danh sách ảnh nhân vật từ Jikan API với delay"""
    url = f"https://api.jikan.moe/v4/anime/{anime_id}/characters"
    
    # Thêm delay 2 giây trước khi gọi API
    time.sleep(2)
    
    try:
        response = requests.get(url)
        
        # Kiểm tra status code
        if response.status_code == 429:  # Too Many Requests
            print("API rate limit reached. Waiting 5 seconds...")
            time.sleep(5)  # Đợi thêm 5 giây
            return get_character_images(anime_id)  # Thử lại
            
        data = response.json()
        
        character_images = []
        for char in data.get('data', [])[:6]:  # Giới hạn 6 nhân vật chính
            if char['character']['images']['jpg']['image_url']:
                # Thêm delay 1 giây giữa mỗi lần tải ảnh
                time.sleep(1)
                
                character_images.append({
                    'name': char['character']['name'],
                    'image_url': char['character']['images']['jpg']['image_url'],
                    'role': char['role']
                })
                
        return character_images
        
    except requests.exceptions.RequestException as e:
        print(f"Lỗi khi lấy thông tin nhân vật: {e}")
        time.sleep(5)  # Đợi 5 giây nếu có lỗi
        return []

def create_characters_scene(W, H, image_width, title_width, image_clip, title_clip, characters):
    """Tạo cảnh giới thiệu nhân vật"""
    # Kiểm tra nếu không có nhân vật nào
    if not characters:
        return None
        
    scene_duration = 8
    intro_duration = 1.5
    
    # Intro
    intro_bg = ColorClip(size=(W, H), color=(50, 50, 60)).set_duration(intro_duration)
    intro_text = TextClip("NHÂN VẬT CHÍNH",
                         fontsize=60,
                         color='white',
                         font='Arial',
                         align='center')
    intro_text = intro_text.set_position('center').set_duration(intro_duration)
    intro_text = intro_text.fx(vfx.fadein, duration=0.5)
    intro_text = intro_text.fx(vfx.resize, lambda t: 1 + 0.1*t)
    scene_intro = CompositeVideoClip([intro_bg, intro_text])
    
    # Main content
    scene_bg = ColorClip(size=(W, H), color=(50, 50, 60)).set_duration(scene_duration)
    
    # Thêm image_clip và title_clip vào cảnh
    image_clip_scene = sliding_effect(
        image_clip.set_duration(scene_duration),
        duration=1,
        easing='cubic'
    )
    title_clip_scene = title_clip.set_duration(scene_duration).fx(vfx.fadein, duration=1)
    
    # Điều chỉnh vị trí bắt đầu của grid nhân vật
    y_start = 180  # Tăng giá trị này để dành chỗ cho title_clip
    
    # Tính toán grid dựa trên số lượng nhân vật
    num_chars = len(characters)
    if num_chars <= 3:
        grid_width = num_chars
        grid_height = 1
    elif num_chars <= 6:
        grid_width = 3
        grid_height = (num_chars + 2) // 3  # Làm tròn lên
    
    # Tính toán kích thước và khoảng cách
    char_width = (title_width) // grid_width
    char_height = (H - 200) // grid_height
    
    # Tính toán offset để căn giữa grid
    total_width = grid_width * char_width
    x_offset = image_width + (title_width - total_width) // 2 + 20
    
    char_clips = []
    for i, char in enumerate(characters):
        try:
            # Thêm delay 1 giây trước mỗi lần tải ảnh
            time.sleep(1)
            
            response = requests.get(char['image_url'])
            
            # Kiểm tra status code
            if response.status_code == 429:  # Too Many Requests
                print("API rate limit reached. Waiting 5 seconds...")
                time.sleep(5)
                response = requests.get(char['image_url'])  # Thử lại
                
            temp_path = f"temp_char_{i}.jpg"
            with open(temp_path, "wb") as f:
                f.write(response.content)
                
            char_img = ImageClip(temp_path)
            
            # Tính toán kích thước ảnh với padding
            target_width = char_width - 40  # padding 20px mỗi bên
            target_height = char_height - 60  # để chừa chỗ cho text
            
            # Resize ảnh giữ tỷ lệ
            img_ratio = char_img.w / char_img.h
            if img_ratio > target_width / target_height:  # ảnh quá rộng
                char_img = char_img.resize(width=target_width)
                if char_img.h > target_height:
                    char_img = char_img.resize(height=target_height)
            else:  # ảnh quá cao
                char_img = char_img.resize(height=target_height)
                if char_img.w > target_width:
                    char_img = char_img.resize(width=target_width)
            
            # Tính toán vị trí trong grid với offset
            row = i // grid_width
            col = i % grid_width
            x = x_offset + (col * char_width) + (char_width - char_img.w) // 2  # căn giữa theo chiều ngang
            y = y_start + (row * char_height) + (target_height - char_img.h) // 2  # căn giữa theo chiều dọc
            
            char_img = char_img.set_position((x, y))
            char_img = char_img.set_duration(scene_duration)
            char_img = char_img.fx(vfx.fadein, duration=1)
            
            # Thêm tên nhân vật
            def translate_role(role):
                roles = {
                    'Main': 'Nhân vật chính',
                    'Supporting': 'Nhân vật phụ',
                    'Background': 'Nhân vật nền'
                }
                return roles.get(role, role)
            
            name_text = f"{char['name']}\n({translate_role(char['role'])})"
            name_clip = TextClip(name_text,
                               fontsize=20,
                               color='white',
                               size=(char_width-20, None),
                               method='caption',
                               font='Arial',
                               align='center')
            name_y = y + char_img.h + 10
            name_clip = name_clip.set_position((x_offset + (col * char_width) + 10, name_y))
            name_clip = name_clip.set_duration(scene_duration)
            name_clip = name_clip.fx(vfx.fadein, duration=1)
            
            char_clips.extend([char_img, name_clip])
            os.remove(temp_path)
            
        except requests.exceptions.RequestException as e:
            print(f"Lỗi khi tải ảnh nhân vật {char['name']}: {e}")
            continue
    
    # Kiểm tra nếu không có clip nào được tạo thành công
    if not char_clips:
        return None
        
    # Tạo composite clip với image_clip và title_clip
    scene_main = CompositeVideoClip([scene_bg, image_clip_scene, title_clip_scene] + char_clips)
    
    return create_crossfade(scene_intro, scene_main, cross_duration=0.5)

def create_anime_video(anime_info, model):
    # Tạo tên file an toàn
    safe_title = sanitize_filename(anime_info['title'])
    output_filename = f"videos/{safe_title}.mp4"
    
    # Tải ảnh từ URL
    image_url = anime_info['images']['jpg']['large_image_url']
    response = requests.get(image_url)
    with open("temp_image.jpg", "wb") as f:
        f.write(response.content)
    
    # Thiết lập kích thước video và background
    W, H = 1280, 720
    background = ColorClip(size=(W, H), color=(0, 0, 0))
    background = background.set_duration(8)
    
    # Xử lý ảnh (chiếm 40% chiều rộng màn hình)
    image_width = int(W * 0.4)
    image_clip = ImageClip("temp_image.jpg")
    image_clip = image_clip.resize(width=image_width)
    if image_clip.h > H:
        image_clip = image_clip.resize(height=H)
    image_clip = image_clip.set_position(('left', 'center'))
    image_clip = image_clip.set_duration(8)
    
    # Xử lý tiêu đề
    title_width = W - image_width - 40
    title_fontsize = 35  # Giảm kích thước mặc định xuống 35

    # Điều chỉnh cỡ chữ dựa trên độ dài
    if len(anime_info['title']) > 100:
        title_fontsize = 20
    elif len(anime_info['title']) > 80:
        title_fontsize = 22
    elif len(anime_info['title']) > 60:
        title_fontsize = 25
    elif len(anime_info['title']) > 40:
        title_fontsize = 28
    elif len(anime_info['title']) > 20:
        title_fontsize = 32

    title_clip = TextClip(anime_info['title'], 
                         fontsize=title_fontsize,
                         color='white',
                         size=(title_width, None),
                         method='caption',
                         font='Arial',
                         align='west')
    title_clip = title_clip.set_position((image_width + 20, 50))
    title_clip = title_clip.set_duration(8)
    
    # Sửa phần xử lý synopsis
    synopsis_text = model.summarize_synopsis(anime_info['synopsis'])
    if isinstance(synopsis_text, dict) and 'summary' in synopsis_text:
        synopsis_text = synopsis_text['summary']
    
    synopsis_fontsize = adjust_fontsize(synopsis_text, base_size=30)
    synopsis_clip = TextClip(synopsis_text,
                           fontsize=synopsis_fontsize,
                           color='white',
                           size=(title_width, None),
                           method='caption',
                           font='Arial',
                           align='west')
    synopsis_clip = synopsis_clip.set_position((image_width + 20, 150))
    synopsis_clip = synopsis_clip.set_duration(8)
    
    # Tạo clip cho cảnh 1 - Tóm tắt
    scene1_duration = 8
    scene1_intro_duration = 1.5
    
    # Tạo intro cho cảnh 1
    intro1_bg = ColorClip(size=(W, H), color=(0, 0, 0)).set_duration(scene1_intro_duration)
    intro1_text = TextClip("GIỚI THIỆU ANIME",
                          fontsize=60,
                          color='white',
                          font='Arial',
                          align='center')
    intro1_text = intro1_text.set_position('center').set_duration(scene1_intro_duration)
    intro1_text = intro1_text.fx(vfx.fadein, duration=0.5)
    intro1_text = intro1_text.fx(vfx.resize, lambda t: 1 + 0.1*t)
    scene1_intro = CompositeVideoClip([intro1_bg, intro1_text])
    
    # Tạo nội dung chính cảnh 1
    scene1_bg = ColorClip(size=(W, H), color=(0, 0, 0)).set_duration(scene1_duration)
    image_clip1 = sliding_effect(
        image_clip.set_duration(scene1_duration),
        duration=1.2,
        easing='cubic'
    )
    
    title_clip1 = title_clip.set_duration(scene1_duration)
    title_clip1 = title_clip1.fx(vfx.fadein, duration=1)
    
    synopsis_clip1 = synopsis_clip.set_duration(scene1_duration)
    synopsis_clip1 = synopsis_clip1.fx(vfx.fadein, duration=1.5)
    
    scene1_main = CompositeVideoClip([scene1_bg, image_clip1, title_clip1, synopsis_clip1])
    
    # Thêm transition giữa intro và main
    scene1 = create_crossfade(scene1_intro, scene1_main, cross_duration=0.5)
    
    # Tạo clip cho cảnh 2 - Thông tin chi tiết
    scene2_duration = 6
    scene2_intro_duration = 1.5
    
    # Tạo intro cho cảnh 2
    intro2_bg = ColorClip(size=(W, H), color=(20, 20, 30)).set_duration(scene2_intro_duration)
    intro2_text = TextClip("THÔNG TIN CHI TIẾT",
                          fontsize=60,
                          color='white',
                          font='Arial',
                          align='center')
    intro2_text = intro2_text.set_position('center').set_duration(scene2_intro_duration)
    intro2_text = intro2_text.fx(vfx.fadein, duration=0.5)
    intro2_text = intro2_text.fx(vfx.resize, lambda t: 1 + 0.1*t)
    scene2_intro = CompositeVideoClip([intro2_bg, intro2_text])
    
    # Tạo nội dung chính cảnh 2 với layout mới
    scene2_bg = ColorClip(size=(W, H), color=(20, 20, 30)).set_duration(scene2_duration)
    
    # Sử dụng lại ảnh từ cảnh 1 cho cảnh 2
    image_clip2 = sliding_effect(
        image_clip.set_duration(scene2_duration),
        duration=1,
        easing='bounce'
    )
    
    title_clip2 = title_clip.set_duration(scene2_duration)
    title_clip2 = title_clip2.fx(vfx.fadein, duration=1)
    
    # Tạo text thông tin chi tiết
    def translate_status(status):
        statuses = {
            'Finished Airing': 'Đã hoàn thành',
            'Currently Airing': 'Đang phát sóng',
            'Not yet aired': 'Chưa phát sóng'
        }
        return statuses.get(status, status)
    
    def translate_duration(duration):
        if 'per ep' in duration.lower():
            return duration.replace('per ep', 'mỗi tập')
        return duration
    
    def translate_aired(aired):
        # Thay thế các tháng tiếng Anh bằng tiếng Việt
        months = {
            'Jan': 'Tháng 1', 'Feb': 'Tháng 2', 'Mar': 'Tháng 3',
            'Apr': 'Tháng 4', 'May': 'Tháng 5', 'Jun': 'Tháng 6',
            'Jul': 'Tháng 7', 'Aug': 'Tháng 8', 'Sep': 'Tháng 9',
            'Oct': 'Tháng 10', 'Nov': 'Tháng 11', 'Dec': 'Tháng 12'
        }
        
        for eng, viet in months.items():
            aired = aired.replace(eng, viet)
        return aired.replace('to', 'đến')
    
    def translate_season(season):
        seasons = {
            'Spring': 'Xuân',
            'Summer': 'Hạ',
            'Fall': 'Thu',
            'Winter': 'Đông'
        }
        return seasons.get(season, season)
    
    def translate_rating(rating):
        ratings = {
            'G - All Ages': 'Mọi lứa tuổi',
            'PG - Children': 'Thiếu nhi',
            'PG-13 - Teens 13 or older': '13 tuổi trở lên',
            'R - 17+ (violence & profanity)': '17 tuổi trở lên (bạo lực & ngôn ngữ)',
            'R+ - Mild Nudity': '17+ (cảnh nhạy cảm)',
            'Rx - Hentai': '18+ (nội dung người lớn)'
        }
        return ratings.get(rating, rating)
    
    info_text = f"""
     Điểm số: {anime_info.get('score', 'N/A')}
     Thể loại: {', '.join(genre['name'] for genre in anime_info.get('genres', []))}
     Số tập: {anime_info.get('episodes', 'N/A')}
     Tình trạng: {translate_status(anime_info.get('status', 'N/A'))}
     Studio: {', '.join(studio['name'] for studio in anime_info.get('studios', []))}
     Thời lượng: {translate_duration(anime_info.get('duration', 'N/A'))}
     Thời gian phát sóng: {translate_aired(anime_info.get('aired', {}).get('string', 'N/A'))}
     Mùa: {translate_season(anime_info.get('season', 'N/A'))} {anime_info.get('year', '')}
     Phân loại: {translate_rating(anime_info.get('rating', 'N/A'))}
    """
    
    info_fontsize = adjust_fontsize(info_text, base_size=30)
    info_clip = TextClip(
        info_text,
        fontsize=info_fontsize,
        color='white',
        size=(title_width, None),
        method='caption',
        font='Arial',
        align='west'
    ).set_duration(scene2_duration)
    
    # Đặt vị trí cho info_clip
    info_clip = info_clip.set_position((image_width + 20, 150))
    info_clip = info_clip.fx(vfx.fadein, duration=1)
    
    # Tạo composite clip với cc thành phần đã đơn giản hóa
    scene2_main = CompositeVideoClip([scene2_bg, image_clip2, title_clip2, info_clip])
    
    # Transition giữa intro và main cảnh 2
    scene2 = create_crossfade(scene2_intro, scene2_main, cross_duration=0.5)
    
    # Khởi tạo danh sách cảnh phân tích trước
    analysis_scenes = []
    
    # Thêm cảnh nhân vật
    characters = get_character_images(anime_info['mal_id'])
    if characters:
        characters_scene = create_characters_scene(W, H, image_width, title_width,
                                                image_clip, title_clip, characters)
        if characters_scene:  # Chỉ thêm cảnh nếu tạo thành công
            analysis_scenes.append(characters_scene)
    
    # Thêm các cảnh phân tích khác
    analysis_data = model.analyze_anime(anime_info)
    if analysis_data:
        analysis_scenes.extend(create_analysis_scenes(W, H, image_width, title_width, 
                                                   image_clip, title_clip, analysis_data))
    
    # Tạo clip cho cảnh 4 - Call to action
    scene4_duration = 4
    scene4_bg = ColorClip(size=(W, H), color=(40, 40, 50)).set_duration(scene4_duration)
    
    cta_text = """
    👉 Đăng ký kênh để xem thêm anime hay!
    🔔 Bật thông báo để không bỏ lỡ video mới nhất
    """
    
    cta_text = TextClip(cta_text,
                       fontsize=40,
                       color='white',
                       size=(W-100, None),
                       method='caption',
                       font='Arial',
                       align='center')
    cta_text = cta_text.set_position(('center', 'center'))
    cta_text = cta_text.set_duration(scene4_duration)
    
    # Animation cho Call to Action
    def cta_scale(t):
        # Tạo hiệu ứng pulse mượt mà hơn với easing
        scale = 1 + 0.05 * np.sin(2 * np.pi * t)
        return ease_out_quad(scale)
    
    cta_text = cta_text.fx(vfx.resize, cta_scale)
    
    scene4 = CompositeVideoClip([scene4_bg, cta_text])
    
    # Ghép tất cả các cảnh lại với nhau
    def concatenate_with_crossfade(clips, cross_duration=0.7):
        final_clips = [clips[0]]
        for i in range(1, len(clips)):
            clip = clips[i].set_start(sum(c.duration for c in clips[:i]) - cross_duration)
            clip = clip.crossfadein(cross_duration)
            final_clips.append(clip)
        return CompositeVideoClip(final_clips)

    # Cập nhật phần ghép cảnh
    final_clip = concatenate_with_crossfade([scene1, scene2] + analysis_scenes + [scene4], cross_duration=0.7)
    
    # Xuất video
    final_clip.write_videofile(output_filename,
                             fps=24,
                             codec='libx264')
    return output_filename

def sanitize_filename(filename):
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '')
    return filename.strip()

# Cảnh 1
def create_crossfade(clip1, clip2, cross_duration=0.5):
    clip2 = clip2.set_start(clip1.duration - cross_duration)
    clip2 = clip2.crossfadein(cross_duration)
    return CompositeVideoClip([clip1, clip2])

# Thêm các hàm dịch mới
def translate_status(status):
    statuses = {
        'Finished Airing': 'Đã hoàn thành',
        'Currently Airing': 'Đang phát sóng',
        'Not yet aired': 'Chưa phát sóng'
    }
    return statuses.get(status, status)

def translate_duration(duration):
    if 'per ep' in duration.lower():
        return duration.replace('per ep', 'mỗi tập')
    return duration

def translate_aired(aired):
    # Thay thế các tháng tiếng Anh bằng tiếng Việt
    months = {
        'Jan': 'Tháng 1', 'Feb': 'Tháng 2', 'Mar': 'Tháng 3',
        'Apr': 'Tháng 4', 'May': 'Tháng 5', 'Jun': 'Tháng 6',
        'Jul': 'Tháng 7', 'Aug': 'Tháng 8', 'Sep': 'Tháng 9',
        'Oct': 'Tháng 10', 'Nov': 'Tháng 11', 'Dec': 'Tháng 12'
    }
    
    for eng, viet in months.items():
        aired = aired.replace(eng, viet)
    return aired.replace('to', 'đến')

def translate_season(season):
    seasons = {
        'Spring': 'Xuân',
        'Summer': 'Hạ',
        'Fall': 'Thu',
        'Winter': 'Đông'
    }
    return seasons.get(season, season)

def translate_rating(rating):
    ratings = {
        'G - All Ages': 'Mọi lứa tuổi',
        'PG - Children': 'Thiếu nhi',
        'PG-13 - Teens 13 or older': '13 tuổi trở lên',
        'R - 17+ (violence & profanity)': '17 tuổi trở lên (bạo lực & ngôn ngữ)',
        'R+ - Mild Nudity': '17+ (cảnh nhạy cảm)',
        'Rx - Hentai': '18+ (nội dung người lớn)'
    }
    return ratings.get(rating, rating)