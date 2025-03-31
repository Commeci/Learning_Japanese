# router/news_router.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from models.news_model import NewsResponse
from typing import List
from pydantic import BaseModel
from services.news_service import get_news_with_id, get_news_id_list, get_news_with_category, get_news_recent, get_news_today, tts_streaming_generator
from services.kanji_service import get_kanji_in_news
from datetime import datetime
import os

from common.error.ErrorCode import ErrorCode

router = APIRouter()

@router.get('/news/content/{news_id}', response_model=NewsResponse)
async def news_content_with_id(news_id:int):
    news_data = get_news_with_id(news_id)
    if not news_data:
        ErrorCode.raise_HTTPException(ErrorCode.NEWS_CANNOT_FOUND)
    kanji_list = get_kanji_in_news(news_id)
    if not kanji_list:
        ErrorCode.raise_HTTPException(ErrorCode.NEWS_KANJI_CANNOT_FOUND)
    news_data = news_data[0]
    try:
        news_data['upload_date']=news_data['upload_date'].strftime("%Y.%m.%d")
    except Exception as e:
        print('is not DateTime!')
    
    return {'news': news_data, 'kanji_list': kanji_list}

@router.get('/news/list')
async def news_id_list():
    news_list = get_news_id_list()
    return {'news_list': news_list}

@router.get('/news/recent')
async def news_recent():
    news_list = get_news_recent()
    return {'news_list': news_list}

@router.get('/news/today_hot')
async def news_today():
    news_list = get_news_today()
    return {'news_list': news_list}


class TTSReq(BaseModel):
    text: str
@router.post('/news/tts')
async def tts(req:TTSReq):
    if not req.text:
        return {"error": "No text provided"}
    
    path = tts_streaming_generator(req.text)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="MP3 file not found")

    # StreamingResponse로 스트리밍 데이터 반환
    return FileResponse(
        path,
        media_type="audio/opus",
        filename="nihongo.opus",
    )

"""
response = List[News]
"""
@router.get('/news/{category}')
async def news_with_category(category:int):
    news_list = get_news_with_category(category)
    return {'news_items':news_list}