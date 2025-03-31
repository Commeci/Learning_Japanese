from pydantic import BaseModel
from typing import List

class Writing(BaseModel):
    writing_id: int
    korean: str
    japanese_kanji: str
    japanese_kana: str
    words_kana: List[str]
    words_kanji: List[str]