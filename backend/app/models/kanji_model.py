from pydantic import BaseModel
from typing import Optional, List

# 뉴스 모델 정의
class Kanji(BaseModel):
    kanji_char: str
    mean: str
    voice: str
    description:str
    word: List[List[str]]
    kanji_example: Optional[List[List[str | None]]] = None
    
