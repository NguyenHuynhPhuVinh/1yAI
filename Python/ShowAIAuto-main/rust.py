import os
from dotenv import load_dotenv
import requests
import json

# Load biến môi trường từ file .env
load_dotenv()

# Sử dụng biến môi trường
os.environ["AGENTQL_API_KEY"] = os.getenv("AGENTQL_API_KEY")

import agentql
from playwright.sync_api import sync_playwright

def scrape_toolify():
    results = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True
        )
        page = agentql.wrap(browser.new_page())
        page.goto("https://vnexpress.net/so-hoa/cong-nghe/ai")

        TOOLS_QUERY = """
        {
            articles[] {
                title
                link
                description
            }
        }
        """

        response = page.query_data(TOOLS_QUERY)
        
        if isinstance(response, dict) and 'articles' in response:
            articles = response['articles']
            if isinstance(articles, list):
                for article in articles:
                    if isinstance(article, dict):
                        description = article.get('description', '')
                        if len(description) > 255:
                            description = description[:252] + '...'
                            
                        results.append({
                            "title": article.get('title', ''),
                            "link": article.get('link', ''),
                            "description": description
                        })
        
        browser.close()
    return results

if __name__ == '__main__':
    try:
        # Lấy danh sách bài viết hiện có từ API
        existing_articles = set()
        get_url = "https://showairust.onrender.com/articles/all"
        get_response = requests.get(get_url)
        
        if get_response.status_code == 200:
            data = get_response.json()
            for article in data['articles']:
                existing_articles.add(article['title'])
            print(f"Đã tìm thấy {len(existing_articles)} bài viết trong database")
        
        # Scrape dữ liệu mới
        new_results = scrape_toolify()
        
        # Lọc bỏ các bài viết đã tồn tại
        filtered_results = [
            article for article in new_results 
            if article['title'] not in existing_articles
        ]
        
        if not filtered_results:
            print("\nKhông có bài viết mới để thêm vào")
            exit()
            
        print(f"\nTìm thấy {len(filtered_results)} bài viết mới:")
        for article in filtered_results:
            print(f"\nTiêu đề: {article['title']}")
            print(f"Mô tả: {article['description']}")
            print(f"Link: {article['link']}")
            
        # Gửi những bài viết mới đến API
        post_url = "https://showairust.onrender.com/articles"
        data = {
            "articles": filtered_results
        }
        
        headers = {
            'Content-Type': 'application/json; charset=utf-8'
        }
        post_response = requests.post(
            post_url, 
            data=json.dumps(data, ensure_ascii=False).encode('utf-8'), 
            headers=headers
        )
        
        if post_response.status_code == 200:
            print(f"\nĐã thêm thành công {len(filtered_results)} bài viết mới")
        else:
            print("\nLỗi khi gửi đến API:", post_response.status_code)
            
    except Exception as e:
        print(f"Có lỗi xảy ra: {str(e)}")
