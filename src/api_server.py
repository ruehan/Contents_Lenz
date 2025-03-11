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

@app.get("/")
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
    url: str = Form(...)
):
    """URL에서 웹 콘텐츠 스크래핑 API"""
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
        
        # 본문 추출 (메타 설명, 주요 텍스트 블록)
        content = ""
        
        # 메타 설명 추가
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc and meta_desc.get('content'):
            content += meta_desc.get('content') + "\n\n"
        
        # 주요 콘텐츠 추출 (p, h1-h6, article, section 태그 등)
        for tag in soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'article', 'section']):
            text = tag.get_text(strip=True)
            if text and len(text) > 20:  # 짧은 텍스트는 건너뜀
                content += text + "\n\n"
        
        # 콘텐츠 정리 (중복 줄바꿈 제거 등)
        content = re.sub(r'\n{3,}', '\n\n', content).strip()
        
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
    url: str = Form(...),
    length: str = Form("medium"),
    format: str = Form("paragraph"),
    language: str = Form("auto")
):
    """URL 콘텐츠 요약 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
    if not url.strip():
        raise HTTPException(status_code=400, detail="요약할 URL을 입력하세요.")
    
    try:
        # 웹 콘텐츠 스크래핑
        web_content = await scrape_url(url=url)
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
    text: str = Form(...),
    length: str = Form("medium"),
    format: str = Form("paragraph"),
    language: str = Form("auto")
):
    """텍스트 요약 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
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
    text: str = Form(...),
    count: int = Form(10),
    language: str = Form("auto")
):
    """텍스트에서 키워드 추출 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="키워드를 추출할 텍스트를 입력하세요.")
    
    try:
        keywords = openai_client.extract_keywords(text, count, language)
        return {"keywords": keywords}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"키워드 추출 중 오류가 발생했습니다: {str(e)}")

@app.post("/detect-language", response_model=LanguageResponse)
async def detect_language(
    text: str = Form(...)
):
    """텍스트 언어 감지 API"""
    if not openai_client:
        raise HTTPException(status_code=500, detail="OpenAI API 키가 설정되지 않았습니다.")
    
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