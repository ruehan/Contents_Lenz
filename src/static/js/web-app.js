// DOM 요소
const apiStatus = document.getElementById("apiStatus");

const textTabBtn = document.getElementById("textTabBtn");
const fileTabBtn = document.getElementById("fileTabBtn");
const urlTabBtn = document.getElementById("urlTabBtn");
const textInputTab = document.getElementById("textInputTab");
const fileInputTab = document.getElementById("fileInputTab");
const urlInputTab = document.getElementById("urlInputTab");

const inputText = document.getElementById("inputText");
const fileInput = document.getElementById("fileInput");
const selectFileBtn = document.getElementById("selectFileBtn");
const selectedFile = document.getElementById("selectedFile");
const inputUrl = document.getElementById("inputUrl");
const fetchUrlBtn = document.getElementById("fetchUrlBtn");
const urlPreview = document.getElementById("urlPreview");
const urlTitle = document.getElementById("urlTitle");
const urlContent = document.getElementById("urlContent");
const editContentBtn = document.getElementById("editContentBtn");
const saveContentBtn = document.getElementById("saveContentBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const urlContentEdit = document.getElementById("urlContentEdit");
const urlContentEditArea = document.getElementById("urlContentEditArea");
const useAiFilter = document.getElementById("useAiFilter");

// 요약 설정 요소
const summaryLength = document.getElementById("summaryLength");
const outputLanguage = document.getElementById("outputLanguage");

// 기본 요약 옵션 (UI에서 제거됨)
const DEFAULT_SUMMARY_FORMAT = "paragraph";

const summarizeBtn = document.getElementById("summarizeBtn");
const loadingIndicator = document.getElementById("loadingIndicator");

const resultContainer = document.getElementById("resultContainer");
const detectedLanguage = document.getElementById("detectedLanguage");
const resultContent = document.getElementById("resultContent");
const copyResultBtn = document.getElementById("copyResultBtn");
const saveResultBtn = document.getElementById("saveResultBtn");

const keywordsSection = document.getElementById("keywordsSection");
const keywordsList = document.getElementById("keywordsList");

// 상태 변수
let currentResult = "";
let currentUrl = "";
let scrapedContent = "";
let selectedFileObj = null;

// 초기화
document.addEventListener("DOMContentLoaded", async () => {
	console.log("DOM이 로드되었습니다.");

	// API 상태 확인
	checkApiStatus();

	// 탭 이벤트 리스너
	textTabBtn.addEventListener("click", () => switchTab("text"));
	fileTabBtn.addEventListener("click", () => switchTab("file"));
	urlTabBtn.addEventListener("click", () => switchTab("url"));

	// 파일 선택 버튼 이벤트
	selectFileBtn.addEventListener("click", () => {
		fileInput.click();
	});

	// 파일 선택 이벤트
	fileInput.addEventListener("change", (event) => {
		selectedFileObj = event.target.files[0];
		if (selectedFileObj) {
			selectedFile.textContent = selectedFileObj.name;
		} else {
			selectedFile.textContent = "선택된 파일 없음";
		}
	});

	// URL 가져오기 버튼 이벤트
	fetchUrlBtn.addEventListener("click", async function () {
		await fetchUrlContent();
	});

	// 요약 버튼 이벤트
	summarizeBtn.addEventListener("click", summarize);

	// 복사 버튼 이벤트
	copyResultBtn.addEventListener("click", () => {
		if (currentResult) {
			navigator.clipboard
				.writeText(currentResult)
				.then(() => {
					alert("요약 내용이 클립보드에 복사되었습니다.");
				})
				.catch((err) => {
					console.error("클립보드 복사 실패:", err);
					alert("클립보드 복사에 실패했습니다.");
				});
		}
	});

	// 저장 버튼 이벤트
	saveResultBtn.addEventListener("click", async () => {
		if (currentResult) {
			try {
				const response = await fetch("/download", {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					body: new URLSearchParams({
						summary: currentResult,
						format: ".txt",
					}),
				});

				if (response.ok) {
					const blob = await response.blob();
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.style.display = "none";
					a.href = url;
					a.download = "summary.txt";
					document.body.appendChild(a);
					a.click();
					window.URL.revokeObjectURL(url);
				} else {
					throw new Error("다운로드 실패");
				}
			} catch (error) {
				console.error("다운로드 오류:", error);
				alert("요약 내용 다운로드에 실패했습니다.");
			}
		}
	});

	// 콘텐츠 편집 버튼 이벤트
	editContentBtn.addEventListener("click", function () {
		// 편집 모드 활성화
		urlContentEditArea.value = scrapedContent;
		urlContent.classList.add("hidden");
		urlContentEdit.classList.remove("hidden");
		editContentBtn.classList.add("hidden");
		saveContentBtn.classList.remove("hidden");
		cancelEditBtn.classList.remove("hidden");
	});

	// 편집 저장 버튼 이벤트
	saveContentBtn.addEventListener("click", function () {
		// 편집된 콘텐츠 저장
		scrapedContent = urlContentEditArea.value;
		urlContent.textContent = scrapedContent;

		// 편집 모드 비활성화
		urlContent.classList.remove("hidden");
		urlContentEdit.classList.add("hidden");
		editContentBtn.classList.remove("hidden");
		saveContentBtn.classList.add("hidden");
		cancelEditBtn.classList.add("hidden");
	});

	// 편집 취소 버튼 이벤트
	cancelEditBtn.addEventListener("click", function () {
		// 편집 모드 비활성화
		urlContent.classList.remove("hidden");
		urlContentEdit.classList.add("hidden");
		editContentBtn.classList.remove("hidden");
		saveContentBtn.classList.add("hidden");
		cancelEditBtn.classList.add("hidden");
	});
});

// API 상태 확인
async function checkApiStatus() {
	try {
		const response = await fetch("/status");
		if (response.ok) {
			apiStatus.textContent = "API 상태: 연결됨";
			apiStatus.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
		} else {
			throw new Error("API 응답 오류");
		}
	} catch (error) {
		console.error("API 상태 확인 오류:", error);
		apiStatus.textContent = "API 상태: 연결 실패";
		apiStatus.style.backgroundColor = "rgba(231, 76, 60, 0.2)";
	}
}

// 탭 전환
function switchTab(tabName) {
	// 모든 탭 버튼 비활성화
	textTabBtn.classList.remove("active");
	fileTabBtn.classList.remove("active");
	urlTabBtn.classList.remove("active");

	// 모든 탭 콘텐츠 숨기기
	textInputTab.classList.add("hidden");
	fileInputTab.classList.add("hidden");
	urlInputTab.classList.add("hidden");

	// 선택한 탭 활성화
	if (tabName === "text") {
		textTabBtn.classList.add("active");
		textInputTab.classList.remove("hidden");
	} else if (tabName === "file") {
		fileTabBtn.classList.add("active");
		fileInputTab.classList.remove("hidden");
	} else if (tabName === "url") {
		urlTabBtn.classList.add("active");
		urlInputTab.classList.remove("hidden");
	}
}

// URL 콘텐츠 가져오기
async function fetchUrlContent() {
	const url = inputUrl.value.trim();
	if (!url) {
		alert("URL을 입력해주세요.");
		return;
	}

	try {
		showLoading(true, "URL 콘텐츠 가져오는 중...");

		const response = await fetch("/api/scrape-url", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				url: url,
				use_ai_filter: useAiFilter.checked,
			}),
		});

		if (!response.ok) {
			throw new Error("URL 스크래핑 실패");
		}

		const data = await response.json();

		// URL 미리보기 표시
		urlTitle.textContent = data.title;
		urlContent.textContent = data.content;
		urlPreview.classList.remove("hidden");

		// 상태 변수 업데이트
		currentUrl = url;
		scrapedContent = data.content;

		// 편집 모드 초기화
		urlContentEdit.classList.add("hidden");
		urlContent.classList.remove("hidden");
		editContentBtn.classList.remove("hidden");
		saveContentBtn.classList.add("hidden");
		cancelEditBtn.classList.add("hidden");
	} catch (error) {
		console.error("URL 가져오기 오류:", error);
		alert("URL에서 콘텐츠를 가져오는데 실패했습니다.");
	} finally {
		showLoading(false);
	}
}

