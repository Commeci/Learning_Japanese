# router/quiz_router.py
from fastapi import APIRouter
from models.quiz_model import Quiz
from typing import List
from services.quiz_service import get_quiz_with_news


router = APIRouter()

@router.get('/quiz/news/{news_id}')
async def quiz_with_news_id(news_id:int):
    return get_quiz_with_news(news_id)