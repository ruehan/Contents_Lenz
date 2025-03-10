import os
from pathlib import Path
from dotenv import load_dotenv

# .env 파일 로드
BASE_DIR = Path(__file__).parent.parent
ENV_PATH = BASE_DIR / '.env'
load_dotenv(ENV_PATH)

# 애플리케이션 기본 설정
APP_NAME = "Contents Lenz"
APP_VERSION = "0.1.0"
APP_AUTHOR = "Contents Lenz Team"

# 디렉토리 경로
RESOURCES_DIR = BASE_DIR / "src" / "resources"
TEMP_DIR = BASE_DIR / "temp"
OUTPUT_DIR = BASE_DIR / "output"

# OpenAI API 설정
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = "gpt-4o-mini"  # GPT-4o Mini 모델 사용
MAX_TOKENS = 128000  # 최대 토큰 수 (GPT-4o Mini의 컨텍스트 윈도우)

# UI 설정
DEFAULT_WINDOW_WIDTH = 1200
DEFAULT_WINDOW_HEIGHT = 800
DEFAULT_FONT_FAMILY = "Arial"
DEFAULT_FONT_SIZE = 10

# 요약 설정
SUMMARY_LENGTHS = {
    "short": "100단어 이내의 간결한 요약",
    "medium": "300단어 내외의 중간 길이 요약",
    "long": "500단어 이상의 상세한 요약"
}

SUMMARY_FORMATS = {
    "bullet": "글머리 기호(•)를 사용한 요약",
    "paragraph": "단락 형식의 요약",
    "structured": "구조화된 형식(제목, 소제목 등)의 요약"
}

# 파일 형식 설정
SUPPORTED_TEXT_FORMATS = [".txt", ".md", ".html"]
SUPPORTED_DOCUMENT_FORMATS = [".pdf", ".docx", ".doc"]
SUPPORTED_OUTPUT_FORMATS = [".txt", ".pdf", ".docx"]

# 디렉토리 생성 함수
def create_required_directories():
    """필요한 디렉토리가 없을 경우 생성합니다."""
    for directory in [TEMP_DIR, OUTPUT_DIR]:
        if not directory.exists():
            directory.mkdir(parents=True, exist_ok=True) 