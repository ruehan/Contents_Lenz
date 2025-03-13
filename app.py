#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
FastAPI 애플리케이션 진입점
uvicorn으로 직접 실행할 수 있는 파일입니다.
"""

import os
import sys
from dotenv import load_dotenv
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

# 로깅 설정
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# .env 파일 로드
load_dotenv()

# src 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 메인 FastAPI 앱 생성
app = FastAPI(title="Contents Lenz", description="콘텐츠 요약 및 분석 도구")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 템플릿 및 정적 파일 설정
templates = Jinja2Templates(directory="src/templates")
app.mount("/static", StaticFiles(directory="src/static"), name="static")

# API 서버 가져오기
from src.api_server import app as api_app

# API 라우트 마운트 (/api/*)
for route in api_app.routes:
    # API 경로에 /api 접두사 추가
    if route.path == "/":
        path = "/api"
    else:
        path = f"/api{route.path}"
    
    # 라우트 복사
    app.routes.append(route)
    # 경로 수정
    route.path = path

# 웹 앱 라우트 정의
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    """웹 앱 메인 페이지"""
    return templates.TemplateResponse("index.html", {"request": request})

# 상태 확인 엔드포인트
@app.get("/status")
async def status():
    """서버 상태 확인"""
    return {
        "status": "running",
        "version": "1.0.0"
    }

# 이 파일이 직접 실행될 때 (uvicorn app:app 명령으로 실행)
if __name__ == "__main__":
    import uvicorn
    
    # 환경 변수에서 포트 가져오기 (기본값: 8000)
    port = int(os.environ.get("PORT", 8000))
    # 개발 모드 확인
    debug = os.environ.get("FLASK_ENV") == "development" or os.environ.get("DEBUG") == "true"
    
    # 서버 실행
    logger.info(f"서버 시작 중... (포트: {port}, 디버그 모드: {debug})")
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=debug) 