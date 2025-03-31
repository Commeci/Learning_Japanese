from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta

from services.user_service import get_user_from_db, verify_password, create_access_token
from services.user_service import verify_token, create_user_in_db, get_token_from_db, delete_token_from_db, insert_learnBox
from services.user_service import insert_zandi, get_zandi as get_zandi_service, get_learnBox as get_learnBox_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")
ACCESS_TOKEN_EXPIRE_MINUTES = 120

router = APIRouter()

@router.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_from_db(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
async def register_user(username: str, password: str):
    existing_user = get_user_from_db(username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )
    create_user_in_db(username, password)
    return {"msg": "User registered successfully"}

@router.get("/users/me")
async def read_users_me(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    username = verify_token(token, credentials_exception)
    user = get_user_from_db(username)
    if user is None:
        raise credentials_exception
    return user



@router.post("/logout")
async def logout_user(token: str = Depends(oauth2_scheme)):
    token_data = get_token_from_db(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token or already logged out",
        )
    delete_token_from_db(token)
    return {"msg": "User logged out successfully"}

@router.post('/zandi/{uid}')
def post_zandi(uid: int):
    insert_zandi(uid)

@router.get('/zandi/{uid}')
def get_zandi(uid: int):
    return get_zandi_service(uid)

@router.get('/learnBox/{uid}')
def get_learnBox(uid: int):
    return get_learnBox_service(uid)


@router.post('/learnBox/{news_id}/user/{uid}')
def post_learnBox(news_id: int, uid: int):
    try:
        insert_learnBox(news_id, uid)
    except Exception as e:
        print(e)
        return {"msg": "learnBox insertion failed"}
    return {"msg": "learnBox inserted successfully"}

