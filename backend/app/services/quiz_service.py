from typing import List
from models.quiz_model import Quiz
from db.Database import db

def get_quiz_with_news(news_id:int) -> List[Quiz]:
    quiz_list = db.select('select quiz_id, question, selection, commentary, answer from Quiz where news_id = (%s)', (news_id))
    for i in range(len(quiz_list)):
        quiz_list[i]['question'] = quiz_list[i]['question'].split(';')[:-1]
        quiz_list[i]['selection'] = quiz_list[i]['selection'].split(':')[:-1]        
        for j in range(len(quiz_list[i]['selection'])):
            quiz_list[i]['selection'][j] = quiz_list[i]['selection'][j].split(';')[:-1]
            
    return quiz_list
        