# services/news_service.py
from typing import List
from models.kanji_model import Kanji
from db.Database import db

def get_kanji_in_news(news_id:int) -> List[Kanji]:
    query = """
        SELECT
            k.kanji_char, k.mean, k.voice, k.description
        FROM news_kanji nk
        JOIN Kanji k ON nk.kanji_id = k.kanji_id
        WHERE nk.news_id = %s
    """
    kanji_list = db.select(query, (news_id, ))
    kanji_char = [kanji_list[i]['kanji_char'] for i in range(len(kanji_list))]
    
    query = """
        SELECT
            k.kanji_char,
            ke.japanese AS japanese, ke.korean AS korean
        FROM news_kanji nk
        JOIN Kanji k ON nk.kanji_id = k.kanji_id
        LEFT JOIN KanjiExample ke ON k.kanji_id = ke.kanji_id
        WHERE nk.news_id = %s;
    """
    example_list = db.select(query, (news_id, ))
    for example in example_list:
        index = kanji_char.index(example['kanji_char'])
        kanji_list[index].setdefault('kanji_example', [])
        kanji_list[index]['kanji_example'].append([example['japanese'], example['korean']])
        
    query = """
        SELECT
            k.kanji_char,
            w.japanese AS japanese, w.korean AS korean, w.yomigana
        FROM news_kanji nk
        JOIN Kanji k ON nk.kanji_id = k.kanji_id
        LEFT JOIN Word w ON k.kanji_id = w.kanji_id
        WHERE nk.news_id = %s;
    """
    word_list = db.select(query, (news_id, ))
    for word in word_list:
        index = kanji_char.index(word['kanji_char'])
        kanji_list[index].setdefault('word', [])
        kanji_list[index]['word'].append([word['japanese'], word['korean'], word['yomigana']])
    
    return kanji_list