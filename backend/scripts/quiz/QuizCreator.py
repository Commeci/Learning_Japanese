import os
import json
from openai import OpenAI
from dotenv import load_dotenv


from db.Database import db


client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)
# 환경 변수에서 OpenAI API 키 로드
load_dotenv()

def generate_quiz_from_news(news_id: int):
    
    news_content = db.select('select content from News where news_id=(%s)', (news_id))[0]['content']

    prompt = """
    {
    "quiz_request": {
        "description": "일본어 뉴스 기사를 기반으로 한 학습 퀴즈 요청, 응답 형태는 json형태로 응답",
        "news_article": 
    """ 
    
    prompt += news_content
    prompt += """
        "instructions": {
        "format": "객관식",
        "difficulty": "다양한 난이도",
        "focus": [
            "뉴스 이해도",
            "뉴스 내 한자 및 단어 이해도"
        ],
        "feedback": "간단한 설명 제공",

        },
        "example_questions": [
        {
            "type": "이해도 질문",
            "question": {
            "kanji": "このニュースの主要な内容は何ですか？",
            "kana": "このニュースのしゅようなないようはなんですか？",
            "korean": "이 뉴스의 주요 내용은 무엇인가요?"
            },
            "choices": [
            {
                "kanji": "経済成長",
                "kana": "けいざいせいちょう",
                "korean": "경제 성장"
            },
            {
                "kanji": "政府政策の変更",
                "kana": "せいふせいさくのへんこう",
                "korean": "정부 정책 변경"
            },
            {
                "kanji": "外交関係の強化",
                "kana": "がいこうかんけいのきょうか",
                "korean": "외교 관계 강화"
            },
            {
                "kanji": "社会問題の解決",
                "kana": "しゃかいもんだいのかいけつ",
                "korean": "사회 문제 해결"
            }
            ],
            "answer": "B",
            "explanation": {
            "kanji": "このニュースは政府が発表した政策の変化に関する内容です。",
            "kana": "このニュースはせいふがはっぴょうしたせいさくのへんかにかんするないようです。",
            "korean": "이 뉴스는 정부가 발표한 정책 변화에 관한 내용을 다룹니다."
            }
        },
        {
            "type": "단어 이해도 질문",
            "question": {
            "kanji": "文中の「経済」は何の意味ですか？",
            "kana": "ぶんちゅうの「けいざい」はなんのいみですか？",
            "korean": "문중의 '経済'는 무슨 의미인가요?"
            },
            "choices": [
            {
                "kanji": "経済",
                "kana": "けいざい",
                "korean": "경제"
            },
            {
                "kanji": "教育",
                "kana": "きょういく",
                "korean": "교육"
            },
            {
                "kanji": "技術",
                "kana": "ぎじゅつ",
                "korean": "기술"
            },
            {
                "kanji": "社会",
                "kana": "しゃかい",
                "korean": "사회"
            }
            ],
            "answer": "A",
            "explanation": {
            "kanji": "「経済」は経済を意味します。",
            "kana": "「けいざい」はけいざいをいみします。",
            "korean": "'経済'는 경제를 의미합니다."
            }
        },
        {
            "type": "구문 이해도 질문",
            "question": {
            "kanji": "「政府が取った措置」は何を意味しますか？",
            "kana": "「せいふがとったそち」はなんをいみしますか？",
            "korean": "'政府が取った措置'는 무엇을 의미하나요?"
            },
            "choices": [
            {
                "kanji": "外交政策の強化",
                "kana": "がいこうせいさくのきょうか",
                "korean": "외교 정책 강화"
            },
            {
                "kanji": "教育改革",
                "kana": "きょういくかいかく",
                "korean": "교육 개혁"
            },
            {
                "kanji": "経済規制の緩和",
                "kana": "けいざいきせいのかんわ",
                "korean": "경제 규제 완화"
            },
            {
                "kanji": "環境保護",
                "kana": "かんきょうほご",
                "korean": "환경 보호"
            }
            ],
            "answer": "C",
            "explanation": {
            "kanji": "政府が発表した措置は経済規制の緩和に関するものです。",
            "kana": "せいふがはっぴょうしたそちはけいざいきせいのかんわにかんするものです。",
            "korean": "정부가 발표한 조치는 경제 규제 완화와 관련이 있습니다."
            }
        }
        ]
    }
    }

    """
    
    try:
        # ChatGPT API 호출 (새로운 API 사용 방식으로 변경)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        # 응답에서 텍스트 추출
        response_text = response.choices[0].message.content.strip()
        return response_text
    except Exception as e:
        print(f"Error generating examples: {e}")
        return None
    
def insert_quiz_to_db(quiz, news_id):
    
    def get_text_in_dict(dict):
        res = ""
        dict_keys = ['kanji', 'kana', 'korean'] 
        for key in dict_keys:
            res += dict[key]
            res += ";"
        return res
        
    
    qurey = """
    insert into Quiz(news_id, question, selection, answer, commentary)
    values (%s, %s, %s, %s, %s)
    """
    params = [news_id]
    
    
    params.append(get_text_in_dict(quiz['question']))    ## 문제
    selections = ''
    for selection in quiz['choices']:
        selections += get_text_in_dict(selection)
        selections += ':'
    params.append(selections)                            ## 선택지 삽입
    params.append(ord(quiz['answer'])-ord('A'))          ## 답 삽입
    params.append(get_text_in_dict(quiz['explanation'])) ## 해설 삽입
    
    
    db.insert(qurey, params)
    
if __name__ == "__main__":
    news = db.select('select news_id from News')
    for news_item in news:
        news_id = news_item['news_id']
        if int(news_id) < 52:
            if int(news_id) != 37 or int(news_id) != 47 or int(news_id) != 50:
                continue
        try:
            quizs = generate_quiz_from_news(news_id)[7:-3]
            quizs = json.loads(quizs)['quiz_response']
            for quiz in quizs['questions']:
                insert_quiz_to_db(quiz, news_id)
        except Exception as e:
            print(f'[ERROR 10030]: 퀴즈 생성 에러 : {news_id}, {e}')
        