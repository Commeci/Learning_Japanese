### 유저 서비스
### 1. 회원가입
### 2. 아이디 중복 확인
### 3. 로그인
### 4. 유저 토큰 값 유효성 확인

from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from db.Database import db
from models.user_model import User, UserInDB

# JWT 설정
SECRET_KEY = "ichi_service"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
pwd_context = CryptContext(schemes=['argon2'])

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# 데이터베이스 연결 및 사용자 조회
def get_user_from_db(username: str):
    query = "SELECT * FROM User WHERE username = %s"
    user = db.select(query, (username,))
    if user:
        return UserInDB(**user[0])
    return None

# 사용자 등록
def create_user_in_db(username: str, password: str):
    hashed_password = get_password_hash(password)
    query = "INSERT INTO User (username, hashed_password) VALUES (%s, %s)"
    db.insert(query, (username, hashed_password))

# 토큰 저장 및 조회
def save_token_in_db(username: str, token: str, expire_at: datetime):
    query = "INSERT INTO tokens (username, token, expire_at) VALUES (%s, %s, %s)"
    db.insert(query, (username, token, expire_at))

def get_token_from_db(token: str):
    query = "SELECT * FROM tokens WHERE token = %s"
    token_data = db.select(query, (token,))
    if token_data:
        return token_data[0]
    return None

# JWT 생성 및 검증
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    save_token_in_db(data["sub"], encoded_jwt, expire)
    return encoded_jwt

def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = get_token_from_db(token)
        if token_data is None or datetime.utcnow() > token_data['expire_at']:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

# 토큰 삭제
def delete_token_from_db(token: str):
    query = "DELETE FROM tokens WHERE token = %s"
    db.delete(query, (token,))


def insert_zandi(uid):
    
    
    
    now = datetime.now()
    ## 날짜의 형식을 2021-01-01로 만들기
    ## 숫자에 0을 붙이기 위해 f-string 사용
    date = f"{now.year}-{now.month if now.month >= 10 else '0'+str(now.month)}-{now.day if now.day >= 10 else '0'+str(now.day)}"
    
    ## query = "INSERT INTO Zandi (uid, learnDate) values(%s, %s) ON DUPLICATE KEY UPDATE learnDate = learnDate;"
    
    ## 이미 있으면 업데이트로(value의 값을 1 추가), 없으면 추가로 
    zandi = db.select("select * from Zandi where uid = %s and learnDate = %s", (uid, date))
    insert_query = "INSERT INTO Zandi (uid, learnDate) values(%s, %s)"
    update_query = "UPDATE Zandi SET value = value + 1 where uid = %s and learnDate = %s;"
    
    if zandi:
        db.update(update_query, (uid, date))
    else:
        db.insert(insert_query, (uid, date))
    return True
    
def get_zandi(uid):
    now = datetime.now()
    from_date = f"{now.year-1}-{now.month if now.month >= 10 else '0'+str(now.month)}-{now.day if now.day >= 10 else '0'+str(now.day)}"
    to_date = f"{now.year}-{now.month if now.month >= 10 else '0'+str(now.month)}-{now.day if now.day >= 10 else '0'+str(now.day)}"
    query = "select learnDate, value from Zandi where uid=%s"
    res = db.select(query, uid)
    
    data = []
    for item in res:
        data.append(
            {
                'day' : item['learnDate'],
                'value': item['value']
            }
        )
    return {'items': data, 'from' : f"{from_date}", 'to' : f"{to_date}"}


def insert_learnBox(news_id, uid):
    query = "INSERT INTO LearnBox (news_id, uid) values(%s, %s)"
    db.insert(query, (news_id, uid))
    return True

def get_learnBox(uid):
    query = "select * from LearnBox join News on LearnBox.news_id = News.news_id where uid = %s "
    news_list = db.select(query, (uid,))
    return news_list
