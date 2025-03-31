import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
secret = os.getenv('OCR_SECRET')

url = "https://dvjh8foq2i.apigw.ntruss.com/custom/v1/36355/f85fe51f78fc4525b592eea7c21590e663142fb2eb329cadbc63a58ccd611d4f/general"

def ocr_req(image_path):
    
    def get_extension(path):
        return path.split('/')[-1].split('.')[-1]
    
    headers = {
        'Content-Type': 'application/json',
        'X-OCR-SECRET' : secret
    }
    
    data = {
        "version": "V2",
        "requestId": "1234",
        "timestamp": f"{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "lang": "ja",
        "images": [
            {
            "format": f"{get_extension(image_path)}",
            "name": "demo_2",
            "url": f"{image_path}"
            }
        ],
        "enableTableDetection": False
    }
    # API 호출
    response = requests.post(url, headers=headers, data=json.dumps(data))

    # 응답 처리
    if response.status_code == 200:
        result = response.json()
        text = ''
        for field in result['images'][0]['fields']:
            text += field['inferText']
        return text
    else:
        print(f"Error: {response.json()}")
        return None
    
if __name__ == "__main__":
    pass