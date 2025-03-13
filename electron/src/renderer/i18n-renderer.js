// 현지화 스크립트
document.addEventListener("DOMContentLoaded", () => {
	// 언어 선택기 초기화
	const languageSelector = document.getElementById("languageSelector");
	if (!languageSelector) {
		console.error("언어 선택기를 찾을 수 없습니다.");
		return;
	}

	// 번역 데이터
	const translations = {
		ko: {
			// 앱 제목 및 설명
			appTitle: "Contents Lenz",
			appDescription: "AI 기반 콘텐츠 요약 및 분석 도구",

			// API 상태
			apiStatus: "API 상태: ",
			apiConnected: "연결됨",
			apiDisconnected: "연결 안됨",
			checking: "확인 중...",

			// 탭
			textInputTab: "텍스트 입력",
			fileUploadTab: "파일 업로드",
			urlInputTab: "URL 입력",

			// 텍스트 입력
			textInputLabel: "요약할 텍스트:",
			textPlaceholder: "여기에 요약할 텍스트를 입력하세요...",

			// 파일 업로드
			selectFile: "파일 선택",
			supportedFormats: "지원 형식: TXT, PDF, DOCX, DOC",
			noFileSelected: "선택된 파일 없음",

			// URL 입력
			urlInputLabel: "웹 페이지 URL:",
			urlPlaceholder: "https://example.com",
			fetchUrl: "가져오기",
			aiFilterLabel: "AI 필터링 사용 (주요 내용만 추출)",
			aiFilterDescription: "AI 필터링은 광고, 관련 기사, 메뉴 등 불필요한 콘텐츠를 자동으로 제거합니다.",
			noTitle: "제목 없음",
			noContent: "콘텐츠를 가져올 수 없습니다.",

			// 콘텐츠 편집
			editContent: "콘텐츠 편집",
			saveContent: "편집 저장",
			cancelEdit: "편집 취소",
			editHelpText: "불필요한 광고, 관련 기사 등을 제거하여 요약 품질을 높일 수 있습니다.",

			// 요약 설정
			settingsTitle: "요약 설정",
			summarySettings: "요약 설정",
			summaryLength: "요약 길이:",
			short: "짧게",
			medium: "중간",
			long: "길게",
			outputLanguage: "출력 언어:",
			autoDetect: "자동 감지",

			// 버튼
			summarize: "요약하기",

			// 결과
			summaryResult: "요약 결과",
			detectedLanguage: "감지된 언어: ",
			relatedKeywords: "관련 키워드",
			placeholderText: "왼쪽에서 텍스트를 입력하거나 파일을 업로드하거나 URL을 입력한 후 요약하기 버튼을 클릭하세요.",

			// 키워드 예시
			keyword: "키워드",
			extraction: "추출",
			example: "예시",

			// 버튼 타이틀
			copy: "복사",
			save: "저장",
			copyKeywords: "키워드 복사",

			// 로딩
			processing: "처리 중...",

			// 푸터
			copyright: "© 2025 Contents Lenz",
		},
		en: {
			// App title and description
			appTitle: "Contents Lenz",
			appDescription: "AI-based Content Summarization and Analysis Tool",

			// API status
			apiStatus: "API Status: ",
			apiConnected: "Connected",
			apiDisconnected: "Disconnected",
			checking: "Checking...",

			// Tabs
			textInputTab: "Text Input",
			fileUploadTab: "File Upload",
			urlInputTab: "URL Input",

			// Text input
			textInputLabel: "Text to summarize:",
			textPlaceholder: "Enter text to summarize here...",

			// File upload
			selectFile: "Select File",
			supportedFormats: "Supported formats: TXT, PDF, DOCX, DOC",
			noFileSelected: "No file selected",

			// URL input
			urlInputLabel: "Web page URL:",
			urlPlaceholder: "https://example.com",
			fetchUrl: "Fetch",
			aiFilterLabel: "Use AI filtering (extract main content only)",
			aiFilterDescription: "AI filtering automatically removes ads, related articles, menus, and other unnecessary content.",
			noTitle: "No title",
			noContent: "Could not retrieve content.",

			// Content editing
			editContent: "Edit Content",
			saveContent: "Save Edit",
			cancelEdit: "Cancel Edit",
			editHelpText: "You can improve summary quality by removing unnecessary ads, related articles, etc.",

			// Summary settings
			settingsTitle: "Summary Settings",
			summarySettings: "Summary Settings",
			summaryLength: "Summary Length:",
			short: "Short",
			medium: "Medium",
			long: "Long",
			outputLanguage: "Output Language:",
			autoDetect: "Auto Detect",

			// Buttons
			summarize: "Summarize",

			// Results
			summaryResult: "Summary Result",
			detectedLanguage: "Detected Language: ",
			relatedKeywords: "Related Keywords",
			placeholderText: "Enter text, upload a file, or input a URL on the left, then click the Summarize button.",

			// Keyword examples
			keyword: "Keyword",
			extraction: "Extraction",
			example: "Example",

			// Button titles
			copy: "Copy",
			save: "Save",
			copyKeywords: "Copy Keywords",

			// Loading
			processing: "Processing...",

			// Footer
			copyright: "© 2025 Contents Lenz",
		},
		ja: {
			// アプリのタイトルと説明
			appTitle: "Contents Lenz",
			appDescription: "AI搭載コンテンツ要約・分析ツール",

			// API状態
			apiStatus: "API状態: ",
			apiConnected: "接続済み",
			apiDisconnected: "未接続",
			checking: "確認中...",

			// タブ
			textInputTab: "テキスト入力",
			fileUploadTab: "ファイルアップロード",
			urlInputTab: "URL入力",

			// テキスト入力
			textInputLabel: "要約するテキスト:",
			textPlaceholder: "ここに要約するテキストを入力してください...",

			// ファイルアップロード
			selectFile: "ファイル選択",
			supportedFormats: "対応形式: TXT, PDF, DOCX, DOC",
			noFileSelected: "ファイルが選択されていません",

			// URL入力
			urlInputLabel: "ウェブページURL:",
			urlPlaceholder: "https://example.com",
			fetchUrl: "取得",
			aiFilterLabel: "AIフィルタリングを使用（主要コンテンツのみ抽出）",
			aiFilterDescription: "AIフィルタリングは広告、関連記事、メニューなどの不要なコンテンツを自動的に削除します。",
			noTitle: "タイトルなし",
			noContent: "コンテンツを取得できませんでした。",

			// コンテンツ編集
			editContent: "コンテンツ編集",
			saveContent: "編集を保存",
			cancelEdit: "編集をキャンセル",
			editHelpText: "不要な広告や関連記事などを削除して、要約の品質を向上させることができます。",

			// 要約設定
			settingsTitle: "要約設定",
			summarySettings: "要約設定",
			summaryLength: "要約の長さ:",
			short: "短く",
			medium: "中程度",
			long: "長く",
			outputLanguage: "出力言語:",
			autoDetect: "自動検出",

			// ボタン
			summarize: "要約する",

			// 結果
			summaryResult: "要約結果",
			detectedLanguage: "検出された言語: ",
			relatedKeywords: "関連キーワード",
			placeholderText: "左側でテキストを入力するか、ファイルをアップロードするか、URLを入力してから、要約ボタンをクリックしてください。",

			// キーワード例
			keyword: "キーワード",
			extraction: "抽出",
			example: "例",

			// ボタンタイトル
			copy: "コピー",
			save: "保存",
			copyKeywords: "キーワードをコピー",

			// ローディング
			processing: "処理中...",

			// フッター
			copyright: "© 2025 Contents Lenz",
		},
		zh: {
			// 应用标题和描述
			appTitle: "Contents Lenz",
			appDescription: "AI内容摘要和分析工具",

			// API状态
			apiStatus: "API状态: ",
			apiConnected: "已连接",
			apiDisconnected: "未连接",
			checking: "检查中...",

			// 标签
			textInputTab: "文本输入",
			fileUploadTab: "文件上传",
			urlInputTab: "URL输入",

			// 文本输入
			textInputLabel: "要摘要的文本:",
			textPlaceholder: "在此输入要摘要的文本...",

			// 文件上传
			selectFile: "选择文件",
			supportedFormats: "支持格式: TXT, PDF, DOCX, DOC",
			noFileSelected: "未选择文件",

			// URL输入
			urlInputLabel: "网页URL:",
			urlPlaceholder: "https://example.com",
			fetchUrl: "获取",
			aiFilterLabel: "使用AI过滤（仅提取主要内容）",
			aiFilterDescription: "AI过滤会自动删除广告、相关文章、菜单等不必要的内容。",
			noTitle: "无标题",
			noContent: "无法获取内容。",

			// 内容编辑
			editContent: "编辑内容",
			saveContent: "保存编辑",
			cancelEdit: "取消编辑",
			editHelpText: "您可以通过删除不必要的广告、相关文章等来提高摘要质量。",

			// 摘要设置
			settingsTitle: "摘要设置",
			summarySettings: "摘要设置",
			summaryLength: "摘要长度:",
			short: "短",
			medium: "中",
			long: "长",
			outputLanguage: "输出语言:",
			autoDetect: "自动检测",

			// 按钮
			summarize: "摘要",

			// 结果
			summaryResult: "摘要结果",
			detectedLanguage: "检测到的语言: ",
			relatedKeywords: "相关关键词",
			placeholderText: "在左侧输入文本、上传文件或输入URL，然后点击摘要按钮。",

			// 关键词示例
			keyword: "关键词",
			extraction: "提取",
			example: "示例",

			// 按钮标题
			copy: "复制",
			save: "保存",
			copyKeywords: "复制关键词",

			// 加载
			processing: "处理中...",

			// 页脚
			copyright: "© 2025 Contents Lenz",
		},
	};

	// 현재 언어 설정
	let currentLanguage = "ko";

	// 로컬 스토리지에서 언어 설정 로드
	const savedLanguage = localStorage.getItem("language");
	if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
		currentLanguage = savedLanguage;
	}

	// 언어 선택기 초기값 설정
	languageSelector.value = currentLanguage;

	// 언어 선택기에 옵션 추가
	updateLanguageSelector();

	// 언어 변경 이벤트 리스너
	languageSelector.addEventListener("change", (e) => {
		currentLanguage = e.target.value;
		localStorage.setItem("language", currentLanguage);
		updateUILanguage();
	});

	// 언어 선택기 옵션 업데이트
	function updateLanguageSelector() {
		// 기존 옵션 제거
		languageSelector.innerHTML = "";

		// 새 옵션 추가
		const languageNames = {
			ko: "한국어",
			en: "English",
			ja: "日本語",
			zh: "中文",
		};

		Object.keys(translations).forEach((langCode) => {
			const option = document.createElement("option");
			option.value = langCode;
			option.textContent = languageNames[langCode] || langCode;
			languageSelector.appendChild(option);
		});

		// 현재 언어 선택
		languageSelector.value = currentLanguage;
	}

	// UI 요소 텍스트 업데이트 함수
	function updateUILanguage() {
		const t = translations[currentLanguage];

		// HTML 문서의 lang 속성 업데이트
		document.documentElement.lang = currentLanguage;

		// 앱 제목 및 설명
		const appTitle = document.querySelector(".logo-container h1");
		const appDesc = document.querySelector(".logo-container p");

		if (appTitle) appTitle.textContent = t.appTitle;
		if (appDesc) appDesc.textContent = t.appDescription;

		// API 상태
		const apiStatus = document.getElementById("apiStatus");
		if (apiStatus) {
			const statusText = apiStatus.textContent;
			if (statusText.includes("확인 중") || statusText.includes("Checking") || statusText.includes("確認中") || statusText.includes("检查中")) {
				apiStatus.textContent = `${t.apiStatus}${t.checking}`;
			} else if (statusText.includes("연결됨") || statusText.includes("Connected") || statusText.includes("接続済み") || statusText.includes("已连接")) {
				apiStatus.textContent = `${t.apiStatus}${t.apiConnected}`;
			} else if (statusText.includes("연결 안됨") || statusText.includes("Disconnected") || statusText.includes("未接続") || statusText.includes("未连接")) {
				apiStatus.textContent = `${t.apiStatus}${t.apiDisconnected}`;
			}
		}

		// 탭 버튼
		const textTabBtn = document.getElementById("textTabBtn");
		const fileTabBtn = document.getElementById("fileTabBtn");
		const urlTabBtn = document.getElementById("urlTabBtn");

		if (textTabBtn) textTabBtn.innerHTML = `<i class="fas fa-font"></i> ${t.textInputTab}`;
		if (fileTabBtn) fileTabBtn.innerHTML = `<i class="fas fa-file-alt"></i> ${t.fileUploadTab}`;
		if (urlTabBtn) urlTabBtn.innerHTML = `<i class="fas fa-globe"></i> ${t.urlInputTab}`;

		// 입력 레이블
		const textInputLabel = document.querySelector('label[for="inputText"]');
		const fileFormatInfo = document.querySelector(".file-format-info p");
		const urlInputLabel = document.querySelector('label[for="inputUrl"]');

		if (textInputLabel) textInputLabel.textContent = t.textInputLabel;
		if (fileFormatInfo) fileFormatInfo.innerHTML = `<i class="fas fa-info-circle"></i> ${t.supportedFormats}`;
		if (urlInputLabel) urlInputLabel.textContent = t.urlInputLabel;

		// 플레이스홀더 텍스트
		const inputText = document.getElementById("inputText");
		const inputUrl = document.getElementById("inputUrl");

		if (inputText) inputText.placeholder = t.textPlaceholder;
		if (inputUrl) inputUrl.placeholder = t.urlPlaceholder;

		// 선택된 파일 텍스트
		const selectedFile = document.getElementById("selectedFile");
		if (
			selectedFile &&
			(selectedFile.textContent.includes("선택된 파일 없음") ||
				selectedFile.textContent.includes("No file selected") ||
				selectedFile.textContent.includes("ファイルが選択されていません") ||
				selectedFile.textContent.includes("未选择文件"))
		) {
			selectedFile.textContent = t.noFileSelected;
		}

		// 버튼
		const selectFileBtn = document.getElementById("selectFileBtn");
		const fetchUrlBtn = document.getElementById("fetchUrlBtn");
		const summarizeBtn = document.getElementById("summarizeBtn");

		if (selectFileBtn) selectFileBtn.innerHTML = `<i class="fas fa-file-upload"></i> ${t.selectFile}`;
		if (fetchUrlBtn && fetchUrlBtn.querySelector("span")) fetchUrlBtn.querySelector("span").textContent = t.fetchUrl;
		if (summarizeBtn) summarizeBtn.innerHTML = `<i class="fas fa-magic"></i> ${t.summarize}`;

		// AI 필터 체크박스
		const aiFilterLabel = document.querySelector(".checkbox-container span:last-child");
		const aiFilterInfo = document.querySelector(".ai-filter-info");

		if (aiFilterLabel) aiFilterLabel.textContent = t.aiFilterLabel;
		if (aiFilterInfo) aiFilterInfo.innerHTML = `<i class="fas fa-info-circle"></i> ${t.aiFilterDescription}`;

		// 편집 관련
		const editContentBtn = document.getElementById("editContentBtn");
		const saveContentBtn = document.getElementById("saveContentBtn");
		const cancelEditBtn = document.getElementById("cancelEditBtn");
		const editHelpText = document.querySelector(".edit-help-text");

		if (editContentBtn) editContentBtn.setAttribute("title", t.editContent);
		if (saveContentBtn) saveContentBtn.setAttribute("title", t.saveContent);
		if (cancelEditBtn) cancelEditBtn.setAttribute("title", t.cancelEdit);
		if (editHelpText) editHelpText.innerHTML = `<i class="fas fa-info-circle"></i> ${t.editHelpText}`;

		// 요약 설정
		const settingsHeader = document.querySelector(".settings-panel h3");
		const summarySettingsTitle = document.querySelector("h2.summary-settings-title");
		const summaryLengthLabel = document.querySelector('label[for="summaryLength"]');
		const shortOption = document.querySelector('#summaryLength option[value="short"]');
		const mediumOption = document.querySelector('#summaryLength option[value="medium"]');
		const longOption = document.querySelector('#summaryLength option[value="long"]');
		const outputLanguageLabel = document.querySelector('label[for="outputLanguage"]');
		const autoDetectOption = document.querySelector('#outputLanguage option[value="auto"]');

		if (settingsHeader) settingsHeader.innerHTML = `<i class="fas fa-cog"></i> ${t.settingsTitle}`;
		if (summarySettingsTitle) summarySettingsTitle.textContent = t.summarySettings;
		if (summaryLengthLabel) summaryLengthLabel.textContent = t.summaryLength;
		if (shortOption) shortOption.textContent = t.short;
		if (mediumOption) mediumOption.textContent = t.medium;
		if (longOption) longOption.textContent = t.long;
		if (outputLanguageLabel) outputLanguageLabel.textContent = t.outputLanguage;
		if (autoDetectOption) autoDetectOption.textContent = t.autoDetect;

		// 결과 섹션
		const resultHeader = document.querySelector(".result-header h3");
		const detectedLanguageEl = document.getElementById("detectedLanguage");
		const resultContent = document.getElementById("resultContent");
		const copyResultBtn = document.getElementById("copyResultBtn");
		const saveResultBtn = document.getElementById("saveResultBtn");

		if (resultHeader) resultHeader.innerHTML = `<i class="fas fa-file-alt"></i> ${t.summaryResult}`;
		if (copyResultBtn) copyResultBtn.setAttribute("title", t.copy);
		if (saveResultBtn) saveResultBtn.setAttribute("title", t.save);

		if (detectedLanguageEl) {
			const langText = detectedLanguageEl.textContent;
			if (langText.includes("감지된 언어") || langText.includes("Detected Language") || langText.includes("検出された言語") || langText.includes("检测到的语言")) {
				const langValue = langText.split(":")[1].trim();
				detectedLanguageEl.textContent = `${t.detectedLanguage}${langValue === "-" ? "-" : langValue}`;
			}
		}

		if (resultContent && resultContent.classList.contains("empty-content")) {
			const placeholderText = resultContent.querySelector(".placeholder-text");
			if (placeholderText) {
				placeholderText.textContent = t.placeholderText;
			}
		}

		// 출력 언어 선택 옵션 현지화
		const outputLanguage = document.getElementById("outputLanguage");
		if (outputLanguage) {
			// 자동 감지 옵션 현지화
			const autoOption = outputLanguage.querySelector('option[value="auto"]');
			if (autoOption) autoOption.textContent = t.autoDetect;

			// 언어 이름 현지화 데이터
			const languageNames = {
				ko: {
					ko: "한국어",
					en: "영어",
					ja: "일본어",
					zh: "중국어",
					es: "스페인어",
					fr: "프랑스어",
					de: "독일어",
					ru: "러시아어",
					pt: "포르투갈어",
					it: "이탈리아어",
					nl: "네덜란드어",
					ar: "아랍어",
					hi: "힌디어",
					vi: "베트남어",
					th: "태국어",
				},
				en: {
					ko: "Korean",
					en: "English",
					ja: "Japanese",
					zh: "Chinese",
					es: "Spanish",
					fr: "French",
					de: "German",
					ru: "Russian",
					pt: "Portuguese",
					it: "Italian",
					nl: "Dutch",
					ar: "Arabic",
					hi: "Hindi",
					vi: "Vietnamese",
					th: "Thai",
				},
				ja: {
					ko: "韓国語",
					en: "英語",
					ja: "日本語",
					zh: "中国語",
					es: "スペイン語",
					fr: "フランス語",
					de: "ドイツ語",
					ru: "ロシア語",
					pt: "ポルトガル語",
					it: "イタリア語",
					nl: "オランダ語",
					ar: "アラビア語",
					hi: "ヒンディー語",
					vi: "ベトナム語",
					th: "タイ語",
				},
				zh: {
					ko: "韩语",
					en: "英语",
					ja: "日语",
					zh: "中文",
					es: "西班牙语",
					fr: "法语",
					de: "德语",
					ru: "俄语",
					pt: "葡萄牙语",
					it: "意大利语",
					nl: "荷兰语",
					ar: "阿拉伯语",
					hi: "印地语",
					vi: "越南语",
					th: "泰语",
				},
			};

			// 현재 언어에 맞게 언어 이름 업데이트
			const languageOptions = outputLanguage.querySelectorAll('option:not([value="auto"])');
			languageOptions.forEach((option) => {
				const langCode = option.value;
				if (languageNames[currentLanguage] && languageNames[currentLanguage][langCode]) {
					option.textContent = languageNames[currentLanguage][langCode];
				}
			});
		}

		// 키워드 섹션
		const keywordsHeader = document.querySelector(".keywords-header h4");
		const copyKeywordsBtn = document.getElementById("copyKeywordsBtn");
		const keywordsList = document.getElementById("keywordsList");

		if (keywordsHeader) keywordsHeader.innerHTML = `<i class="fas fa-tags"></i> ${t.relatedKeywords}`;
		if (copyKeywordsBtn) copyKeywordsBtn.setAttribute("title", t.copyKeywords);

		// 키워드 예시 텍스트 업데이트
		if (keywordsList && keywordsList.classList.contains("empty-keywords")) {
			const placeholderKeywords = keywordsList.querySelectorAll(".placeholder-keyword");
			if (placeholderKeywords.length >= 3) {
				placeholderKeywords[0].textContent = t.keyword;
				placeholderKeywords[1].textContent = t.extraction;
				placeholderKeywords[2].textContent = t.example;
			}
		}

		// 로딩 메시지
		const loadingIndicator = document.getElementById("loadingIndicator");
		if (loadingIndicator && loadingIndicator.querySelector("p")) {
			loadingIndicator.querySelector("p").textContent = t.processing;
		}

		// 푸터
		const footerText = document.querySelector("footer p");
		if (footerText) footerText.textContent = t.copyright;

		// 페이지 제목 업데이트
		document.title = t.appTitle;
	}

	// 초기 UI 언어 업데이트
	updateUILanguage();
});
