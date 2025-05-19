import json
import os
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request

def get_youtube_credentials():
    SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
    try:
        # Thử đọc token từ environment variable trước
        token_json = os.environ.get('OAUTH_TOKEN')
        
        # Nếu không có env var, thử đọc từ file local
        if not token_json and os.path.exists('oauth_token.json'):
            print("Đọc token từ file oauth_token.json")
            with open('oauth_token.json', 'r') as f:
                token_json = f.read()
        
        if token_json:
            token_data = json.loads(token_json)
            credentials = Credentials(
                token=token_data['token'],
                refresh_token=token_data['refresh_token'],
                token_uri=token_data['token_uri'],
                client_id=token_data['client_id'],
                client_secret=token_data['client_secret'],
                scopes=token_data['scopes']
            )
            
            if credentials.expired:
                print("Token đã hết hạn, đang refresh...")
                credentials.refresh(Request())
                
                if os.path.exists('oauth_token.json'):
                    token_data = {
                        'token': credentials.token,
                        'refresh_token': credentials.refresh_token,
                        'token_uri': credentials.token_uri,
                        'client_id': credentials.client_id,
                        'client_secret': credentials.client_secret,
                        'scopes': credentials.scopes
                    }
                    with open('oauth_token.json', 'w') as f:
                        json.dump(token_data, f)
                    print("Đã lưu token mới vào oauth_token.json")
                    
            return credentials
            
        print("Không tìm thấy token, bắt đầu xác thực mới...")
        flow = InstalledAppFlow.from_client_secrets_file(
            'client_secrets.json',
            scopes=SCOPES,
            redirect_uri='urn:ietf:wg:oauth:2.0:oob'
        )
        
        auth_url = flow.authorization_url(prompt='consent')
        print(f'Vui lòng truy cập URL này để xác thực:\n{auth_url[0]}')
        
        code = input('Nhập mã xác thực: ').strip()
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        token_data = {
            'token': credentials.token,
            'refresh_token': credentials.refresh_token,
            'token_uri': credentials.token_uri,
            'client_id': credentials.client_id,
            'client_secret': credentials.client_secret,
            'scopes': credentials.scopes
        }
        with open('oauth_token.json', 'w') as f:
            json.dump(token_data, f)
        print("Đã lưu token mới vào oauth_token.json")
        
        print("\nLưu JSON này vào GitHub Secret OAUTH_TOKEN:")
        print(json.dumps(token_data))
        
        return credentials
        
    except Exception as e:
        print(f"Chi tiết lỗi credentials: {str(e)}")
        raise e

def upload_to_youtube(video_path, title, description):
    try:
        credentials = get_youtube_credentials()
        youtube = build('youtube', 'v3', credentials=credentials)
        
        print("Đã khởi tạo YouTube service thành công")
        
        body = {
            'snippet': {
                'title': title,
                'description': description,
                'tags': ['anime', 'seasonal anime', 'anime preview'],
                'categoryId': '1'
            },
            'status': {
                'privacyStatus': 'public',
                'selfDeclaredMadeForKids': False
            }
        }

        print(f"Bắt đầu upload video: {title}")
        insert_request = youtube.videos().insert(
            part=','.join(body.keys()),
            body=body,
            media_body=MediaFileUpload(
                video_path, 
                chunksize=1024*1024, 
                resumable=True
            )
        )

        response = None
        while response is None:
            try:
                status, response = insert_request.next_chunk()
                if status:
                    print(f"Đã upload {int(status.progress() * 100)}%")
            except Exception as e:
                print(f"Lỗi trong quá trình upload chunk: {str(e)}")
                raise e

        print(f"Upload hoàn tất! Video ID: {response['id']}")
        return response['id']

    except Exception as e:
        print(f"Chi tiết lỗi upload: {str(e)}")
        raise e

def refresh_oauth_token():
    SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
    flow = InstalledAppFlow.from_client_secrets_file(
        'client_secrets.json',
        scopes=SCOPES,
        redirect_uri='urn:ietf:wg:oauth:2.0:oob'
    )
    
    auth_url = flow.authorization_url(prompt='consent')
    print(f'Truy cập URL này:\n{auth_url[0]}')
    
    code = input('Nhập mã xác thực: ').strip()
    flow.fetch_token(code=code)
    
    with open('oauth_token.json', 'w') as f:
        json.dump({
            'token': flow.credentials.token,
            'refresh_token': flow.credentials.refresh_token,
            'token_uri': flow.credentials.token_uri,
            'client_id': flow.credentials.client_id,
            'client_secret': flow.credentials.client_secret,
            'scopes': flow.credentials.scopes
        }, f)
    
    print('Token đã được lưu vào oauth_token.json')