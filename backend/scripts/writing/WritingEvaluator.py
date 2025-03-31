
import os
import json
from openai import OpenAI
from dotenv import load_dotenv
import re

# 환경 변수에서 OpenAI API 키 로드
load_dotenv()

client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY")
)

def rule_based_grammar_check(sentence):
    """
    간단한 규칙 기반 문법 평가 함수
    """
    errors = []
    # 예시 규칙: 일본어 문장의 마지막에 "。"를 넣는지 확인
    if not sentence.endswith("。"):
        errors.append("문장은 '。'로 끝나야 합니다.")
    
    # 예시 규칙: 경어체가 적절히 사용되었는지 확인
    if re.search(r'(ます|です)', sentence) is None:
        errors.append("경어체(ます/です)가 사용되지 않았습니다.")
    
    return errors

def get_ai_evaluation(question, sentence):
    """
    GPT 모델을 사용하여 작문 평가를 진행
    """
    prompt = {
        "prompt": f"""
        아래 질문에 대한 작문을 평가해 주세요.
        작문이 질문에 적절히 답변하고 있는지, 내용의 정확성과 충실성, 문법 및 표현의 자연스러움을 기준으로 1에서 10까지 점수를 주세요.
        또한, 개선해야 할 부분이 있으면 구체적으로 피드백을 제공해 주세요.
        
        질문: "{question}"
        작문: "{sentence}"
        
        출력 형식은 JSON으로 해 주세요:
        {{
          "score": "<점수>",
          "feedback": "<피드백 내용>"
        }}
        """
    }
    return prompt

def evaluate_sentence(question, sentence):
    """
    문장을 평가하는 메인 함수
    """
    # 규칙 기반 문법 검사
    grammar_errors = rule_based_grammar_check(sentence)
    
    # GPT-4를 활용한 평가 요청 프롬프트 생성
    prompt = get_ai_evaluation(question, sentence)

    # OpenAI API를 사용하여 AI 평가 받기 (실제 API 호출 부분은 주석 처리)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt["prompt"]}
        ],
    )
    try:
        ai_result = response.choices[0].message.content.strip()
        ai_result = json.loads(ai_result)
    
        # # 예시 AI 결과 (API 호출 대체)
        # ai_result = {
        #     "score": 7,
        #     "feedback": "질문에 대한 답변이 대체로 적절하나, 세부적인 내용이 부족합니다. 더 구체적인 예시를 추가하면 좋겠습니다."
        # }
        
        # 결과 종합
        final_feedback = {
            "grammar_errors": grammar_errors,
            "ai_score": ai_result["score"],
            "ai_feedback": ai_result["feedback"]
        }
        
        return final_feedback
    except Exception as e:
        print(f'[ERROR 10041]: 작문 평가 에러 : {e}')
        return {
            'grammar_errors': '문법 검사 중 오류가 발생했습니다.',
            'ai_score': 0,
            'ai_feedback': 'AI 평가 중 오류가 발생했습니다.'
        }
        

