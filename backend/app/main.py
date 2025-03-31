import sys
import os
import uvicorn

# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import news_router, quiz_router, writing_router, user_router

# FastAPI 애플리케이션 생성
app = FastAPI()

# CORS 설정
origins = [
    "http://localhost",  # 모든 도메인에서 접근 가능하도록 설정 (필요에 따라 특정 도메인으로 제한 가능)
    "http://localhost:3000",
    "http://localhost:5173",
    "http://3.39.80.46",
    "http://144.24.73.103"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(news_router.router, prefix="/api", tags=["news"])
app.include_router(quiz_router.router, prefix="/api", tags=["quiz"])
app.include_router(writing_router.router, prefix="/api", tags=["writing"])
app.include_router(user_router.router, prefix="/api", tags=["user"])

# 루트 경로 테스트 엔드포인트
@app.get('/')
async def read_root():
    return {"message": "Welcome to the News API"}

# 애플리케이션 실행 코드 추가
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, timeout_keep_alive=5)
