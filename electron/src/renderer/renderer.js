// DOM 요소
const apiStatus = document.getElementById("apiStatus");

const textTabBtn = document.getElementById("textTabBtn");
const fileTabBtn = document.getElementById("fileTabBtn");
const urlTabBtn = document.getElementById("urlTabBtn");
const textInputTab = document.getElementById("textInputTab");
const fileInputTab = document.getElementById("fileInputTab");
const urlInputTab = document.getElementById("urlInputTab");

const inputText = document.getElementById("inputText");
const selectFileBtn = document.getElementById("selectFileBtn");
const selectedFile = document.getElementById("selectedFile");
const inputUrl = document.getElementById("inputUrl");
const fetchUrlBtn = document.getElementById("fetchUrlBtn");
const urlPreview = document.getElementById("urlPreview");
const urlTitle = document.getElementById("urlTitle");
const urlContent = document.getElementById("urlContent");

// 요약 설정 요소
const summaryLength = document.getElementById("summaryLength");

// 기본 요약 옵션 (UI에서 제거됨)
const DEFAULT_SUMMARY_FORMAT = "paragraph";
const DEFAULT_OUTPUT_LANGUAGE = "auto";

const summarizeBtn = document.getElementById("summarizeBtn");
const extractKeywordsBtn = document.getElementById("extractKeywordsBtn");
const loadingIndicator = document.getElementById("loadingIndicator");

const resultContainer = document.getElementById("resultContainer");
const detectedLanguage = document.getElementById("detectedLanguage");
const resultContent = document.getElementById("resultContent");
const copyResultBtn = document.getElementById("copyResultBtn");
const saveResultBtn = document.getElementById("saveResultBtn");

const keywordsContainer = document.getElementById("keywordsContainer");
const keywordsList = document.getElementById("keywordsList");

// 상태 변수
let selectedFilePath = null;
let currentResult = "";
let currentUrl = "";
let scrapedContent = "";

