const { contextBridge, ipcRenderer } = require("electron");

// API를 렌더러 프로세스에 노출
contextBridge.exposeInMainWorld("api", {
	// 설정 관련
	getConfig: () => ipcRenderer.invoke("get-config"),
	setApiUrl: (url) => ipcRenderer.invoke("set-api-url", url),

	// 요약 관련
	summarizeText: (params) => ipcRenderer.invoke("summarize-text", params),
	summarizeFile: (params) => ipcRenderer.invoke("summarize-file", params),

	// 키워드 추출
	extractKeywords: (params) => ipcRenderer.invoke("extract-keywords", params),

	// 언어 감지
	detectLanguage: (params) => ipcRenderer.invoke("detect-language", params),

	// 파일 관련
	selectFile: () => ipcRenderer.invoke("select-file"),
	saveFile: (params) => ipcRenderer.invoke("save-file", params),
});
