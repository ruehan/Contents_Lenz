# Contents Lenz - AI 기반 콘텐츠 요약 및 분석 도구

Contents Lenz는 GPT-4o Mini 모델을 활용한 콘텐츠 요약 및 분석 도구입니다. 긴 문서, 기사, PDF 등을 쉽게 요약하고 분석할 수 있습니다.

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
  - 다국어 지원: 원본 언어 감지 및 선택한 언어로 요약 출력

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

## 언어 지원

Contents Lenz는 다양한 언어로 된 콘텐츠를 처리할 수 있습니다:

- **자동 언어 감지**: 입력된 텍스트의 언어를 자동으로 감지합니다.
- **원본 언어 유지**: 기본적으로 원본 텍스트와 동일한 언어로 요약합니다.
- **출력 언어 선택**: 원하는 언어로 요약 결과를 받을 수 있습니다 (한국어, 영어, 일본어, 중국어 등).

이 기능을 통해 외국어로 된 문서를 빠르게 이해하거나, 다국어 환경에서 콘텐츠를 공유할 때 유용하게 활용할 수 있습니다.

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

## 사용 방법

### 일렉트론 UI 실행 (권장)

일렉트론 기반 데스크톱 UI를 사용하는 것이 가장 편리합니다:

```bash
cd electron
npm install
npm start
```

### API 서버 실행

API 서버를 실행하여 다양한 클라이언트에서 사용할 수 있습니다:

```bash
python main.py --api --port 8000
```

또는 간단히:

```bash
python main.py
```

### 명령줄 모드

SSH 환경이나 스크립트에서 사용할 때는 명령줄 모드를 사용할 수 있습니다:

```bash
python main.py --headless --input input.txt --output summary.txt --length medium --format paragraph --language ko
```

옵션:

- `--input`: 요약할 텍스트 파일 경로 (필수)
- `--output`: 요약 결과를 저장할 파일 경로 (선택, 지정하지 않으면 콘솔에 출력)
- `--length`: 요약 길이 (short, medium, long, 기본값: medium)
- `--format`: 요약 형식 (bullet, paragraph, structured, 기본값: paragraph)
- `--language`: 요약 결과 언어 (ko, en, ja, zh 등, 기본값: 원본 언어)

## API 서버

### API 주소

배포된 API 서버는 다음 주소에서 접근할 수 있습니다:

- **API 주소**: https://contents-lenz.onrender.com
- **API 문서**: https://contents-lenz.onrender.com/docs
- **ReDoc 문서**: https://contents-lenz.onrender.com/redoc

### API 서버 실행 방법

```bash
# 기본 실행
uvicorn app:app --host 0.0.0.0 --port 8000

# 개발 모드 (코드 변경 시 자동 재시작)
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 또는 app.py 실행

```bash
python app.py
```

### 기존 run_api_server.py 사용

```bash
python run_api_server.py --host 0.0.0.0 --port 8000 --reload
```

API 서버가 실행되면 다음 URL에서 API 문서를 확인할 수 있습니다:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 개발 로드맵

- **1단계**: 기본 버전 - 핵심 기능 개발 및 GPT-4o Mini API 연동, 텍스트 입력 및 기본 요약 기능 구현
- **2단계**: 기능 확장 - 파일 업로드 및 URL 스크래핑 추가, 고급 분석 기능 구현
- **3단계**: 최적화 및 마무리 - 사용자 피드백 기반 UI/UX 개선, 성능 최적화 및 에러 처리 강화

## 기술 스택

- **일렉트론 UI**: Electron, HTML, CSS, JavaScript
- **API 서버**: FastAPI, Uvicorn
- **AI 통합**: OpenAI API (GPT-4o Mini)
- **텍스트 처리**: NLTK
- **파일 처리**: PyPDF2, python-docx
- **웹 스크래핑**: BeautifulSoup4, requests
- **데이터 시각화**: Matplotlib (선택적)

## 라이센스

MIT License