// 초기화
document.addEventListener("DOMContentLoaded", async () => {
	console.log("DOM이 로드되었습니다.");

	// API URL 설정 로드
	try {
		console.log("API 설정을 로드합니다...");
		const storedApiUrl = await window.api.getConfig();
		console.log("API 설정 응답:", storedApiUrl);

		if (!storedApiUrl.error) {
			apiStatus.textContent = "API 상태: 연결됨";
			apiStatus.style.color = "#27ae60";
		} else {
			apiStatus.textContent = "API 상태: 연결 안됨";
			apiStatus.style.color = "#e74c3c";
			console.error("API 연결 오류:", storedApiUrl.error);
		}
	} catch (error) {
		console.error("API 설정 로드 중 오류 발생:", error);
		apiStatus.textContent = "API 상태: 연결 안됨";
		apiStatus.style.color = "#e74c3c";
	}

	// 이벤트 리스너 설정
	console.log("이벤트 리스너를 설정합니다...");

	textTabBtn.addEventListener("click", () => {
		console.log("텍스트 탭 클릭됨");
		textTabBtn.classList.add("active");
		fileTabBtn.classList.remove("active");
		urlTabBtn.classList.remove("active");
		textInputTab.classList.remove("hidden");
		fileInputTab.classList.add("hidden");
		urlInputTab.classList.add("hidden");
	});

	fileTabBtn.addEventListener("click", () => {
		console.log("파일 탭 클릭됨");
		fileTabBtn.classList.add("active");
		textTabBtn.classList.remove("active");
		urlTabBtn.classList.remove("active");
		fileInputTab.classList.remove("hidden");
		textInputTab.classList.add("hidden");
		urlInputTab.classList.add("hidden");
	});

	urlTabBtn.addEventListener("click", () => {
		console.log("URL 탭 클릭됨");
		urlTabBtn.classList.add("active");
		textTabBtn.classList.remove("active");
		fileTabBtn.classList.remove("active");
		urlInputTab.classList.remove("hidden");
		textInputTab.classList.add("hidden");
		fileInputTab.classList.add("hidden");
	});

	selectFileBtn.addEventListener("click", async () => {
		const result = await window.api.selectFile();
		if (!result.canceled && result.filePaths.length > 0) {
			selectedFilePath = result.filePaths[0];
			selectedFile.textContent = selectedFilePath.split(/[\\/]/).pop(); // 파일명만 표시
			selectedFile.style.color = "#2c3e50";
		}
	});

	fetchUrlBtn.addEventListener("click", async () => {
		await fetchUrlContent();
	});

	summarizeBtn.addEventListener("click", async () => {
		if (textInputTab.classList.contains("hidden") && fileInputTab.classList.contains("hidden")) {
			// URL 입력 탭이 활성화된 경우
			await summarizeUrl();
		} else if (textInputTab.classList.contains("hidden")) {
			// 파일 업로드 탭이 활성화된 경우
			await summarizeFile();
		} else {
			// 텍스트 입력 탭이 활성화된 경우
			await summarizeText();
		}
	});

	extractKeywordsBtn.addEventListener("click", async () => {
		if (textInputTab.classList.contains("hidden") && fileInputTab.classList.contains("hidden")) {
			// URL 입력 탭이 활성화된 경우
			if (scrapedContent) {
				await extractKeywordsFromText(scrapedContent);
			} else {
				alert("먼저 URL 콘텐츠를 가져오세요.");
			}
		} else if (textInputTab.classList.contains("hidden")) {
			// 파일 업로드 탭이 활성화된 경우
			alert("파일에서 키워드 추출은 아직 지원하지 않습니다.");
		} else {
			// 텍스트 입력 탭이 활성화된 경우
			await extractKeywords();
		}
	});

	copyResultBtn.addEventListener("click", () => {
		if (currentResult) {
			navigator.clipboard.writeText(currentResult).then(
				() => {
					// 복사 성공
					const originalText = copyResultBtn.textContent;
					copyResultBtn.textContent = "✓ 복사됨";
					setTimeout(() => {
						copyResultBtn.textContent = originalText;
					}, 2000);
				},
				(err) => {
					console.error("클립보드 복사 실패:", err);
				}
			);
		}
	});

	saveResultBtn.addEventListener("click", async () => {
		if (currentResult) {
			await window.api.saveResult(currentResult);
		}
	});
});

// URL 콘텐츠 가져오기 함수
async function fetchUrlContent() {
	const url = inputUrl.value.trim();
	if (!url) {
		alert("URL을 입력하세요.");
		return;
	}

	showLoading(true);
	urlPreview.classList.add("hidden");

	try {
		const response = await window.api.scrapeUrl({ url });

		showLoading(false);

		if (response.error) {
			alert(`URL 콘텐츠 가져오기 오류: ${response.error}`);
			return;
		}

		currentUrl = response.url;
		scrapedContent = response.content;

		urlTitle.textContent = response.title;
		urlContent.textContent = response.content.length > 500 ? response.content.substring(0, 500) + "..." : response.content;

		urlPreview.classList.remove("hidden");
	} catch (error) {
		showLoading(false);
		alert(`URL 콘텐츠 가져오기 중 오류가 발생했습니다: ${error.message}`);
	}
}

// URL 요약 함수
async function summarizeUrl() {
	const url = inputUrl.value.trim();
	if (!url) {
		alert("요약할 URL을 입력하세요.");
		return;
	}

	hideResults();
	showLoading(true);

	try {
		const response = await window.api.summarizeUrl({
			url: url,
			length: summaryLength.value,
			format: DEFAULT_SUMMARY_FORMAT,
			language: DEFAULT_OUTPUT_LANGUAGE,
		});

		showLoading(false);

		if (response.error) {
			alert(`URL 요약 오류: ${response.error}`);
			return;
		}

		resultContent.textContent = response.summary;
		currentResult = response.summary;

		if (response.detected_language) {
			detectedLanguage.textContent = `감지된 언어: ${response.detected_language_name || response.detected_language}`;
			detectedLanguage.classList.remove("hidden");
		} else {
			detectedLanguage.classList.add("hidden");
		}

		resultContainer.classList.remove("hidden");
		keywordsContainer.classList.add("hidden");
	} catch (error) {
		showLoading(false);
		alert(`URL 요약 중 오류가 발생했습니다: ${error.message}`);
	}
}

