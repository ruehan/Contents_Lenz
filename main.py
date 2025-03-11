#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import argparse
from src.config import create_required_directories, SUPPORTED_LANGUAGES
from src.models.openai_client import OpenAIClient
from src.utils.file_handler import FileHandler

def main():
    """애플리케이션 메인 함수"""
    parser = argparse.ArgumentParser(description='Contents Lenz - AI 기반 콘텐츠 요약 및 분석 도구')
    parser.add_argument('--api', action='store_true', help='API 서버 모드로 실행')
    parser.add_argument('--port', type=int, default=8000, help='API 서버 포트 (기본값: 8000)')
    parser.add_argument('--host', type=str, default='0.0.0.0', help='API 서버 호스트 (기본값: 0.0.0.0)')
    parser.add_argument('--reload', action='store_true', help='API 서버 코드 변경 시 자동 재시작')
    parser.add_argument('--headless', action='store_true', help='명령줄 모드로 실행')
    parser.add_argument('--input', type=str, help='요약할 텍스트 파일 경로')
    parser.add_argument('--output', type=str, help='요약 결과를 저장할 파일 경로')
    parser.add_argument('--length', type=str, choices=['short', 'medium', 'long'], default='medium', help='요약 길이 (short, medium, long)')
    parser.add_argument('--format', type=str, choices=['bullet', 'paragraph', 'structured'], default='paragraph', help='요약 형식 (bullet, paragraph, structured)')
    parser.add_argument('--language', type=str, choices=list(SUPPORTED_LANGUAGES.keys()), default='auto', help='요약 결과 언어 (auto, ko, en, ja, zh 등)')
    
    args = parser.parse_args()
    
    create_required_directories()
    
    # API 서버 모드 (기본 모드)
    if args.api or (not args.headless and not args.input):
        try:
            from src.api_server import run_api_server
            print(f"Contents Lenz API 서버를 시작합니다. http://{args.host}:{args.port}")
            print("종료하려면 Ctrl+C를 누르세요.")
            run_api_server(host=args.host, port=args.port, reload=args.reload)
        except Exception as e:
            print(f"API 서버 실행 중 오류가 발생했습니다: {str(e)}")
            sys.exit(1)
    
    # 헤드리스 모드 (명령줄)
    elif args.headless or args.input:
        if not args.input:
            print("오류: 헤드리스 모드에서는 --input 인자가 필요합니다.")
            sys.exit(1)
        
        try:
            input_text = ""
            if os.path.isfile(args.input):
                input_text = FileHandler.read_file(args.input)
            else:
                input_text = args.input  # 파일이 아니면 직접 텍스트로 간주
            
            client = OpenAIClient()
            
            if args.language == 'auto':
                print("텍스트 언어 감지 중...")
                detected_language = client.detect_language(input_text)
                print(f"감지된 언어: {SUPPORTED_LANGUAGES.get(detected_language, detected_language)}")
            
            print("텍스트 요약 중...")
            summary = client.summarize_text(input_text, args.length, args.format, args.language)
            
            if args.output:
                output_path = args.output
                file_format = os.path.splitext(output_path)[1]
                if not file_format:
                    file_format = '.txt'
                    output_path += file_format
                
                FileHandler.save_text(summary, os.path.splitext(output_path)[0], file_format)
                print(f"요약 결과가 {output_path}에 저장되었습니다.")
            else:
                print("\n===== 요약 결과 =====\n")
                print(summary)
                print("\n=====================\n")
            
        except Exception as e:
            print(f"오류 발생: {str(e)}")
            sys.exit(1)

if __name__ == "__main__":
    main() 