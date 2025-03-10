import sys
import os
import argparse
from PyQt6.QtWidgets import QApplication
from src.ui.main_window import MainWindow
from src.config import create_required_directories
from src.models.openai_client import OpenAIClient
from src.utils.file_handler import FileHandler

def main():
    """애플리케이션 메인 함수"""
    parser = argparse.ArgumentParser(description='Contents Lenz - AI 기반 콘텐츠 요약 및 분석 도구')
    parser.add_argument('--headless', action='store_true', help='GUI 없이 명령줄 모드로 실행')
    parser.add_argument('--web', action='store_true', help='웹 인터페이스 모드로 실행')
    parser.add_argument('--port', type=int, default=5000, help='웹 서버 포트 (기본값: 5000)')
    parser.add_argument('--input', type=str, help='요약할 텍스트 파일 경로')
    parser.add_argument('--output', type=str, help='요약 결과를 저장할 파일 경로')
    parser.add_argument('--length', type=str, choices=['short', 'medium', 'long'], default='medium', help='요약 길이 (short, medium, long)')
    parser.add_argument('--format', type=str, choices=['bullet', 'paragraph', 'structured'], default='paragraph', help='요약 형식 (bullet, paragraph, structured)')
    
    args = parser.parse_args()
    
    create_required_directories()
    
    if args.web:
        try:
            from src.web_app import run_web_app
            print(f"웹 인터페이스를 시작합니다. http://localhost:{args.port} 에서 접속할 수 있습니다.")
            print("종료하려면 Ctrl+C를 누르세요.")
            run_web_app(port=args.port, debug=False)
        except ImportError:
            print("웹 인터페이스를 실행하려면 Flask가 필요합니다.")
            print("pip install flask 명령으로 설치하세요.")
            sys.exit(1)
        except Exception as e:
            print(f"웹 인터페이스 실행 중 오류가 발생했습니다: {str(e)}")
            sys.exit(1)
    
    elif args.headless:
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
            
            print("텍스트 요약 중...")
            summary = client.summarize_text(input_text, args.length, args.format)
            
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
    
    else:
        try:
            app = QApplication(sys.argv)
            
            window = MainWindow()
            window.show()
            
            sys.exit(app.exec())
        except Exception as e:
            print(f"GUI 모드 실행 중 오류가 발생했습니다: {str(e)}")
            print("GUI를 사용할 수 없는 환경에서는 --headless 또는 --web 옵션을 사용하세요.")
            sys.exit(1)

if __name__ == "__main__":
    main() 