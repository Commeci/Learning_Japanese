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

def generate_writing():

    prompt = """
    {
        "task": "Generate Japanese writing practice tasks with tokenized answers, answer is required json",
        "inputs": {
            "type": "writing",
            "purpose": "test meaning accuracy and context relevance",
            "difficulty": "beginner_to_intermediate",
            "constraints": {
            "min_sentences": 2,
            "max_sentences": 5,
            "required_elements": ["specific context", "relevant vocabulary", "clear meaning"]
            },
            "examples": [
            {
                "description": {
                "japanese_kanji": "簡単な自己紹介を2～3文で書いてください。",
                "japanese_kana": "かんたんなじこしょうかいを2～3ぶんでかいてください。",
                "korean": "간단한 자기소개를 2~3문장으로 작성하세요."
                },
                "required_content": ["name", "hobby"],
                "answer": {
                "japanese_kanji": ["私", "の", "名前", "は", "田中", "です", "。", "趣味", "は", "映画", "を", "見る", "こと", "です", "。"],
                "japanese_kana": ["わたし", "の", "なまえ", "は", "たなか", "です", "。", "しゅみ", "は", "えいが", "を", "みる", "こと", "です", "。"],
                }
            },
            {
                "description": {
                "japanese_kanji": "週末に何をしたか3～5文で説明してください。",
                "japanese_kana": "しゅうまつになにをしたか3～5ぶんでせつめいしてください。",
                "korean": "주말에 무엇을 했는지 3~5문장으로 설명하세요."
                },
                "required_content": ["activity", "feelings"],
                "answer": {
                "japanese_kanji": ["週末", "、", "友達", "と", "公園", "で", "散歩", "を", "しました", "。", "とても", "楽しかった", "です", "。"],
                "japanese_kana": ["しゅうまつ", "、", "ともだち", "と", "こうえん", "で", "さんぽ", "を", "しました", "。", "とても", "たのしかった", "です", "。"],
                }
            },
            {
                "description": {
                "japanese_kanji": "友達に夕食に誘うメールを書いてください（2～4文）。",
                "japanese_kana": "ともだちにゆうしょくにさそうめーるをかいてください（2～4ぶん）。",
                "korean": "친구에게 저녁 식사 초대를 위한 이메일을 2~4문장으로 작성하세요."
                },
                "required_content": ["date", "time", "place"],
                "answer": {
                "japanese_kanji": ["こんにちは", "！", "金曜日", "の", "夜", "7時", "に", "レストラン", "に", "行きません", "か", "？", "楽しみ", "に", "しています", "。"],
                "japanese_kana": ["こんにちは", "！", "きんようび", "の", "よる", "7じ", "に", "れすとらん", "に", "いきません", "か", "？", "たのしみ", "に", "しています", "。"],
                }
            }
            ],
            "additional_requirements": {
            "flexibility": "Allow variations in sentence structure as long as meaning is preserved",
            "language": ["japanese_kanji", "japanese_kana", "korean"]
            }
        },
        "output_format": {
            "problem_structure": {
            "description": {
                "japanese_kanji": "string",
                "japanese_kana": "string",
                "korean": "string"
            },
            "required_content": ["array of strings"],
            "answer": {
                "japanese_kanji": ["array of strings"],
                "japanese_kana": ["array of strings"],
            }
            },
            "evaluation_guidelines": {
            "compare_with_transformer": true,
            "key_comparison_metrics": ["semantic_similarity", "context_relevance"],
            "threshold": 0.8
            }
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
        response = json.loads(response_text[7:-3])
        return response
    except Exception as e:
        print(f"[ERROR 10040] : Error generating examples: {e}")
        return None
    
def insert_writing_to_db(writing):
        
    
    qurey = """
    insert into Writing(korean, japanese_kanji, japanese_kana, words_kanji, words_kana)
    values (%s, %s, %s, %s, %s)
    """
    params = []
    
    
    params.append(writing['description']['korean'])               ## 문제(한국어)
    params.append(writing['description']['japanese_kanji'])       ## 문제(한자)
    params.append(writing['description']['japanese_kana'])        ## 문제(가나)
    params.append(';'.join(writing['answer']['japanese_kanji']))  ## 단어블럭(한자)
    params.append(';'.join(writing['answer']['japanese_kana']))   ## 단어블럭(한자)

    db.insert(qurey, params)
    
if __name__ == "__main__":
    response = generate_writing()
    for example in response['inputs']['examples']:
        insert_writing_to_db(example)
        