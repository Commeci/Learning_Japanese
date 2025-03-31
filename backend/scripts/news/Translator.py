import os
import deepl
import logging

class Translator:
    def __init__(self):
        self.api_key = os.getenv("DEEPL_API_KEY")
        self.translator = deepl.Translator(self.api_key)
        
    def translate(self, string:str, source_lang: str="JA", target_lang:str ="KO") -> str:
        """
        일본어 -> 한국어 번역 모듈
        Args:
            string(str) : 번역 언어
            source_lang(str)  : 원문 언어 (기본값 : Japanese)
            trarget_lang(str) : 번역 언어 (기본값: Korean)
            
        Returns:
            str : 번역 문장
        """
    
    
        try:
            translation = self.translator.translate_text(string, target_lang=target_lang)
            return translation.text  # 반환 타입이 객체일 수 있으므로 .text로 명시적 접근
        except Exception as e:
            logging.error(f"Failed to translate: {e}")
            return ""