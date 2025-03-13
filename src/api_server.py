"""
FastAPI 기반 API 서버 모듈
"""

import os
import tempfile
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import requests
from bs4 import BeautifulSoup
import re

from src.models.openai_client import OpenAIClient
from src.utils.file_handler import FileHandler
from src.config import SUMMARY_LENGTHS, SUMMARY_FORMATS, SUPPORTED_LANGUAGES, SUPPORTED_TEXT_FORMATS, SUPPORTED_DOCUMENT_FORMATS

# API 응답 모델 정의
class SummaryResponse(BaseModel):
    summary: str
    detected_language: Optional[str] = None
    detected_language_name: Optional[str] = None

class KeywordsResponse(BaseModel):
    keywords: List[str]

class LanguageResponse(BaseModel):
    language: str
    language_name: str

class WebContentResponse(BaseModel):
    title: str
    content: str
    url: str

class ErrorResponse(BaseModel):
    error: str

# 요청 모델 정의
class ScrapeUrlRequest(BaseModel):
    url: str
    use_ai_filter: bool = True

class SummarizeUrlRequest(BaseModel):
    url: str
    length: str = "medium"
    format: str = "paragraph"
    language: str = "auto"

class SummarizeTextRequest(BaseModel):
    text: str
    length: str = "medium"
    format: str = "paragraph"
    language: str = "auto"

class KeywordsRequest(BaseModel):
    text: str
    count: int = 10
    language: str = "auto"

class LanguageDetectionRequest(BaseModel):
    text: str

# FastAPI 앱 초기화
app = FastAPI(
    title="Contents Lenz API",
    description="AI 기반 콘텐츠 요약 및 분석을 위한 API",
    version="1.0.0"
)

# CORS 설정 (모든 출처 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI 클라이언트 초기화
openai_client = None
try:
    openai_client = OpenAIClient()
except ValueError as e:
    print(f"OpenAI API 초기화 오류: {str(e)}")

