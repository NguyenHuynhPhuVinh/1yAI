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
        page.goto("https://www.toolify.ai/vi/new")

        TOOLS_QUERY = """
        {
            newly_launched {
                ai_tools[] {
                    name
                    link_ai_tool
                    description 
                    tags[]
                }
            }
        }
        """

        response = page.query_data(TOOLS_QUERY)
        
        # In ra JSON gốc từ API
        print("\nDữ liệu JSON gốc từ API:")
        print(response)
        print("\n" + "="*50 + "\n")
        
        if isinstance(response, dict) and 'newly_launched' in response:
            tools = response['newly_launched']['ai_tools']
            if isinstance(tools, list):
                for tool in tools:
                    if isinstance(tool, dict):
                        # Cắt description xuống 255 ký tự nếu dài hơn
                        description = tool.get('description', '')
                        if len(description) > 255:
                            description = description[:252] + '...'
                            
                        results.append({
                            "name": tool.get('name', ''),
                            "description": description,
                            "tags": tool.get('tags', []),
                            "link_ai_tool": tool.get('link_ai_tool', '')
                        })
            elif isinstance(tools, dict):
                description = tools.get('description', '')
                if len(description) > 255:
                    description = description[:252] + '...'
                    
                results.append({
                    "name": tools.get('name', ''),
                    "description": description,
                    "tags": tools.get('tags', []),
                    "link_ai_tool": tools.get('link_ai_tool', '')
                })
        
        browser.close()
    return results

if __name__ == '__main__':
    try:
        # Lấy danh sách công cụ hiện có từ API
        existing_tools = set()
        get_url = "https://showaisb.onrender.com/api/newly-launched/all"
        get_response = requests.get(get_url)
        
        if get_response.status_code == 200:
            data = get_response.json()
            for item in data:
                for tool in item['aiTools']:
                    existing_tools.add(tool['name'])
            print(f"Đã tìm thấy {len(existing_tools)} công cụ trong database")
        
        # Scrape dữ liệu mới
        new_results = scrape_toolify()
        
        # Lọc bỏ các công cụ đã tồn tại
        filtered_results = [
            tool for tool in new_results 
            if tool['name'] not in existing_tools
        ]
        
        if not filtered_results:
            print("\nKhông có công cụ mới để thêm vào")
            exit()
            
        print(f"\nTìm thấy {len(filtered_results)} công cụ mới:")
        for tool in filtered_results:
            print(f"\nTên: {tool['name']}")
            print(f"Mô tả: {tool['description']}")
            print(f"Tags: {', '.join(tool['tags'])}")
            print(f"Link: {tool['link_ai_tool']}")
            
        # Gửi chỉ những công cụ mới đến API
        post_url = "https://showaisb.onrender.com/api/newly-launched"
        data = {
            "aiTools": filtered_results
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
            print(f"\nĐã thêm thành công {len(filtered_results)} công cụ mới:", post_response.json())
        else:
            print("\nLỗi khi gửi đến API:", post_response.status_code)
            
    except Exception as e:
        print(f"Có lỗi xảy ra: {str(e)}")
