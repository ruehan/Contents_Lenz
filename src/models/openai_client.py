import os
import openai
from src.config import OPENAI_API_KEY, OPENAI_MODEL, MAX_TOKENS

class OpenAIClient:
    """OpenAI API와 통신하기 위한 클라이언트 클래스"""
    
    def __init__(self):
        """OpenAI 클라이언트 초기화"""
        self.api_key = OPENAI_API_KEY
        self.model = OPENAI_MODEL
        
        if not self.api_key:
            raise ValueError("OpenAI API 키가 설정되지 않았습니다. 환경 변수 OPENAI_API_KEY를 설정하세요.")
        
        self.client = openai.OpenAI(api_key=self.api_key)
    
    def summarize_text(self, text, length="medium", format="paragraph"):
        """텍스트 요약 기능
        
        Args:
            text (str): 요약할 텍스트
            length (str): 요약 길이 ("short", "medium", "long")
            format (str): 요약 형식 ("bullet", "paragraph", "structured")
            
        Returns:
            str: 요약된 텍스트
        """
        if not text:
            return "요약할 텍스트가 없습니다."
        
        # 요약 길이에 따른 프롬프트 조정
        length_prompt = ""
        if length == "short":
            length_prompt = "100단어 이내의 간결한 요약을 제공해주세요."
        elif length == "medium":
            length_prompt = "300단어 내외의 중간 길이 요약을 제공해주세요."
        elif length == "long":
            length_prompt = "500단어 이상의 상세한 요약을 제공해주세요."
        
        # 요약 형식에 따른 프롬프트 조정
        format_prompt = ""
        if format == "bullet":
            format_prompt = "글머리 기호(•)를 사용하여 요약해주세요."
        elif format == "paragraph":
            format_prompt = "단락 형식으로 요약해주세요."
        elif format == "structured":
            format_prompt = "제목, 소제목 등을 사용한 구조화된 형식으로 요약해주세요."
        
        # 프롬프트 구성
        prompt = f"""
        다음 텍스트를 요약해주세요:
        
        {text}
        
        {length_prompt}
        {format_prompt}
        
        주요 키워드와 핵심 아이디어를 포함해주세요.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "당신은 텍스트 요약 전문가입니다. 주어진 텍스트를 정확하고 간결하게 요약하는 것이 당신의 임무입니다."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=4000,  # 요약 결과의 최대 토큰 수
                temperature=0.3,  # 낮은 온도로 일관된 요약 생성
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            return f"요약 중 오류가 발생했습니다: {str(e)}"
    
    def extract_keywords(self, text, count=10):
        """텍스트에서 주요 키워드 추출
        
        Args:
            text (str): 키워드를 추출할 텍스트
            count (int): 추출할 키워드 수
            
        Returns:
            list: 추출된 키워드 목록
        """
        if not text:
            return []
        
        prompt = f"""
        다음 텍스트에서 가장 중요한 키워드 {count}개를 추출해주세요:
        
        {text}
        
        키워드만 쉼표로 구분하여 나열해주세요.
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "당신은 텍스트 분석 전문가입니다. 주어진 텍스트에서 가장 중요한 키워드를 추출하는 것이 당신의 임무입니다."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=100,
                temperature=0.3,
            )
            
            keywords_text = response.choices[0].message.content.strip()
            keywords = [k.strip() for k in keywords_text.split(',')]
            return keywords
        
        except Exception as e:
            return [f"키워드 추출 중 오류가 발생했습니다: {str(e)}"] 