# Contents Lenz - AI 기반 콘텐츠 요약 및 분석 도구

Contents Lenz는 GPT-4o Mini 모델을 활용한 GUI 기반 콘텐츠 요약 및 분석 도구입니다. 긴 문서, 기사, PDF 등을 쉽게 요약하고 분석할 수 있는 직관적인 인터페이스를 제공합니다.

## 주요 기능

- **콘텐츠 입력 및 로드**

  - 텍스트 직접 입력
  - 파일 업로드 (TXT, PDF, DOCX)
  - URL 입력을 통한 웹 콘텐츠 스크래핑 (추후 추가 예정)
  - 유튜브 영상 URL을 통한 자동 트랜스크립트 분석 (추후 추가 예정)

- **요약 기능**

  - 요약 길이 조절 (짧은 요약, 중간 길이, 상세 요약)
  - 글머리 기호 또는 단락 형식 선택 옵션
  - 주요 키워드 및 핵심 아이디어 추출

- **고급 분석 기능** (추후 추가 예정)

  - 감정 분석 (긍정/부정/중립)
  - 주요 주제 자동 태깅 및 분류
  - 텍스트 가독성 평가
  - SEO 최적화 제안

- **결과 출력 및 공유**
  - 결과 저장 (PDF, DOCX, TXT 형식)
  - 클립보드 복사 기능
  - 이메일 공유 옵션 (추후 추가 예정)
  - 소셜 미디어 공유 통합 (추후 추가 예정)

## 설치 방법

1. 저장소 클론

```bash
git clone https://github.com/ruehan/Contents_Lenz.git
cd Contents_Lenz
```

2. 필요한 패키지 설치

```bash
pip install -r requirements.txt
```

3. OpenAI API 키 설정

`.env` 파일을 프로젝트 루트 디렉토리에 생성하고 다음과 같이 API 키를 설정합니다:

```
OPENAI_API_KEY=your_api_key_here
```

4. 애플리케이션 실행

```bash
python main.py
```

## 실행 모드

### GUI 모드 (기본)

```bash
python main.py
```

### 헤드리스 모드 (명령줄)

SSH 환경이나 GUI를 사용할 수 없는 환경에서는 헤드리스 모드를 사용할 수 있습니다:

```bash
python main.py --headless --input input.txt --output summary.txt --length medium --format paragraph
```

옵션:

- `--input`: 요약할 텍스트 파일 경로 (필수)
- `--output`: 요약 결과를 저장할 파일 경로 (선택, 지정하지 않으면 콘솔에 출력)
- `--length`: 요약 길이 (short, medium, long, 기본값: medium)
- `--format`: 요약 형식 (bullet, paragraph, structured, 기본값: paragraph)

## 개발 로드맵

- **1단계**: 기본 버전 - 핵심 UI 개발 및 GPT-4o Mini API 연동, 텍스트 입력 및 기본 요약 기능 구현
- **2단계**: 기능 확장 - 파일 업로드 및 URL 스크래핑 추가, 고급 분석 기능 구현
- **3단계**: 최적화 및 마무리 - 사용자 피드백 기반 UI/UX 개선, 성능 최적화 및 에러 처리 강화

## 기술 스택

- **GUI 프레임워크**: PyQt6
- **AI 통합**: OpenAI API (GPT-4o Mini)
- **텍스트 처리**: NLTK
- **파일 처리**: PyPDF2, python-docx
- **웹 스크래핑**: BeautifulSoup4, requests
- **데이터 시각화**: Matplotlib

## 라이센스

MIT License
