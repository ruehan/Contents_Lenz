# Contents Lenz 앱 아이콘 가이드

이 폴더는 Contents Lenz 애플리케이션의 아이콘 파일을 저장하는 곳입니다.

## 필요한 아이콘 파일

### Windows

- `icon.ico` - 여러 크기(16x16, 32x32, 48x48, 64x64, 128x128, 256x256)를 포함한 ICO 파일

### macOS

- `icon.icns` - 여러 크기(16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024)를 포함한 ICNS 파일

### Linux

다음 크기의 PNG 파일들:

- `16x16.png`
- `32x32.png`
- `48x48.png`
- `64x64.png`
- `128x128.png`
- `256x256.png`
- `512x512.png`

## 아이콘 생성 방법

1. 먼저 고해상도(1024x1024 픽셀 이상) PNG 아이콘을 디자인합니다.
2. 다음 도구 중 하나를 사용하여 필요한 형식으로 변환합니다:

### electron-icon-maker 사용 (권장)

```bash
# 전역으로 설치
npm install -g electron-icon-maker

# 아이콘 생성 (원본 PNG 파일이 필요합니다)
electron-icon-maker --input=original-icon.png --output=./
```

### 온라인 도구 사용

- [iconvert.tools](https://iconvert.tools/)
- [iConvert Icons](https://iconverticons.com/)
- [Icon Maker](https://www.npmjs.com/package/icon-maker)

## 아이콘 디자인 가이드라인

- **스타일**: Contents Lenz의 보라색 테마(#8e44ad)를 활용하세요.
- **형태**: 단순하고 인식하기 쉬운 형태를 사용하세요.
- **배경**: 투명 배경을 사용하세요.
- **해상도**: 작은 크기에서도 식별 가능해야 합니다.

## 참고 사항

- 아이콘 파일은 `package.json`의 `build` 설정에 지정된 경로에 있어야 합니다.
- 앱 내에서 사용할 추가 아이콘은 이 폴더에 저장할 수 있습니다.
