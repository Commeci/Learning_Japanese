import os
import ast
from typing import List
from openai import OpenAI
from dotenv import load_dotenv
from db.Database import db


client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)
# 환경 변수에서 OpenAI API 키 로드
load_dotenv()

def generate_kanji_examples(kanji: str):
    # ChatGPT에 보낼 프롬프트    
    prompt = (
        f"Given the kanji '{kanji}', provide the following information:\n"
        f"1. Three example words that use this kanji, each as a list containing the kanji, reading, and meaning.\n"
        f"2. Two example sentences that include this kanji.\n\n"
        f"The response should strictly follow this format:\n"
        f"Words: [[kanji, reading, meaning], [kanji, reading, meaning], [kanji, reading, meaning]]\n"
        f"Sentences: [[\"sentence1\", \"meaning\"], [\"sentence2\", \"meaning\"]]\n\n"
        f"For example:\n"
        f"Words: [[\"山\", \"やま\", \"산\"], [\"山脈\", \"さんみゃく\", \"산맥\"], [\"山登り\", \"やまのぼり\", \"등산\"]]\n"
        f"Sentences: [[\"今日は山に行きます。\", \"지금은 산에 갑니다\"], [\"山はとても美しいです。\", \"산은 정말로 아름답습니다\"]]\n\n"
        f"Please generate the response in this exact format for the kanji '{kanji}'."
    )

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
    
def parse_kanji_response(response_text: str):
    try:
        # Words 부분 추출
        if 'Words: [' in response_text:
            start = response_text.index('Words: [') + len('Words: ')
            words_str = response_text[start:]
            words_list = ast.literal_eval(words_str)
            return {'type': 'words', 'data': words_list}
        
        # Sentences 부분 추출
        elif 'Sentences: [' in response_text:
            start = response_text.index('Sentences: [') + len('Sentences: ')
            sentences_str = response_text[start:]
            sentences_list = ast.literal_eval(sentences_str)
            return {'type': 'sentences', 'data': sentences_list}
        
        else:
            raise ValueError("Response text does not contain 'Words' or 'Sentences'")
    except (ValueError, SyntaxError) as e:
        print(f"Error parsing kanji response: {e}")
        return None
    
  
def temp(kanji_id, parsed_data):
    for data in parsed_data['data']:
        data.insert(0, kanji_id)
  
def insert_to_db(type, data):
    word_query = "insert into Word (kanji_id, japanese, yomigana, korean) values (%s, %s, %s, %s)"
    sentence_query = "insert into KanjiExample (kanji_id, japanese, korean) values (%s, %s, %s)"
    query = ''
    if type == "words":
        query = word_query
    elif type == "sentences":
        query = sentence_query
    for params in data:
        db.insert(query, params)
    
    

# 사용 예시
if __name__ == "__main__":
    
    kanji_list = db.select('select kanji_id, kanji_char from Kanji')
    
    for kanji in kanji_list:
        generated = generate_kanji_examples(kanji["kanji_char"])
        for s in generated.split('\n'):
            if not s:
                continue
            parsed = parse_kanji_response(s)
            if not parsed:
                continue
        
            temp(kanji['kanji_id'], parsed)
            insert_to_db(parsed['type'], parsed['data'])
            
