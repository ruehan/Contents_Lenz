// DOM 요소
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const apiUrlInput = document.getElementById("apiUrl");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const cancelSettingsBtn = document.getElementById("cancelSettingsBtn");
const apiStatus = document.getElementById("apiStatus");

const textTabBtn = document.getElementById("textTabBtn");
const fileTabBtn = document.getElementById("fileTabBtn");
const textInputTab = document.getElementById("textInputTab");
const fileInputTab = document.getElementById("fileInputTab");

const inputText = document.getElementById("inputText");
const selectFileBtn = document.getElementById("selectFileBtn");
const selectedFile = document.getElementById("selectedFile");

const summaryLength = document.getElementById("summaryLength");
const summaryFormat = document.getElementById("summaryFormat");
const outputLanguage = document.getElementById("outputLanguage");

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

// 초기화
document.addEventListener("DOMContentLoaded", async () => {
	// API URL 설정 로드
	const storedApiUrl = await window.api.getConfig();
	if (!storedApiUrl.error) {
		apiStatus.textContent = "API 상태: 연결됨";
		apiStatus.style.color = "#27ae60";
	} else {
		apiStatus.textContent = "API 상태: 연결 안됨";
		apiStatus.style.color = "#e74c3c";
	}

	// 설정 패널 이벤트
	settingsBtn.addEventListener("click", () => {
		settingsPanel.classList.toggle("hidden");
	});

	saveSettingsBtn.addEventListener("click", async () => {
		const apiUrl = apiUrlInput.value.trim();
		if (apiUrl) {
			await window.api.setApiUrl(apiUrl);
			settingsPanel.classList.add("hidden");

			// API 상태 확인
			const config = await window.api.getConfig();
			if (!config.error) {
				apiStatus.textContent = "API 상태: 연결됨";
				apiStatus.style.color = "#27ae60";
			} else {
				apiStatus.textContent = "API 상태: 연결 안됨";
				apiStatus.style.color = "#e74c3c";
			}
		}
	});

	cancelSettingsBtn.addEventListener("click", () => {
		settingsPanel.classList.add("hidden");
	});

	// 탭 전환 이벤트
	textTabBtn.addEventListener("click", () => {
		textTabBtn.classList.add("active");
		fileTabBtn.classList.remove("active");
		textInputTab.classList.remove("hidden");
		fileInputTab.classList.add("hidden");
	});

	fileTabBtn.addEventListener("click", () => {
		fileTabBtn.classList.add("active");
		textTabBtn.classList.remove("active");
		fileInputTab.classList.remove("hidden");
		textInputTab.classList.add("hidden");
	});

	// 파일 선택 이벤트
	selectFileBtn.addEventListener("click", async () => {
		const result = await window.api.selectFile();
		if (!result.canceled && result.filePath) {
			selectedFilePath = result.filePath;
			selectedFile.textContent = selectedFilePath.split(/[\\/]/).pop(); // 파일명만 표시
		}
	});

	// 요약 버튼 이벤트
	summarizeBtn.addEventListener("click", async () => {
		// 입력 검증
		if (textTabBtn.classList.contains("active")) {
			// 텍스트 입력 모드
			if (!inputText.value.trim()) {
				alert("요약할 텍스트를 입력하세요.");
				return;
			}

			await summarizeText();
		} else {
			// 파일 입력 모드
			if (!selectedFilePath) {
				alert("요약할 파일을 선택하세요.");
				return;
			}

			await summarizeFile();
		}
	});

	// 키워드 추출 버튼 이벤트
	extractKeywordsBtn.addEventListener("click", async () => {
		// 입력 검증
		if (textTabBtn.classList.contains("active")) {
			// 텍스트 입력 모드
			if (!inputText.value.trim()) {
				alert("키워드를 추출할 텍스트를 입력하세요.");
				return;
			}

			await extractKeywords();
		} else {
			// 파일 입력 모드
			if (!selectedFilePath) {
				alert("키워드를 추출할 파일을 선택하세요.");
				return;
			}

			alert("파일에서 키워드 추출은 아직 지원하지 않습니다.");
		}
	});

	// 결과 복사 버튼 이벤트
	copyResultBtn.addEventListener("click", () => {
		navigator.clipboard
			.writeText(currentResult)
			.then(() => {
				alert("결과가 클립보드에 복사되었습니다.");
			})
			.catch((err) => {
				console.error("클립보드 복사 오류:", err);
				alert("클립보드 복사 중 오류가 발생했습니다.");
			});
	});

	// 결과 저장 버튼 이벤트
	saveResultBtn.addEventListener("click", async () => {
		if (!currentResult) {
			alert("저장할 결과가 없습니다.");
			return;
		}

		const result = await window.api.saveFile({
			summary: currentResult,
			defaultPath: "summary.txt",
		});

		if (result.success) {
			alert(`결과가 ${result.filePath}에 저장되었습니다.`);
		} else if (!result.canceled && result.error) {
			alert(`저장 중 오류가 발생했습니다: ${result.error}`);
		}
	});
});

