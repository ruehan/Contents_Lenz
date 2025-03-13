# Contents Lenz 1.0.0 릴리즈

<div align="center">
  <h3>AI 기반 콘텐츠 요약 및 분석 도구</h3>
</div>

Contents Lenz의 첫 번째 정식 버전을 발표하게 되어 기쁩니다! 이 릴리즈는 베타 테스트 기간 동안 수집된 피드백을 바탕으로 안정성, 성능, 사용자 경험을 크게 개선했습니다.

## 주요 기능

- **다양한 콘텐츠 입력 방식**: 텍스트 직접 입력, 파일 업로드(TXT, PDF, DOCX, DOC), URL 입력
- **AI 기반 콘텐츠 필터링**: 웹 페이지에서 불필요한 콘텐츠 자동 제거
- **맞춤형 요약**: 짧게, 중간, 길게 등 원하는 길이로 요약 조절
- **키워드 추출**: 중요 키워드 자동 추출
- **언어 감지**: 입력 텍스트의 언어 자동 감지
- **다국어 지원**: 한국어, 영어, 일본어, 중국어 인터페이스 및 15개 이상의 출력 언어 지원
- **사용자 친화적 인터페이스**: 탭 기반 인터페이스, 반응형 디자인, 결과 저장 기능

## 변경사항

### 새로운 기능

- **다국어 인터페이스**: 한국어, 영어, 일본어, 중국어로 전체 UI 제공
- **언어 선택기**: 애플리케이션 상단에 언어 선택기 추가
- **설정 저장**: 언어 설정이 로컬 스토리지에 저장되어 다음 실행 시에도 유지
- **웹 버전 출시**: https://contents-lenz.onrender.com 에서 웹 버전 이용 가능

### 개선사항

- **URL 스크래핑 개선**: 더 정확한 콘텐츠 추출 및 필터링
- **요약 품질 향상**: GPT-4o Mini 모델 적용으로 요약 품질 개선
- **UI/UX 개선**: 더 직관적인 인터페이스 및 사용자 경험 개선
- **성능 최적화**: 처리 속도 및 메모리 사용량 개선
- **오류 처리 개선**: 더 명확한 오류 메시지 및 예외 처리

### 버그 수정

- URL 스크래핑 중 발생하는 오류 수정
- 파일 업로드 시 특정 형식의 파일이 처리되지 않는 문제 해결
- 긴 텍스트 처리 시 발생하는 메모리 문제 해결
- 다양한 UI 관련 버그 수정

## 다운로드

### 데스크톱 앱

| 운영체제 | 다운로드 링크                                                                                                                   | 파일 크기 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Windows  | [Contents-Lenz-Setup-1.0.0.exe](https://github.com/ruehan/Contents_Lenz/releases/download/v1.0.0/Contents-Lenz-Setup-1.0.0.exe) | 약 120MB  |
| macOS    | [Contents-Lenz-1.0.0.dmg](https://github.com/ruehan/Contents_Lenz/releases/download/v1.0.0/Contents-Lenz-1.0.0.dmg)             | 약 110MB  |
| Linux    | [Contents-Lenz-1.0.0.AppImage](https://github.com/ruehan/Contents_Lenz/releases/download/v1.0.0/Contents-Lenz-1.0.0.AppImage)   | 약 115MB  |

### 웹 버전

[Contents Lenz 웹 버전](https://contents-lenz.onrender.com)

## 설치 방법

### Windows

1. `Contents-Lenz-Setup-1.0.0.exe` 파일을 다운로드합니다.
2. 다운로드한 파일을 실행하고 설치 마법사의 지시를 따릅니다.
3. 설치가 완료되면 바탕화면 또는 시작 메뉴에서 Contents Lenz를 실행할 수 있습니다.

### macOS

1. `Contents-Lenz-1.0.0.dmg` 파일을 다운로드합니다.
2. 다운로드한 DMG 파일을 열고 Contents Lenz 아이콘을 Applications 폴더로 드래그합니다.
3. Applications 폴더 또는 Launchpad에서 Contents Lenz를 실행할 수 있습니다.

### Linux

1. `Contents-Lenz-1.0.0.AppImage` 파일을 다운로드합니다.
2. 파일에 실행 권한을 부여합니다: `chmod +x Contents-Lenz-1.0.0.AppImage`
3. AppImage 파일을 실행합니다: `./Contents-Lenz-1.0.0.AppImage`

## 시스템 요구사항

- **운영체제**: Windows 10/11, macOS 10.15+, Ubuntu 18.04+ 또는 기타 주요 Linux 배포판
- **메모리**: 최소 4GB RAM (8GB 이상 권장)
- **디스크 공간**: 최소 200MB 여유 공간
- **인터넷 연결**: OpenAI API 사용을 위한 인터넷 연결 필요
- **OpenAI API 키**: GPT-4o Mini 모델 사용을 위한 API 키 필요

## 알려진 문제점

- 매우 긴 텍스트(10만 자 이상)를 처리할 때 성능이 저하될 수 있습니다.
- 일부 복잡한 레이아웃의 웹 페이지에서 스크래핑이 정확하지 않을 수 있습니다.
- 특정 언어(아랍어, 히브리어 등)에서 텍스트 방향이 올바르게 표시되지 않을 수 있습니다.

## 피드백 및 지원

버그 신고, 기능 제안 또는 기타 피드백은 [GitHub 이슈](https://github.com/ruehan/Contents_Lenz/issues)를 통해 제출해 주세요.

## 감사의 말

Contents Lenz 개발에 기여하고 베타 테스트에 참여해 주신 모든 분들께 감사드립니다. 여러분의 피드백과 지원이 이 프로젝트를 가능하게 했습니다.

---

© 2025 Contents Lenz | 버전 1.0.0
