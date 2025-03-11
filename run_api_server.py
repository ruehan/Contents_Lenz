#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
FastAPI 서버 실행 스크립트
"""

import argparse
from src.api_server import run_api_server

def main():
    """API 서버 실행 메인 함수"""
    parser = argparse.ArgumentParser(description='Contents Lenz API 서버')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='서버 호스트 (기본값: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=8000, help='서버 포트 (기본값: 8000)')
    parser.add_argument('--reload', action='store_true', help='코드 변경 시 자동 재시작')
    
    args = parser.parse_args()
    
    print(f"Contents Lenz API 서버를 시작합니다. http://{args.host}:{args.port}")
    print("종료하려면 Ctrl+C를 누르세요.")
    
    run_api_server(host=args.host, port=args.port, reload=args.reload)

if __name__ == "__main__":
    main() 