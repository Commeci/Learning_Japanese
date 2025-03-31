from models.writing_model import Writing
from scripts.writing.WritingEvaluator import evaluate_sentence
from db.Database import db
from typing import List

def get_writing() -> Writing:
    writing = db.select('select * from Writing order by rand() limit 1')[0]
    writing['words_kanji'] = writing['words_kanji'].split(';')
    writing['words_kana'] = writing['words_kana'].split(';')
    return writing


def get_writing_qeustion(writing_id) -> List[str]:
    lang = ['korean', 'japanese_kanji', 'japanese_kana']
    query = f'select {lang[0]}, {lang[1]}, {lang[2]} from Writing where writing_id = %s'
    question = db.select(query, (writing_id,))[0]
    return question
    
    
    
def get_evaluation(question, user_input):
    return evaluate_sentence(question, user_input)


def insert_writing_result(uid, writing_id, user_input):
    query = 'insert into WritingResult (uid, writing_id, user_input) values (%s, %s, %s)'
    try:
        db.insert(query, (uid, writing_id, user_input))
        return True
    except Exception as e:
        print(e)
        return False
    
def get_writing_result(uid):
    ## get writing questions
    query = """
    select 
        wr.writing_id,
        w.korean,
        w.japanese_kanji,
        w.japanese_kana,
        wr.user_input
    from WritingResult wr
    join Writing w
    on wr.writing_id = w.writing_id
    where wr.uid = %s
    """
    result = db.select(query, (uid,))
    return result