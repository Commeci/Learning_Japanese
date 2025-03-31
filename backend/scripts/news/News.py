import os
import logging
from dotenv import load_dotenv
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from NewsFetcher import NewsFetcher
from Translator import Translator
from db.Database import MySQLDatabase
from KanjiExtractor import kanjiExtractor



# Load environment variables from .env file
load_dotenv()

# Load database credentials from environment variables
db = MySQLDatabase(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

def insert_news_by_category(news, params) -> int:
    """
    뉴스를 Db에 넣는 과정
    
    Arguments:
        news(dict): news 정보
        params(List[]): 
            0(str): 뉴스 본문
            1(str): 뉴스 회사
            2(str): 업로드 날짜
            3(str): 섬네일 이미지 주소 
            4(int): 카테고리
    """
    if not params:
        return -1

    translated_content = translator.translate(params[0])
    query = """
        INSERT INTO News (title, content, translated_content, company, upload_date, category, level, learn_time, thumbnail)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        news['title'],        # 뉴스 제목
        params[0],            # 뉴스 본문
        translated_content,   # 본문 번역본
        params[1],            # 뉴스 제공 회사
        params[2],            # 업로드 날짜
        params[4],             # 카테고리
        1,                    # 난이도
        5,                    # 읽는데 걸리는 시간
        params[3]             # 섬네일 이미지 주소
    )
    db.insert(query, params)
    news_id = db.select("SELECT LAST_INSERT_ID() AS id")[0]['id']
    
    return news_id
        
def insert_kanji_in_news(news_id:int, content:str):
    kanji_result = kanjiExtractor.extract_kanji(content)
    # 한자 10개 리스트
    random_10_kanji = list(kanjiExtractor.pick_random_kanji(kanji_result))
    for kanji in random_10_kanji:
        # Assuming kanji_id can be retrieved or needs to be inserted into a separate Kanji table
        kanji_id_result = db.select("SELECT kanji_id FROM Kanji WHERE kanji_char = %s", (kanji,))
        if kanji_id_result:
            kanji_id = kanji_id_result[0]['kanji_id']
        else:
            # Insert new kanji into Kanji table if it does not exist
            db.insert("INSERT INTO Kanji (kanji) VALUES (%s)", (kanji,))
            kanji_id = db.select("SELECT LAST_INSERT_ID() AS id")[0]['id']

        # Insert into news_kanji table
        db.insert("INSERT INTO news_kanji (news_id, kanji_id) VALUES (%s, %s)", (news_id, kanji_id))
    

# 사용 예시
if __name__ == "__main__":
    # 국내, 세계, 경제, 엔터, 스포츠, IT, 과학
    category = ['domestic', 'world', 'business', 'entertainment', 'sports', 'it', 'science']
    
    news_fetcher = NewsFetcher()
    translator = Translator()
    for i in range(len(category)):
        print(f'{category[i]} News 수집 중')
        news_list = news_fetcher.fetch_articles_by_category(category[i])
        for news in news_list:
            params = news_fetcher.get_content(news['url']) + [i]
            news_id = insert_news_by_category(news, params)
            insert_kanji_in_news(news_id, params[0])
        
    db.close()