// 요약 실행
async function summarize() {
	// 현재 활성화된 탭 확인
	const activeTab = document.querySelector(".tab-button.active");

	try {
		if (activeTab === textTabBtn) {
			await summarizeText();
		} else if (activeTab === fileTabBtn) {
			await summarizeFile();
		} else if (activeTab === urlTabBtn) {
			await summarizeUrl();
		}
	} catch (error) {
		console.error("요약 오류:", error);
		alert("요약 처리 중 오류가 발생했습니다.");
		showLoading(false);
	}
}

// 텍스트 요약
async function summarizeText() {
	const text = inputText.value.trim();
	if (!text) {
		alert("요약할 텍스트를 입력해주세요.");
		return;
	}

	try {
		showLoading(true, "텍스트 요약 중...");

		const response = await fetch("/summarize/text", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				text: text,
				length: summaryLength.value,
				format: DEFAULT_SUMMARY_FORMAT,
				language: outputLanguage.value,
			}),
		});

		if (!response.ok) {
			throw new Error("텍스트 요약 실패");
		}

		const data = await response.json();

		// 결과 표시
		displayResult(data.summary, data.detected_language, data.detected_language_name);

		// 키워드 추출
		await extractKeywordsForSummary(text);
	} catch (error) {
		console.error("텍스트 요약 오류:", error);
		alert("텍스트 요약에 실패했습니다.");
	} finally {
		showLoading(false);
	}
}

