from pydantic import BaseModel
from typing import Optional, List

from models.kanji_model import Kanji

# 뉴스 모델 정의
class News(BaseModel):
    news_id: int
    title: str  # 뉴스 제목
    content: str  # 뉴스 본문
    translated_content:str  # 번역된 뉴스 본문 
    company: str  # 뉴스 제공 회사
    upload_date: str  # 업로드 날짜 (문자열 형식)
    view: int = 0  # 조회 수 (기본값 0)
    category: int  # 뉴스 카테고리
    level: Optional[str] = None  # 난이도 (옵션)
    learn_time: Optional[str] = None  # 학습 시간 (옵션)
    thumbnail: str | None # 뉴스 이미지 
class NewsResponse(BaseModel):
    news: News
    kanji_list: List[Kanji]