from pydantic import BaseModel
from typing import List

class Quiz:
    quiz_id: int
    question: List[str]
    selection: List[List[str]]
    commentary: str
    answer: int