// 텍스트 요약 함수
async function summarizeText() {
	try {
		// 로딩 표시
		showLoading(true);

		// 결과 컨테이너 초기화
		hideResults();

		// API 호출
		const response = await window.api.summarizeText({
			text: inputText.value.trim(),
			length: summaryLength.value,
			format: summaryFormat.value,
			language: outputLanguage.value,
		});

		// 오류 처리
		if (response.error) {
			alert(`요약 중 오류가 발생했습니다: ${response.error}`);
			return;
		}

		// 결과 표시
		currentResult = response.summary;
		resultContent.textContent = response.summary;

		// 감지된 언어 표시
		if (response.detected_language) {
			detectedLanguage.textContent = `감지된 언어: ${response.detected_language_name || response.detected_language}`;
			detectedLanguage.classList.remove("hidden");
		} else {
			detectedLanguage.classList.add("hidden");
		}

		resultContainer.classList.remove("hidden");
	} catch (error) {
		console.error("요약 오류:", error);
		alert(`요약 중 오류가 발생했습니다: ${error.message}`);
	} finally {
		showLoading(false);
	}
}

// 파일 요약 함수
async function summarizeFile() {
	try {
		// 로딩 표시
		showLoading(true);

		// 결과 컨테이너 초기화
		hideResults();

		// API 호출
		const response = await window.api.summarizeFile({
			filePath: selectedFilePath,
			length: summaryLength.value,
			format: summaryFormat.value,
			language: outputLanguage.value,
		});

		// 오류 처리
		if (response.error) {
			alert(`요약 중 오류가 발생했습니다: ${response.error}`);
			return;
		}

		// 결과 표시
		currentResult = response.summary;
		resultContent.textContent = response.summary;

		// 감지된 언어 표시
		if (response.detected_language) {
			detectedLanguage.textContent = `감지된 언어: ${response.detected_language_name || response.detected_language}`;
			detectedLanguage.classList.remove("hidden");
		} else {
			detectedLanguage.classList.add("hidden");
		}

		resultContainer.classList.remove("hidden");
	} catch (error) {
		console.error("파일 요약 오류:", error);
		alert(`파일 요약 중 오류가 발생했습니다: ${error.message}`);
	} finally {
		showLoading(false);
	}
}

// 키워드 추출 함수
async function extractKeywords() {
	try {
		// 로딩 표시
		showLoading(true);

		// 결과 컨테이너 초기화
		hideResults();

		// API 호출
		const response = await window.api.extractKeywords({
			text: inputText.value.trim(),
			count: 10,
			language: outputLanguage.value,
		});

		// 오류 처리
		if (response.error) {
			alert(`키워드 추출 중 오류가 발생했습니다: ${response.error}`);
			return;
		}

		// 결과 표시
		keywordsList.innerHTML = "";
		response.keywords.forEach((keyword) => {
			const span = document.createElement("span");
			span.textContent = keyword;
			keywordsList.appendChild(span);
		});

		keywordsContainer.classList.remove("hidden");
	} catch (error) {
		console.error("키워드 추출 오류:", error);
		alert(`키워드 추출 중 오류가 발생했습니다: ${error.message}`);
	} finally {
		showLoading(false);
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