// URL 요약
async function summarizeUrl() {
	if (!currentUrl) {
		alert("URL을 입력하고 콘텐츠를 가져와주세요.");
		return;
	}

	try {
		showLoading(true, "URL 콘텐츠 요약 중...");

		const response = await fetch("/summarize/url", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				url: currentUrl,
				length: summaryLength.value,
				format: DEFAULT_SUMMARY_FORMAT,
				language: outputLanguage.value,
			}),
		});

		if (!response.ok) {
			throw new Error("URL 요약 실패");
		}

		const data = await response.json();

		// 결과 표시
		displayResult(data.summary, data.detected_language, data.detected_language_name);

		// 키워드 추출
		await extractKeywordsForSummary(scrapedContent);
	} catch (error) {
		console.error("URL 요약 오류:", error);
		alert("URL 콘텐츠 요약에 실패했습니다.");
	} finally {
		showLoading(false);
	}
}

// 파일 요약
async function summarizeFile() {
	if (!selectedFileObj) {
		alert("요약할 파일을 선택해주세요.");
		return;
	}

	try {
		showLoading(true, "파일 요약 중...");

		const formData = new FormData();
		formData.append("file", selectedFileObj);
		formData.append("length", summaryLength.value);
		formData.append("format", DEFAULT_SUMMARY_FORMAT);
		formData.append("language", outputLanguage.value);

		const response = await fetch("/summarize/file", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error("파일 요약 실패");
		}

		const data = await response.json();

		// 결과 표시
		displayResult(data.summary, data.detected_language, data.detected_language_name);

		// 파일 내용으로 키워드 추출은 서버에서 처리
		const fileReader = new FileReader();
		fileReader.onload = async (e) => {
			const fileContent = e.target.result;
			await extractKeywordsForSummary(fileContent);
		};

		// 텍스트 파일인 경우에만 키워드 추출
		if (selectedFileObj.type === "text/plain") {
			fileReader.readAsText(selectedFileObj);
		}
	} catch (error) {
		console.error("파일 요약 오류:", error);
		alert("파일 요약에 실패했습니다.");
	} finally {
		showLoading(false);
	}
}

// 요약 결과에 대한 키워드 추출
async function extractKeywordsForSummary(text) {
	try {
		const response = await fetch("/keywords/text", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				text: text,
				count: 10,
				language: "auto",
			}),
		});

		if (!response.ok) {
			throw new Error("키워드 추출 실패");
		}

		const data = await response.json();

		// 키워드 표시
		displayKeywords(data.keywords);
	} catch (error) {
		console.error("키워드 추출 오류:", error);
		// 키워드 추출 실패는 사용자에게 알리지 않음
	}
}

// 결과 표시
function displayResult(summary, lang, langName) {
	currentResult = summary;

	// 언어 정보 표시
	if (lang && langName) {
		detectedLanguage.textContent = `감지된 언어: ${langName} (${lang})`;
		detectedLanguage.classList.remove("hidden");
	} else {
		detectedLanguage.textContent = "감지된 언어: -";
	}

	// 요약 결과 표시
	resultContent.innerHTML = `<p>${summary.replace(/\n/g, "<br>")}</p>`;
	resultContent.classList.remove("empty-content");
}

// 키워드 표시
function displayKeywords(keywords) {
	keywordsList.innerHTML = "";
	keywordsList.classList.remove("empty-keywords");

	if (keywords && keywords.length > 0) {
		keywords.forEach((keyword) => {
			const span = document.createElement("span");
			span.className = "keyword";
			span.textContent = keyword;
			keywordsList.appendChild(span);
		});
	} else {
		keywordsList.innerHTML = `<span class="keyword placeholder-keyword">키워드 없음</span>`;
		keywordsList.classList.add("empty-keywords");
	}
}

// 로딩 표시
function showLoading(show, message = "처리 중...") {
	if (show) {
		loadingIndicator.querySelector("p").textContent = message;
		loadingIndicator.classList.remove("hidden");
	} else {
		loadingIndicator.classList.add("hidden");
	}
}

// 결과 초기화
function resetResults() {
	currentResult = "";
	resultContent.innerHTML = `<p class="placeholder-text">왼쪽에서 텍스트를 입력하거나 파일을 업로드하거나 URL을 입력한 후 요약하기 버튼을 클릭하세요.</p>`;
	resultContent.classList.add("empty-content");

	detectedLanguage.textContent = "감지된 언어: -";

	keywordsList.innerHTML = `
        <span class="keyword placeholder-keyword">키워드</span>
        <span class="keyword placeholder-keyword">추출</span>
        <span class="keyword placeholder-keyword">예시</span>
    `;
	keywordsList.classList.add("empty-keywords");
}
