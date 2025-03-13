# Contents Lenz 1.0.0 - AI 기반 콘텐츠 요약 및 분석 도구

<div align="center">
  <h3>콘텐츠를 더 스마트하게 이해하세요</h3>
</div>

Contents Lenz는 GPT-4o Mini 모델을 활용한 강력한 콘텐츠 요약 및 분석 도구입니다. 긴 문서, 기사, 웹 페이지 등을 쉽게 요약하고 분석하여 핵심 내용을 빠르게 파악할 수 있습니다.

## 주요 기능

### 다양한 콘텐츠 입력 방식

- **텍스트 직접 입력**: 원하는 텍스트를 직접 입력하여 요약
- **파일 업로드**: TXT, PDF, DOCX, DOC 등 다양한 형식의 파일 내용 요약
- **URL 입력**: 웹 페이지 URL을 입력하면 자동으로 콘텐츠를 스크래핑하여 요약
  - **AI 기반 콘텐츠 필터링**: 광고, 관련 기사, 사이드바 등 불필요한 콘텐츠 자동 제거
  - **콘텐츠 편집**: 스크래핑된 콘텐츠를 수동으로 편집 가능

### 요약 및 분석 기능

- **맞춤형 요약**: 짧게, 중간, 길게 등 원하는 길이로 요약 조절
- **키워드 추출**: 텍스트에서 중요 키워드를 자동으로 추출하여 표시
- **언어 감지**: 입력된 텍스트의 언어를 자동으로 감지

### 다국어 지원

- **인터페이스 현지화**: 한국어, 영어, 일본어, 중국어로 전체 UI 제공
- **자동 언어 감지**: 입력된 텍스트의 언어를 자동으로 감지
- **다양한 출력 언어**: 15개 이상의 언어로 요약 결과 출력 가능
  - 한국어, 영어, 일본어, 중국어, 스페인어, 프랑스어, 독일어, 러시아어, 포르투갈어, 이탈리아어, 네덜란드어, 아랍어, 힌디어, 베트남어, 태국어

### 사용자 친화적 인터페이스

- **탭 기반 인터페이스**: 텍스트 입력, 파일 업로드, URL 입력을 쉽게 전환
- **반응형 디자인**: 다양한 화면 크기에 최적화된 UI
- **결과 처리**: 요약 결과 및 키워드를 복사하거나 파일로 저장 가능
- **로딩 인디케이터**: 처리 상태를 시각적으로 표시

## 설치 방법

### 방법 1: 실행 파일 다운로드 (권장)

가장 간단한 방법은 GitHub 릴리스 페이지에서 운영체제에 맞는 실행 파일을 다운로드하는 것입니다:

- **Windows**: `Contents-Lenz-Setup-1.0.0.exe` 파일을 다운로드하여 실행합니다.
- **macOS**: `Contents-Lenz-1.0.0.dmg` 파일을 다운로드하여 설치합니다.