@app.get("/api")
async def root():
    """API 루트 경로"""
    return {
        "message": "Contents Lenz API 서버에 오신 것을 환영합니다.",
        "api_url": "https://contents-lenz.onrender.com",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

@app.post("/scrape-url", response_model=WebContentResponse)
async def scrape_url(
    request: ScrapeUrlRequest = None,
    url: str = Form(None),
    use_ai_filter: bool = Form(True)
):
    """URL에서 웹 콘텐츠 스크래핑 API"""
    # JSON 요청과 Form 요청 모두 처리
    if request:
        url = request.url
        use_ai_filter = request.use_ai_filter
    elif not url:
        raise HTTPException(status_code=400, detail="URL이 제공되지 않았습니다.")
    
    if not url.strip():
        raise HTTPException(status_code=400, detail="스크래핑할 URL을 입력하세요.")
    
    # URL 형식 검증
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    try:
        # 웹 페이지 가져오기
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # 오류 발생 시 예외 발생
        
        # HTML 파싱
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 제목 추출
        title = soup.title.string if soup.title else "제목 없음"
        
        # 기본적인 불필요 요소 제거 (스크립트, 스타일 등)
        for element in soup.find_all(['script', 'style']):
            element.decompose()
        
        # 전체 텍스트 추출
        all_text = soup.get_text(separator='\n', strip=True)
        
        # OpenAI API를 사용하여 주요 내용 필터링 (use_ai_filter가 True이고 openai_client가 있는 경우)
        if use_ai_filter and openai_client:
            try:
                filtered_content = openai_client.filter_web_content(all_text, title, url)
                return {
                    "title": title,
                    "content": filtered_content,
                    "url": url
                }
            except Exception as e:
                print(f"AI 필터링 중 오류 발생: {str(e)}")
                # AI 필터링 실패 시 기존 방식으로 대체
                pass
        
        # AI 필터링을 사용하지 않거나 실패한 경우 기존 방식으로 처리
        # 불필요한 요소 제거
        for element in soup.find_all(['script', 'style', 'nav', 'footer', 'iframe', 'aside']):
            element.decompose()
            
        # 광고, 사이드바, 관련 기사 등을 포함할 가능성이 높은 요소 제거
        ad_classes = ['ad', 'ads', 'advertisement', 'banner', 'sidebar', 'related', 'footer', 'menu', 'nav', 'share', 'social', 'comment', 'copyright']
        for class_name in ad_classes:
            for element in soup.find_all(class_=lambda x: x and any(ad in x.lower() for ad in [class_name])):
                element.decompose()
                
        # 광고, 사이드바, 관련 기사 등을 포함할 가능성이 높은 ID 제거
        ad_ids = ['ad', 'ads', 'advertisement', 'banner', 'sidebar', 'related', 'footer', 'menu', 'nav', 'share', 'social', 'comment', 'copyright']
        for id_name in ad_ids:
            for element in soup.find_all(id=lambda x: x and any(ad in x.lower() for ad in [id_name])):
                element.decompose()
        
        # 본문 추출 (메타 설명, 주요 텍스트 블록)
        content = ""
        
        # 메타 설명 추가
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            content += meta_desc.get('content') + "\n\n"
        
        # 주요 콘텐츠 추출 시도 (article, main, section 등 주요 콘텐츠 영역)
        main_content = None
        for container in ['article', 'main', '.article', '.content', '.post', '.entry', '#article', '#content', '#main']:
            if container.startswith('.') or container.startswith('#'):
                selector_type = 'class' if container.startswith('.') else 'id'
                selector_value = container[1:]
                if selector_type == 'class':
                    main_content = soup.find(class_=selector_value)
                else:
                    main_content = soup.find(id=selector_value)
            else:
                main_content = soup.find(container)
                
            if main_content:
                break
        
        # 주요 콘텐츠 영역이 발견된 경우
        if main_content:
            # 주요 콘텐츠 내에서 텍스트 추출
            for tag in main_content.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                text = tag.get_text(strip=True)
                if text and len(text) > 20:  # 짧은 텍스트는 건너뜀
                    content += text + "\n\n"
        else:
            # 주요 콘텐츠 영역을 찾지 못한 경우 일반적인 방법으로 추출
            for tag in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                text = tag.get_text(strip=True)
                if text and len(text) > 20:  # 짧은 텍스트는 건너뜀
                    content += text + "\n\n"
        
        # 콘텐츠 정리 (중복 줄바꿈 제거 등)
        content = re.sub(r'\n{3,}', '\n\n', content).strip()
        
        # 불필요한 문자열 패턴 제거 (저작권 정보, 광고 문구 등)
        patterns_to_remove = [
            r'ⓒ.*All Rights Reserved',
            r'무단 전재 및 재배포 금지',
            r'Copyright ©.*',
            r'관련기사',
            r'관련 기사',
            r'관련 뉴스',
            r'.*\[.*\]$',  # [카메라 워크 K]와 같은 패턴
            r'^외눈박이의.*',  # "외눈박이의 누드 사진"과 같은 패턴
            r'^family site.*',
            r'^문화·교육.*',
        ]
        
        for pattern in patterns_to_remove:
            content = re.sub(pattern, '', content, flags=re.MULTILINE)
        
        # 여러 줄 공백 정리
        content = re.sub(r'\n\s*\n', '\n\n', content)
        
        # 중복 문단 제거
        lines = content.split('\n\n')
        unique_lines = []
        for line in lines:
            line = line.strip()
            if line and line not in unique_lines:
                unique_lines.append(line)
        
        content = '\n\n'.join(unique_lines)
        
        if not content:
            raise HTTPException(status_code=400, detail="웹 페이지에서 콘텐츠를 추출할 수 없습니다.")
        
        return {
            "title": title,
            "content": content,
            "url": url
        }
    
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"웹 페이지 접근 중 오류가 발생했습니다: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"웹 스크래핑 중 오류가 발생했습니다: {str(e)}")

@app.post("/summarize/url", response_model=SummaryResponse)
async def summarize_url(
    request: SummarizeUrlRequest
):
    """URL 콘텐츠 요약 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
    url = request.url
    length = request.length
    format = request.format
    language = request.language
    
    if not url.strip():
        raise HTTPException(status_code=400, detail="요약할 URL을 입력하세요.")
    
    try:
        # 웹 콘텐츠 스크래핑
        web_content = await scrape_url(ScrapeUrlRequest(url=url))
        text = f"제목: {web_content['title']}\n\n{web_content['content']}"
        
        # 언어 감지 (자동 모드인 경우)
        detected_language = None
        if language == 'auto':
            try:
                detected_language = openai_client.detect_language(text)
            except Exception as e:
                print(f"언어 감지 중 오류가 발생했습니다: {str(e)}")
        
        # 텍스트 요약
        summary = openai_client.summarize_text(text, length, format, language)
        
        response = {
            "summary": summary
        }
        
        if detected_language:
            response["detected_language"] = detected_language
            response["detected_language_name"] = SUPPORTED_LANGUAGES.get(detected_language, detected_language)
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"URL 요약 중 오류가 발생했습니다: {str(e)}")

@app.post("/summarize/text", response_model=SummaryResponse)
async def summarize_text(
    request: SummarizeTextRequest
):
    """텍스트 요약 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
    text = request.text
    length = request.length
    format = request.format
    language = request.language
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="요약할 텍스트를 입력하세요.")
    
    # 언어 감지 (자동 모드인 경우)
    detected_language = None
    if language == 'auto':
        try:
            detected_language = openai_client.detect_language(text)
        except Exception as e:
            print(f"언어 감지 중 오류가 발생했습니다: {str(e)}")
    
    # 텍스트 요약
    try:
        summary = openai_client.summarize_text(text, length, format, language)
        
        response = {
            "summary": summary
        }
        
        if detected_language:
            response["detected_language"] = detected_language
            response["detected_language_name"] = SUPPORTED_LANGUAGES.get(detected_language, detected_language)
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"요약 중 오류가 발생했습니다: {str(e)}")

