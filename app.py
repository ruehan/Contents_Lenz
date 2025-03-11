#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
FastAPI 애플리케이션 진입점
uvicorn으로 직접 실행할 수 있는 파일입니다.
"""

import os
import sys
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# src 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# FastAPI 앱 가져오기
from src.api_server import app

# 이 파일이 직접 실행될 때 (uvicorn app:app 명령으로 실행)
if __name__ == "__main__":
    import uvicorn
    
    # 기본 설정으로 실행
    uvicorn.run(
        "app:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    ) 