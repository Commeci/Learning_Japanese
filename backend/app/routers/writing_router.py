from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
from dotenv import load_dotenv
from models.writing_model import Writing
from services.writing_service import get_writing, get_evaluation, insert_writing_result, get_writing_qeustion
from services.writing_service import get_writing_result as writing_result
from services.user_service import insert_zandi
from utils.file_name_creator import generate_random_filename
from common.upload_file import file_upload
from common.ocr import ocr_req
import shutil
import os

load_dotenv()

bucket_prefix = os.getenv("NAVER_BUCKET_ADD")

class WritingItem(BaseModel):
    question: str
    user_input: str


router = APIRouter()

@router.get('/writing', response_model=Writing)
async def writing():
    return get_writing()

@router.post('/writing/question/{question}/uid/{uid}')
async def news_evaluation(question: str, uid:str, image: UploadFile = File(None)):
    
    file_location = f'{generate_random_filename(length=30, extension="png")}'
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    file_name = file_upload(file_location)
    image_url = f'{bucket_prefix}{file_name}'
    
    
    text = ocr_req(image_url)
    insert_zandi(uid)
    
    return get_evaluation(question, text)


@router.post('/writing/{writing_id}/uid/{uid}')
async def evaluation(writing_id: str, uid: str, image: UploadFile = File(None)):
    
    question = get_writing_qeustion(writing_id)['korean']
    file_location = f'{generate_random_filename(length=30, extension="png")}'
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    file_name = file_upload(file_location)
    image_url = f'{bucket_prefix}{file_name}'
    
    
    text = ocr_req(image_url)
    insert_writing_result(uid, writing_id, image_url)
    insert_zandi(uid)
    
    return get_evaluation(question, text)


@router.get('/writing/uid/{uid}')
async def get_writing_result(uid: str):
    return writing_result(uid)
    