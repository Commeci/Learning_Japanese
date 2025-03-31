import pandas as pd
import re
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from db.Database import db

# CSV 파일을 읽어 리스트로 변환하는 함수
def parse_kanji_readings(csv_file_path):
    # CSV 파일을 구분자 ';'로 읽기
    df = pd.read_csv(csv_file_path, delimiter=';', header=None, names=['kanji', 'readings'])
    
    kanji_reading_list = []
    
    for _, row in df.iterrows():
        kanji = row['kanji']
        readings = re.sub(r'\[.*?\]', '', row['readings']).split('、')  # 대괄호와 그 안의 내용을 제거
        # print(readings)
        
        # 음독과 훈독을 각각 분류
        ondoku = [reading for reading in readings if all('\u30a0' <= char <= '\u30ff' for char in reading)]  # 가타카나로만 이루어진 읽기
        kundoku = [reading for reading in readings if all('\u3040' <= char <= '\u309f' for char in reading)]  # 히라가나로만 이루어진 읽기
        
        kanji_reading_list.append([kanji, ', '.join(ondoku), ', '.join(kundoku)])
    
    return kanji_reading_list

# Kanji 데이터를 DB에 삽입하는 함수
def insert_kanji_into_db(kanji_list): 
    insert_query = """
    INSERT INTO Kanji (kanji_char, mean, voice, description)
    VALUES (%s, %s, %s, %s)
    """
    
    for kanji in kanji_list:
        params = (
            kanji[0],
            kanji[1],
            kanji[2],
            ''
        )
        db.insert(insert_query, params)
    
# 사용 예시
csv_file_path = './scripts/kanji/Kanji.csv'  # CSV 파일 경로
kanji_reading_list = parse_kanji_readings(csv_file_path)
insert_kanji_into_db(kanji_reading_list)
    
    
