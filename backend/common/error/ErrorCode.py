from fastapi import HTTPException
from datetime import datetime

class ErrorCode: 
    @staticmethod
    def get_error_message(errorCode):
        date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return f"[{date}] [{errorCode['detailCode']}] : {errorCode['message']}"
    
    @staticmethod
    def raise_HTTPException(errorCode):
        print(ErrorCode.get_error_message(errorCode))
        raise HTTPException(status_code=errorCode['code'], detail=errorCode['message'])
    
    NEWS_CANNOT_FOUND = {'code': 404, 'detailCode': 10001,'message': '존재하지 않는 뉴스입니다.'}
    NEWS_KANJI_CANNOT_FOUND = {'code': 404, 'detailCode': 10002, 'message': '뉴스 내 한자 정보를 찾을 수 없습니다.'}