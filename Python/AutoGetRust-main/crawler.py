import os
import requests
from datetime import datetime
import logging

# Thiết lập logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def fetch_articles():
    try:
        url = "https://showairust.onrender.com/articles"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            logging.info(f"Lấy thành công {len(data['articles'])} bài viết")
            return data['articles']
        else:
            logging.error(f"Lỗi khi gọi API: {response.status_code}")
            return None
            
    except Exception as e:
        logging.error(f"Có lỗi xảy ra: {str(e)}")
        return None

if __name__ == "__main__":
    logging.info("Bắt đầu crawl dữ liệu...")
    articles = fetch_articles()
    if articles:
        logging.info("Hoàn thành crawl dữ liệu")