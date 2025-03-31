import random
import re

class KanjiExtractor:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(KanjiExtractor, cls).__new__(cls)
        return cls._instance

    def extract_kanji(self, text: str) -> str:
        kanji_pattern = r'[一-鿿]'
        kanji_only = re.findall(kanji_pattern, text)
        return ''.join(kanji_only)

    def pick_random_kanji(self, kanji_string: str, count: int = 10) -> str:
        kanji_list = list(kanji_string)
        if len(kanji_list) < count:
            return ''.join(kanji_list)
        random_kanji = random.sample(kanji_list, count)
        return ''.join(random_kanji)
    
    
kanjiExtractor = KanjiExtractor()