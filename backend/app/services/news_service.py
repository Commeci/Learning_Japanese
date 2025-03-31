# services/news_service.py
from typing import List, AsyncGenerator
from models.news_model import News
from openai import OpenAI
from dotenv import load_dotenv
from utils.file_name_creator import generate_random_filename
from db.Database import db

import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_news_with_id(id:int) -> News:
    news = db.select('select * from News where news_id = (%s)', (id))
    return news

def get_news_id_list() -> List[dict]:
    news_id_list = db.select('select news_id from News')
    for i in range(len(news_id_list)):
        news_id_list[i] = news_id_list[i]['news_id']
    return news_id_list

def get_news_with_category(category: int) -> List[News]:
    news_list = db.select('select * from News where category=(%s)', (category))
    return news_list

def get_news_today() -> List[News]:
    news_list = db.select('select * from News order by view desc, upload_date desc limit 10')
    return news_list

def get_news_recent() -> List[News]:
    news_list = db.select('select * from News order by upload_date desc limit 10')
    return news_list

def tts_streaming_generator(text):
    with client.audio.speech.with_streaming_response.create(
        model="tts-1",  # 적절한 TTS 모델 설정
        voice="alloy",
        input=text,
        response_format="opus"
    ) as response:
        file_path = generate_random_filename(extension='opus')
        response.stream_to_file(file_path)
        
    return file_path