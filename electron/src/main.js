const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const Store = require("electron-store");

// 설정 저장소 초기화
const store = new Store();

// API 서버 URL (고정)
const API_URL = "https://contents-lenz.onrender.com";
// const API_URL = "http://localhost:8000";

// 개발 모드 확인
const isDev = process.argv.includes("--dev");

// 메인 윈도우 객체
let mainWindow;

// 메인 윈도우 생성 함수
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
		},
		icon: path.join(__dirname, "assets", "icon.png"),
	});

	// HTML 파일 로드
	mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

	// 개발 모드에서 개발자 도구 열기
	if (isDev) {
		mainWindow.webContents.openDevTools();
	}

	// 윈도우가 닫힐 때 이벤트
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

// 앱이 준비되면 윈도우 생성
app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// 모든 윈도우가 닫히면 앱 종료 (macOS 제외)
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// API 상태 확인
ipcMain.handle("get-config", async () => {
	try {
		console.log("API 연결 확인 중:", API_URL);
		const response = await axios.get(`${API_URL}/`);
		console.log("API 연결 성공:", response.data);
		return response.data;
	} catch (error) {
		console.error("API 연결 확인 오류:", error.message);
		return { error: error.message || "API 서버에 연결할 수 없습니다." };
	}
});

// 웹 스크래핑 API
ipcMain.handle("scrape-url", async (event, { url, use_ai_filter }) => {
	if (!url) {
		return { error: "URL이 제공되지 않았습니다." };
	}

	try {
		// URL 유효성 검사
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			url = "https://" + url;
		}

		// API 서버 엔드포인트 URL
		const apiUrl = `${API_URL}/scrape-url`;
		console.log("API 요청 URL:", apiUrl);
		console.log("요청 데이터:", { url, use_ai_filter });

		// URL 인코딩된 폼 데이터 사용
		const params = new URLSearchParams();
		params.append("url", url);
		params.append("use_ai_filter", use_ai_filter !== false);

		// API 요청 전송
		const response = await axios.post(apiUrl, params, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		console.log("API 응답:", response.status);
		return response.data;
	} catch (error) {
		console.error("URL 스크래핑 오류:", error);
		if (error.response) {
			console.error("오류 응답:", error.response.status, error.response.data);
			return { error: error.response.data.detail || error.message };
		}
		return { error: error.message };
	}
});

// URL 요약 API
ipcMain.handle("summarize-url", async (event, { url, length, format, language }) => {
	if (!url) {
		return { error: "URL이 제공되지 않았습니다." };
	}

	try {
		// URL 인코딩된 폼 데이터 사용
		const params = new URLSearchParams();
		params.append("url", url);
		params.append("length", length || "medium");
		params.append("format", format || "paragraph");
		params.append("language", language || "auto");

		const response = await axios.post(`${API_URL}/summarize/url`, params, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return response.data;
	} catch (error) {
		console.error("URL 요약 오류:", error);
		return { error: error.response?.data?.detail || error.message };
	}
});

// 텍스트 요약 API
ipcMain.handle("summarize-text", async (event, { text, length, format, language }) => {
	try {
		// URL 인코딩된 폼 데이터 사용
		const params = new URLSearchParams();
		params.append("text", text);
		params.append("length", length);
		params.append("format", format);
		params.append("language", language);

		const response = await axios.post(`${API_URL}/summarize/text`, params, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return response.data;
	} catch (error) {
		console.error("텍스트 요약 오류:", error);
		return { error: error.response?.data?.detail || error.message };
	}
});

// 파일 요약 API
ipcMain.handle("summarize-file", async (event, { filePath, length, format, language }) => {
	try {
		const formData = new FormData();
		formData.append("file", fs.createReadStream(filePath));
		formData.append("length", length);
		formData.append("format", format);
		formData.append("language", language);

		const response = await axios.post(`${API_URL}/summarize/file`, formData, {
			headers: formData.getHeaders(),
		});

		return response.data;
	} catch (error) {
		console.error("파일 요약 오류:", error);
		return { error: error.response?.data?.detail || error.message };
	}
});

// 키워드 추출 API
ipcMain.handle("extract-keywords", async (event, { text, count, language }) => {
	try {
		// URL 인코딩된 폼 데이터 사용
		const params = new URLSearchParams();
		params.append("text", text);
		params.append("count", count);
		params.append("language", language);

		const response = await axios.post(`${API_URL}/keywords/text`, params, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return response.data;
	} catch (error) {
		console.error("키워드 추출 오류:", error);
		return { error: error.response?.data?.detail || error.message };
	}
});

// 언어 감지 API
ipcMain.handle("detect-language", async (event, { text }) => {
	try {
		// URL 인코딩된 폼 데이터 사용
		const params = new URLSearchParams();
		params.append("text", text);

		const response = await axios.post(`${API_URL}/detect-language`, params, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});

		return response.data;
	} catch (error) {
		console.error("언어 감지 오류:", error);
		return { error: error.response?.data?.detail || error.message };
	}
});

// 파일 선택 다이얼로그
ipcMain.handle("select-file", async () => {
	const result = await dialog.showOpenDialog(mainWindow, {
		properties: ["openFile"],
		filters: [
			{ name: "텍스트 파일", extensions: ["txt", "md"] },
			{ name: "문서 파일", extensions: ["pdf", "docx", "doc"] },
			{ name: "모든 파일", extensions: ["*"] },
		],
	});

	return { canceled: result.canceled, filePaths: result.filePaths };
});

// 저장 다이얼로그
ipcMain.handle("save-file", async (event, { summary, defaultPath }) => {
	const result = await dialog.showSaveDialog(mainWindow, {
		defaultPath: defaultPath || "summary.txt",
		filters: [
			{ name: "텍스트 파일", extensions: ["txt"] },
			{ name: "워드 문서", extensions: ["docx"] },
		],
	});

	if (result.canceled) {
		return { canceled: true };
	}

	try {
		const fileExt = path.extname(result.filePath);
		const formData = new FormData();
		formData.append("summary", summary);
		formData.append("format", fileExt);

		const response = await axios.post(`${API_URL}/download`, formData, {
			headers: formData.getHeaders(),
			responseType: "arraybuffer",
		});

		fs.writeFileSync(result.filePath, Buffer.from(response.data));
		return { success: true, filePath: result.filePath };
	} catch (error) {
		console.error("파일 저장 오류:", error);
		return { error: error.message };
	}
});