@app.post("/summarize/file", response_model=SummaryResponse)
async def summarize_file(
    file: UploadFile = File(...),
    length: str = Form("medium"),
    format: str = Form("paragraph"),
    language: str = Form("auto")
):
    """파일 요약 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
    # 파일 확장자 확인
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in SUPPORTED_TEXT_FORMATS + SUPPORTED_DOCUMENT_FORMATS:
        raise HTTPException(status_code=400, detail=f"지원하지 않는 파일 형식입니다: {file_ext}")
    
    # 파일 저장 및 읽기
    try:
        # 임시 파일로 저장
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=file_ext)
        temp_file.close()
        
        contents = await file.read()
        with open(temp_file.name, "wb") as f:
            f.write(contents)
        
        # 파일 내용 읽기
        text = FileHandler.read_file(temp_file.name)
        
        # 임시 파일 삭제
        os.remove(temp_file.name)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="파일에 텍스트 내용이 없습니다.")
        
        # 언어 감지 (자동 모드인 경우)
        detected_language = None
        if language == 'auto':
            try:
                detected_language = openai_client.detect_language(text)
            except Exception as e:
                print(f"언어 감지 중 오류가 발생했습니다: {str(e)}")
        
        # 텍스트 요약
        summary = openai_client.summarize_text(text, length, format, language)
        
        response = {
            "summary": summary
        }
        
        if detected_language:
            response["detected_language"] = detected_language
            response["detected_language_name"] = SUPPORTED_LANGUAGES.get(detected_language, detected_language)
        
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 처리 중 오류가 발생했습니다: {str(e)}")

@app.post("/keywords/text", response_model=KeywordsResponse)
async def extract_keywords_text(
    request: KeywordsRequest
):
    """텍스트에서 키워드 추출 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
    text = request.text
    count = request.count
    language = request.language
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="키워드를 추출할 텍스트를 입력하세요.")
    
    try:
        keywords = openai_client.extract_keywords(text, count, language)
        return {"keywords": keywords}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"키워드 추출 중 오류가 발생했습니다: {str(e)}")

@app.post("/detect-language", response_model=LanguageResponse)
async def detect_language(
    request: LanguageDetectionRequest
):
    """텍스트 언어 감지 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
    text = request.text
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="언어를 감지할 텍스트를 입력하세요.")
    
    try:
        detected_language = openai_client.detect_language(text)
        return {
            "language": detected_language,
            "language_name": SUPPORTED_LANGUAGES.get(detected_language, detected_language)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"언어 감지 중 오류가 발생했습니다: {str(e)}")

@app.post("/download")
async def download_summary(
    summary: str = Form(...),
    format: str = Form(".txt")
):
    """요약 결과 다운로드"""
    if not summary.strip():
        raise HTTPException(status_code=400, detail="다운로드할 요약 결과가 없습니다.")
    
    if format not in ['.txt', '.docx']:
        format = '.txt'  # 기본값
    
    try:
        # 임시 파일에 저장
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=format)
        temp_file.close()
        
        # 파일 저장
        FileHandler.save_text(summary, os.path.splitext(temp_file.name)[0], format)
        
        # 파일 다운로드
        return FileResponse(
            path=temp_file.name,
            filename=f"summary{format}",
            media_type="application/octet-stream"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"파일 다운로드 중 오류가 발생했습니다: {str(e)}")

def run_api_server(host='0.0.0.0', port=8000, reload=False):
    """API 서버 실행"""
    uvicorn.run("src.api_server:app", host=host, port=port, reload=reload)

if __name__ == "__main__":
    run_api_server(reload=True) 