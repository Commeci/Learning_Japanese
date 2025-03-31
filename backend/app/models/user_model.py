from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    username: str
    disabled: Optional[bool] = None

class UserInDB(User):
    uid: int
    hashed_password: str

    