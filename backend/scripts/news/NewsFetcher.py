import requests
from bs4 import BeautifulSoup
from typing import List, Dict
from datetime import datetime
import logging
import re

# from common.error import ErrorCode

class NewsFetcher:
    def convert_time(self, date_str: str) -> str:
        # 요일 부분 제거
        date_str = re.sub(r"\([^)]*\)", "", date_str)
        
        # 입력 문자열을 datetime 객체로 변환
        try:
            # 이번 연도 추가
            current_year = datetime.now().year
            date_str = f"{current_year}/" + date_str.strip()
            dt = datetime.strptime(date_str, "%Y/%m/%d %H:%M")
        except ValueError as e:
            print(f"Error parsing date: {e}")
            return None

        # MySQL DATETIME 형식으로 변환
        mysql_date_str = dt.strftime("%Y-%m-%d %H:%M:%S")
        return mysql_date_str

    def fetch_articles_by_category(self, category:str) -> List[Dict[str, str]]:
        """
        주어진 카테고리에 맞는 뉴스 기사 10개를 불러온다.
        Args:
            category (str): 뉴스 카테고리

        Returns:
            List[Dict[str, str]]: 뉴스 기사 제목과 URL이 담긴 리스트
        """

        url = f'https://news.yahoo.co.jp/topics/{category}'
        response = requests.get(url)

        if response.status_code != 200:
            logging.error(f"Failed to retrieve data: {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.find_all('li', class_='newsFeed_item', limit=10)
        for i in range(len(articles)):
            articles[i] = articles[i].find('a')
            
        top_10_news = []
        

        for article in articles:
            title = article.get_text(strip=True)
            summary_link = article['href']

            # 요약 페이지에서 전체 기사 링크 찾기
            try:
                summary_response = requests.get(summary_link)
                if summary_response.status_code != 200:
                    logging.error(f"Failed to retrieve summary page: {summary_response.status_code}")
                    continue

                summary_soup = BeautifulSoup(summary_response.text, 'html.parser')
                article_link_tag = summary_soup.find('a', href=True, string='記事全文を読む')

                if article_link_tag and 'href' in article_link_tag.attrs:
                    article_url = article_link_tag['href']
                    top_10_news.append({
                        "title": title,
                        "url": article_url
                    })
                else:
                    logging.warning("Could not find the full article link.")
            except Exception as e:
                logging.error(f"Error processing article: {e}")

        return top_10_news
    
    def get_news_info(self, url:str) -> List[str]:
        """
        주어진 url의 뉴스 컨텐츠를 가져옴 (본문, 회사, 업로드날짜)
        Args:
            url (str): 뉴스url

        Returns:
            str: 뉴스 컨텐츠
        """
        info = []
        
        
        pass
    
    def get_content(self, url: str) -> str:
        """
        주어진 뉴스 기사 URL로부터 본문을 가져온다.
        Args:
            url (str): 뉴스 기사 URL

        Returns:
            str: 뉴스 기사 본문
        """

        try:
            response = requests.get(url)

            if response.status_code != 200:
                logging.error(f"[10010]: 뉴스 컨텐츠를 찾을 수 없음 Response Error code: {response.status_code}")
                return ""

            soup = BeautifulSoup(response.text, 'html.parser')
            article_body = soup.find('div', class_='article_body')
            article_time = soup.find('time')
            thumbnail    = article_body.findAll('source')

            if not article_body:
                # logging.warning(ErrorCode.get_error_message(ErrorCode.NEWS_CANNOT_FOUND))
                pass
                
            if not article_time:
                logging.warning("[00012]: 뉴스 업로드 날짜 없음")
                
            if not thumbnail:
                logging.warning("[00013]: 섬네일 이미지 없음")
                thumbnail = 'null'
            else:
                thumbnail = thumbnail[0].get('srcset')
                

            paragraphs = article_body.find_all('p')
            content = "\n".join([p.get_text(strip=True) for p in paragraphs])
            time = article_time.get_text(strip=False)
            time = self.convert_time(time)
            

            return [content, self.get_company(), time, thumbnail]

        except Exception as e:
            logging.error(f"[00001] : 뉴스 본문 분석 오류: {e}")
            return ""
    
    def get_company(self) -> str:
        """
        주어진 url의 뉴스회사를 가져옴
        Args:
            url (str) : 뉴스 url

        Returns:
            str: 뉴스 회사
        """
        return "Yahoo JP"
    
    
if __name__ == "__main__":
    newsFetcher = NewsFetcher()
    
    news = newsFetcher.fetch_articles_by_category('sports')
    result = []
    for item in news:
        result_item = [item['title'], '', '', '']
        result_item[1:] = newsFetcher.get_content(item['url'])
        result.append(result_item)
        
    print(result)