from flask import Flask, jsonify
import requests
import logging
import sys
from datetime import datetime

app = Flask(__name__)

logging.basicConfig(
    stream=sys.stdout,
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def fetch_articles():
    try:
        # Sử dụng API proxy miễn phí
        target_url = "https://showairust.onrender.com/articles"
        proxy_url = f"https://api.allorigins.win/raw?url={target_url}"
        
        logger.info(f"Bắt đầu gọi API qua proxy: {proxy_url}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(
            proxy_url,
            headers=headers,
            timeout=30
        )
        
        logger.info(f"Mã phản hồi: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"Lấy thành công {len(data['articles'])} bài viết")
            return data['articles']
        else:
            logger.error(f"API trả về lỗi: {response.status_code}")
            logger.error(f"Nội dung lỗi: {response.text}")
            return None
            
    except Exception as e:
        logger.error(f"Lỗi không xác định: {str(e)}", exc_info=True)
        return None

@app.route('/')
def home():
    return "Ứng dụng crawl dữ liệu đang chạy!"

@app.route('/crawl')
def crawl():
    try:
        articles = fetch_articles()
        if articles:
            return jsonify({
                "status": "success",
                "message": "Crawl dữ liệu thành công",
                "data": articles
            })
        return jsonify({
            "status": "error",
            "message": "Không thể crawl dữ liệu"
        }), 500
    except Exception as e:
        logger.error(f"Lỗi trong endpoint /crawl: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