// 텍스트 요약 함수
async function summarizeText() {
	const text = inputText.value.trim();
	if (!text) {
		alert("요약할 텍스트를 입력하세요.");
		return;
	}

	hideResults();
	showLoading(true);

	try {
		const response = await window.api.summarizeText({
			text: text,
			length: summaryLength.value,
			format: DEFAULT_SUMMARY_FORMAT,
			language: DEFAULT_OUTPUT_LANGUAGE,
		});

		showLoading(false);

		if (response.error) {
			alert(`요약 오류: ${response.error}`);
			return;
		}

		resultContent.textContent = response.summary;
		currentResult = response.summary;

		if (response.detected_language) {
			detectedLanguage.textContent = `감지된 언어: ${response.detected_language_name || response.detected_language}`;
			detectedLanguage.classList.remove("hidden");
		} else {
			detectedLanguage.classList.add("hidden");
		}

		resultContainer.classList.remove("hidden");
		keywordsContainer.classList.add("hidden");
	} catch (error) {
		showLoading(false);
		alert(`요약 중 오류가 발생했습니다: ${error.message}`);
	}
}

// 파일 요약 함수
async function summarizeFile() {
	if (!selectedFilePath) {
		alert("요약할 파일을 선택하세요.");
		return;
	}

	hideResults();
	showLoading(true);

	try {
		const response = await window.api.summarizeFile({
			filePath: selectedFilePath,
			length: summaryLength.value,
			format: DEFAULT_SUMMARY_FORMAT,
			language: DEFAULT_OUTPUT_LANGUAGE,
		});

		showLoading(false);

		if (response.error) {
			alert(`요약 오류: ${response.error}`);
			return;
		}

		resultContent.textContent = response.summary;
		currentResult = response.summary;

		if (response.detected_language) {
			detectedLanguage.textContent = `감지된 언어: ${response.detected_language_name || response.detected_language}`;
			detectedLanguage.classList.remove("hidden");
		} else {
			detectedLanguage.classList.add("hidden");
		}

		resultContainer.classList.remove("hidden");
		keywordsContainer.classList.add("hidden");
	} catch (error) {
		showLoading(false);
		alert(`파일 요약 중 오류가 발생했습니다: ${error.message}`);
	}
}

// 키워드 추출 함수
async function extractKeywords() {
	const text = inputText.value.trim();
	if (!text) {
		alert("키워드를 추출할 텍스트를 입력하세요.");
		return;
	}

	await extractKeywordsFromText(text);
}

// 텍스트에서 키워드 추출 함수
async function extractKeywordsFromText(text) {
	hideResults();
	showLoading(true);

	try {
		const response = await window.api.extractKeywords({
			text: text,
			count: 10,
			language: DEFAULT_OUTPUT_LANGUAGE,
		});

		showLoading(false);

		if (response.error) {
			alert(`키워드 추출 오류: ${response.error}`);
			return;
		}

		keywordsList.innerHTML = "";
		response.keywords.forEach((keyword) => {
			const keywordElement = document.createElement("span");
			keywordElement.className = "keyword";
			keywordElement.textContent = keyword;
			keywordsList.appendChild(keywordElement);
		});

		keywordsContainer.classList.remove("hidden");
		resultContainer.classList.add("hidden");
	} catch (error) {
		showLoading(false);
		alert(`키워드 추출 중 오류가 발생했습니다: ${error.message}`);
	}
}

// 로딩 표시 함수
function showLoading(show) {
	if (show) {
		loadingIndicator.classList.remove("hidden");
		summarizeBtn.disabled = true;
		extractKeywordsBtn.disabled = true;
	} else {
		loadingIndicator.classList.add("hidden");
		summarizeBtn.disabled = false;
		extractKeywordsBtn.disabled = false;
	}
}

// 결과 숨기기 함수
function hideResults() {
	resultContainer.classList.add("hidden");
	keywordsContainer.classList.add("hidden");
}
