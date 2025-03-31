
import random
import string
from dotenv import load_dotenv
import os

load_dotenv()

def generate_random_filename(length=12, extension=""):
    """
    랜덤 파일 이름 생성 함수
    :param length: 파일 이름의 길이 (확장자 제외)
    :param extension: 파일 확장자 (예: "mp3", "txt")
    :return: 랜덤 파일 이름 (확장자 포함)
    """
    # 영어 대소문자 + 숫자를 섞어 랜덤 문자열 생성
    chars = string.ascii_letters + string.digits
    random_filename = ''.join(random.choices(chars, k=length))
    
    # 확장자가 있으면 파일 이름에 추가
    if extension:
        random_filename = f"{os.getenv('IMAGE_FILE_PATH_PREFIX')}{random_filename}.{extension}"
    
    return random_filename