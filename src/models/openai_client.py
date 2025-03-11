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
        
        # 최신 버전의 OpenAI 라이브러리와 호환되도록 수정
        try:
            # 최신 버전 방식으로 초기화 시도
            self.client = openai.OpenAI(api_key=self.api_key)
        except TypeError as e:
            if 'proxies' in str(e):
                # proxies 매개변수 문제가 발생한 경우 대체 방법 사용
                import httpx
                self.client = openai.OpenAI(
                    api_key=self.api_key,
                    http_client=httpx.Client()
                )
            else:
                # 다른 오류인 경우 다시 발생
                raise
    
    def summarize_text(self, text, length="medium", format="paragraph", language="auto"):
        """텍스트 요약 기능
        
        Args:
            text (str): 요약할 텍스트
            length (str): 요약 길이 ("short", "medium", "long")
            format (str): 요약 형식 ("bullet", "paragraph", "structured")
            language (str): 요약 결과 언어 ("auto", "ko", "en", "ja", "zh" 등)
            
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
        
        # 언어 설정에 따른 프롬프트 조정
        language_prompt = ""
        if language == "auto":
            language_prompt = "원본 텍스트와 동일한 언어로 요약해주세요."
        else:
            language_map = {
                "ko": "한국어",
                "en": "영어",
                "ja": "일본어",
                "zh": "중국어",
                "es": "스페인어",
                "fr": "프랑스어",
                "de": "독일어",
                "ru": "러시아어",
                "pt": "포르투갈어",
                "it": "이탈리아어",
                "nl": "네덜란드어",
                "ar": "아랍어",
                "hi": "힌디어",
                "vi": "베트남어"
            }
            target_language = language_map.get(language, "한국어")
            language_prompt = f"{target_language}로 요약해주세요."
        
        # 프롬프트 구성
        prompt = f"""
        다음 텍스트를 요약해주세요:
        
        {text}
        
        {length_prompt}
        {format_prompt}
        {language_prompt}
        
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
    
    def extract_keywords(self, text, count=10, language="auto"):
        """텍스트에서 주요 키워드 추출
        
        Args:
            text (str): 키워드를 추출할 텍스트
            count (int): 추출할 키워드 수
            language (str): 키워드 결과 언어 ("auto", "ko", "en", "ja", "zh" 등)
            
        Returns:
            list: 추출된 키워드 목록
        """
        if not text:
            return []
        
        # 언어 설정에 따른 프롬프트 조정
        language_prompt = ""
        if language == "auto":
            language_prompt = "원본 텍스트와 동일한 언어로 키워드를 추출해주세요."
        else:
            language_map = {
                "ko": "한국어",
                "en": "영어",
                "ja": "일본어",
                "zh": "중국어",
                "es": "스페인어",
                "fr": "프랑스어",
                "de": "독일어",
                "ru": "러시아어",
                "pt": "포르투갈어",
                "it": "이탈리아어",
                "nl": "네덜란드어",
                "ar": "아랍어",
                "hi": "힌디어",
                "vi": "베트남어"
            }
            target_language = language_map.get(language, "한국어")
            language_prompt = f"{target_language}로 키워드를 추출해주세요."
        
        prompt = f"""
        다음 텍스트에서 가장 중요한 키워드 {count}개를 추출해주세요:
        
        {text}
        
        {language_prompt}
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
    
    def detect_language(self, text):
        """텍스트의 언어 감지
        
        Args:
            text (str): 언어를 감지할 텍스트
            
        Returns:
            str: 감지된 언어 코드 ("ko", "en", "ja", "zh" 등)
        """
        if not text:
            return "ko"  # 기본값은 한국어
        
        # 언어 감지를 위한 짧은 샘플 텍스트 추출 (최대 500자)
        sample_text = text[:500]
        
        prompt = f"""
        다음 텍스트의 언어를 감지해주세요:
        
        {sample_text}
        
        언어 코드만 반환해주세요 (ko, en, ja, zh, es, fr, de, ru, pt, it, nl, ar, hi, vi 중 하나).
        """
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "당신은 언어 감지 전문가입니다. 주어진 텍스트의 언어를 정확하게 감지하는 것이 당신의 임무입니다."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=10,
                temperature=0.1,
            )
            
            detected_language = response.choices[0].message.content.strip().lower()
            
            # 언어 코드 정규화
            language_map = {
                "korean": "ko",
                "english": "en",
                "japanese": "ja",
                "chinese": "zh",
                "spanish": "es",
                "french": "fr",
                "german": "de",
                "russian": "ru",
                "portuguese": "pt",
                "italian": "it",
                "dutch": "nl",
                "arabic": "ar",
                "hindi": "hi",
                "vietnamese": "vi"
            }
            
            # 언어 코드가 이미 2자리 코드인 경우 그대로 반환
            if detected_language in ["ko", "en", "ja", "zh", "es", "fr", "de", "ru", "pt", "it", "nl", "ar", "hi", "vi"]:
                return detected_language
            
            # 언어 이름이 반환된 경우 코드로 변환
            return language_map.get(detected_language, "ko")
        
        except Exception as e:
            print(f"언어 감지 중 오류가 발생했습니다: {str(e)}")
            return "ko"  # 오류 발생 시 기본값은 한국어 