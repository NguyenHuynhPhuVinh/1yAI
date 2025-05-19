# generate_token.py
from google_auth_oauthlib.flow import InstalledAppFlow
import json

def generate_initial_token():
    SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
    
    flow = InstalledAppFlow.from_client_secrets_file(
        'client_secrets3.json',
        scopes=SCOPES,
        redirect_uri='urn:ietf:wg:oauth:2.0:oob'
    )
    
    auth_url = flow.authorization_url(prompt='consent')
    print(f'\nTruy cập URL này để xác thực:\n{auth_url[0]}')
    
    code = input('\nNhập mã xác thực: ').strip()
    flow.fetch_token(code=code)
    
    token_data = {
        'token': flow.credentials.token,
        'refresh_token': flow.credentials.refresh_token,
        'token_uri': flow.credentials.token_uri,
        'client_id': flow.credentials.client_id,
        'client_secret': flow.credentials.client_secret,
        'scopes': flow.credentials.scopes
    }
    
    # Lưu token vào file
    with open('oauth_token.json', 'w') as f:
        json.dump(token_data, f)
    
    print('\nToken đã được lưu vào oauth_token.json')
    print('\nHãy copy nội dung file này vào GitHub Secret OAUTH_TOKEN')

if __name__ == '__main__':
    generate_initial_token()