[GitHub 릴리스 페이지](https://github.com/ruehan/Contents_Lenz/releases)에서 최신 버전을 다운로드할 수 있습니다.

### 방법 2: 소스 코드에서 설치

개발자나 소스 코드를 직접 수정하고 싶은 사용자를 위한 방법입니다:

1. 저장소 클론

```bash
git clone https://github.com/ruehan/Contents_Lenz.git
cd Contents_Lenz
```

2. 필요한 패키지 설치

```bash
# API 서버용 패키지 설치
pip install -r requirements.txt

# 일렉트론 UI용 패키지 설치
cd electron
npm install
```

3. OpenAI API 키 설정

`.env` 파일을 프로젝트 루트 디렉토리에 생성하고 다음과 같이 API 키를 설정합니다:

```
OPENAI_API_KEY=your_api_key_here
```

## 사용 방법

### 방법 1: 실행 파일로 사용 (권장)

릴리스 페이지에서 다운로드한 실행 파일을 사용하는 경우:

1. 설치된 애플리케이션을 실행합니다.
2. 원하는 입력 방식(텍스트, 파일, URL)을 선택합니다.
3. 요약 길이와 출력 언어를 설정합니다.
4. "요약하기" 버튼을 클릭하여 결과를 확인합니다.
5. 결과를 복사하거나 파일로 저장할 수 있습니다.

> 참고: 실행 파일 버전에서는 OpenAI API 키를 처음 실행 시 입력하거나 설정 메뉴에서 변경할 수 있습니다.

### 방법 2: 웹 버전으로 접속

[Contents Lenz 웹 버전](https://contents-lenz.onrender.com)

### 방법 3: 소스 코드에서 실행

소스 코드에서 직접 실행하는 경우:

#### 일렉트론 UI 실행 (데스크톱 앱)

```bash
# API 서버 실행
python run_api_server.py

# 새 터미널에서 일렉트론 앱 실행
cd electron
npm start
```

#### 웹 버전 실행

```bash
# 웹 서버 실행
python app.py
```

웹 서버가 실행되면 브라우저에서 다음 URL로 접속할 수 있습니다:

- 웹 앱: http://localhost:8000

## 다국어 지원 상세 설명

Contents Lenz 1.0.0은 다양한 언어 환경에서 사용할 수 있도록 포괄적인 다국어 지원을 제공합니다:

### 인터페이스 현지화

- **UI 언어 선택**: 애플리케이션 상단에 있는 언어 선택기를 통해 인터페이스 언어를 변경할 수 있습니다.
- **지원 언어**: 한국어, 영어, 일본어, 중국어
- **설정 저장**: 선택한 언어 설정이 로컬 스토리지에 저장되어 다음 실행 시에도 유지됩니다.

### 콘텐츠 처리 다국어 지원

- **자동 언어 감지**: 입력된 텍스트의 언어를 자동으로 감지합니다.
- **원본 언어 유지**: 기본적으로 원본 텍스트와 동일한 언어로 요약합니다.
- **출력 언어 선택**: 원하는 언어로 요약 결과를 받을 수 있습니다.

### 활용 사례

- **외국어 문서 이해**: 외국어로 된 문서를 빠르게 이해할 수 있습니다.
- **다국어 콘텐츠 제작**: 한 언어로 작성된 콘텐츠를 다른 언어로 요약하여 다국어 콘텐츠를 쉽게 제작할 수 있습니다.
- **언어 학습**: 원문과 번역된 요약을 비교하여 언어 학습에 활용할 수 있습니다.

## 시스템 요구사항

- **운영체제**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+ 또는 기타 주요 Linux 배포판
- **메모리**: 최소 4GB RAM (8GB 이상 권장)
- **디스크 공간**: 최소 200MB 여유 공간
- **인터넷 연결**: OpenAI API 사용을 위한 인터넷 연결 필요
- **OpenAI API 키**: GPT-4o Mini 모델 사용을 위한 API 키 필요

## 기술 스택

- **일렉트론 UI**: Electron, HTML, CSS, JavaScript (데스크톱 앱)
- **웹 UI**: HTML, CSS, JavaScript (웹 앱)
- **API 서버**: FastAPI, Uvicorn
- **AI 통합**: OpenAI API (GPT-4o Mini)
- **텍스트 처리**: NLTK
- **파일 처리**: PyPDF2, python-docx
- **웹 스크래핑**: BeautifulSoup4, requests

## 향후 개발 계획

Contents Lenz는 지속적으로 개선되고 있으며, 다음과 같은 기능이 추가될 예정입니다:

- **고급 분석 기능**: 감정 분석, 주제 태깅, 가독성 평가
- **추가 콘텐츠 소스**: 유튜브 영상 트랜스크립트 분석, 소셜 미디어 포스트 분석
- **UI/UX 개선**: 다크 모드, 사용자 설정 저장, 히스토리 기능
- **더 다양한 언어 지원**: 인터페이스 및 출력 언어 확장

## 라이센스

MIT License

## 연락처 및 기여

버그 신고, 기능 제안 또는 기여하고 싶으신 분들은 GitHub 이슈를 통해 연락해주세요.

---

© 2025 Contents Lenz | 버전 1.0.0

---

# Contents Lenz 1.0.0 - AI-based Content Summarization and Analysis Tool

<div align="center">
  <h3>Understand Content More Intelligently</h3>
</div>

Contents Lenz is a powerful content summarization and analysis tool powered by the GPT-4o Mini model. It easily summarizes and analyzes long documents, articles, web pages, and more, allowing you to quickly grasp the core content.

## Key Features

### Multiple Content Input Methods

- **Direct Text Input**: Enter your desired text directly for summarization
- **File Upload**: Summarize content from various file formats including TXT, PDF, DOCX, DOC
- **URL Input**: Enter a web page URL to automatically scrape and summarize content
  - **AI-based Content Filtering**: Automatically remove unnecessary content like ads, related articles, sidebars
  - **Content Editing**: Manually edit scraped content if needed

### Summarization and Analysis Features

- **Customizable Summarization**: Adjust summary length as desired (short, medium, long)
- **Keyword Extraction**: Automatically extract and display important keywords from text
- **Language Detection**: Automatically detect the language of input text

### Multilingual Support

- **Interface Localization**: Complete UI available in Korean, English, Japanese, and Chinese
- **Automatic Language Detection**: Automatically detect the language of input text
- **Multiple Output Languages**: Get summary results in more than 15 languages
  - Korean, English, Japanese, Chinese, Spanish, French, German, Russian, Portuguese, Italian, Dutch, Arabic, Hindi, Vietnamese, Thai

### User-Friendly Interface

- **Tab-based Interface**: Easily switch between text input, file upload, and URL input
- **Responsive Design**: UI optimized for various screen sizes
- **Result Processing**: Copy summary results and keywords or save them as files
- **Loading Indicators**: Visual indication of processing status

## Installation

### Method 1: Download Executable (Recommended)

The simplest method is to download the executable file for your operating system from the GitHub release page:

- **Windows**: Download and run the `Contents-Lenz-Setup-1.0.0.exe` file.
- **macOS**: Download and install the `Contents-Lenz-1.0.0.dmg` file.

You can download the latest version from the [GitHub Release Page](https://github.com/ruehan/Contents_Lenz/releases).

### Method 2: Install from Source Code

For developers or users who want to modify the source code directly:

1. Clone the repository

```bash
git clone https://github.com/ruehan/Contents_Lenz.git
cd Contents_Lenz
```

2. Install required packages

```bash
# Install packages for API server
pip install -r requirements.txt

# Install packages for Electron UI
cd electron
npm install
```

3. Set up OpenAI API key

Create a `.env` file in the project root directory and set your API key as follows:

```
OPENAI_API_KEY=your_api_key_here
```

## Usage

### Method 1: Using the Executable (Recommended)

When using the executable file downloaded from the release page:

1. Run the installed application.
2. Select your desired input method (text, file, URL).
3. Set the summary length and output language.
4. Click the "Summarize" button to see the results.
5. You can copy the results or save them as a file.

> Note: In the executable version, you can enter your OpenAI API key at first launch or change it in the settings menu.

### Method 2: Access the Web Version

[Contents Lenz Web Version](https://contents-lenz.onrender.com)

### Method 3: Run from Source Code

When running directly from source code:

#### Run Electron UI (Desktop App)

```bash
# Run API server
python run_api_server.py

# Run Electron app in a new terminal
cd electron
npm start
```

#### Run Web Version

```bash
# Run web server
python app.py
```

Once the web server is running, you can access it in your browser at:

- Web app: http://localhost:8000

## Detailed Multilingual Support

Contents Lenz 1.0.0 provides comprehensive multilingual support for use in various language environments:

### Interface Localization

- **UI Language Selection**: Change the interface language through the language selector at the top of the application.
- **Supported Languages**: Korean, English, Japanese, Chinese
- **Settings Persistence**: Selected language settings are saved in local storage and maintained across sessions.

### Multilingual Content Processing

- **Automatic Language Detection**: Automatically detect the language of input text.
- **Original Language Preservation**: By default, summarize in the same language as the original text.
- **Output Language Selection**: Receive summary results in your desired language.

### Use Cases

- **Foreign Document Understanding**: Quickly understand documents in foreign languages.
- **Multilingual Content Creation**: Easily create multilingual content by summarizing content written in one language into another.
- **Language Learning**: Use for language learning by comparing original text with translated summaries.

## System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+ or other major Linux distributions
- **Memory**: Minimum 4GB RAM (8GB or more recommended)
- **Disk Space**: Minimum 200MB free space
- **Internet Connection**: Internet connection required for OpenAI API usage
- **OpenAI API Key**: API key required for using the GPT-4o Mini model

## Technology Stack

- **Electron UI**: Electron, HTML, CSS, JavaScript (desktop app)
- **Web UI**: HTML, CSS, JavaScript (web app)
- **API Server**: FastAPI, Uvicorn
- **AI Integration**: OpenAI API (GPT-4o Mini)
- **Text Processing**: NLTK
- **File Processing**: PyPDF2, python-docx
- **Web Scraping**: BeautifulSoup4, requests

## Future Development Plans

Contents Lenz is continuously being improved, and the following features are planned for addition:

- **Advanced Analysis Features**: Sentiment analysis, topic tagging, readability assessment
- **Additional Content Sources**: YouTube video transcript analysis, social media post analysis
- **UI/UX Improvements**: Dark mode, user settings storage, history functionality
- **More Language Support**: Expanded interface and output languages

## License

MIT License

## Contact and Contribution

For bug reports, feature suggestions, or if you'd like to contribute, please contact us through GitHub Issues.

---

© 2025 Contents Lenz | Version 1.0.0
