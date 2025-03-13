const path = require("path");
const fs = require("fs");
const { app } = require("electron");

// 사용자 데이터 디렉토리 설정
const userDataPath = app ? app.getPath("userData") : path.join(__dirname, "../../userData");
const settingsPath = path.join(userDataPath, "settings.json");

// 지원하는 언어 정의
const supportedLanguages = ["ko", "en"];
const defaultLanguage = "ko";

// 현재 언어 설정
let currentLanguage = defaultLanguage;

// 언어 파일 캐시
const translations = {};

// 언어 파일 로드
function loadTranslations(lang) {
	if (translations[lang]) return translations[lang];

	try {
		const filePath = path.join(__dirname, `${lang}.json`);
		const fileContent = fs.readFileSync(filePath, "utf8");
		translations[lang] = JSON.parse(fileContent);
		return translations[lang];
	} catch (error) {
		console.error(`언어 파일 로드 오류 (${lang}):`, error);
		// 기본 언어로 폴백
		if (lang !== defaultLanguage) {
			return loadTranslations(defaultLanguage);
		}
		return {};
	}
}

// 설정 파일에서 언어 설정 로드
function loadLanguageSetting() {
	try {
		if (fs.existsSync(settingsPath)) {
			const settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
			if (settings.language && supportedLanguages.includes(settings.language)) {
				return settings.language;
			}
		}
	} catch (error) {
		console.error("언어 설정 로드 오류:", error);
	}
	return defaultLanguage;
}

// 언어 설정 저장
function saveLanguageSetting(lang) {
	try {
		// 디렉토리가 없으면 생성
		if (!fs.existsSync(userDataPath)) {
			fs.mkdirSync(userDataPath, { recursive: true });
		}

		// 기존 설정 로드 또는 새 객체 생성
		let settings = {};
		if (fs.existsSync(settingsPath)) {
			settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
		}

		// 언어 설정 업데이트
		settings.language = lang;

		// 설정 저장
		fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
		return true;
	} catch (error) {
		console.error("언어 설정 저장 오류:", error);
		return false;
	}
}

// 브라우저 언어 감지
function detectBrowserLanguage() {
	const navLang = navigator.language || navigator.userLanguage;
	const langCode = navLang.split("-")[0];

	if (supportedLanguages.includes(langCode)) {
		return langCode;
	}
	return defaultLanguage;
}

// 중첩된 키에서 값 가져오기
function getNestedValue(obj, key) {
	if (!key) return undefined;

	const keys = key.split(".");
	let value = obj;

	for (const k of keys) {
		if (value === undefined || value === null) return undefined;
		value = value[k];
	}

	return value;
}

// 현지화 유틸리티
const i18n = {
	// 번역 텍스트 가져오기
	t: function (key, options = {}) {
		const translations = loadTranslations(currentLanguage);
		let value = getNestedValue(translations, key);

		if (value === undefined) {
			// 기본 언어로 폴백
			if (currentLanguage !== defaultLanguage) {
				const defaultTranslations = loadTranslations(defaultLanguage);
				value = getNestedValue(defaultTranslations, key);
			}

			// 그래도 없으면 키 반환
			if (value === undefined) {
				console.warn(`번역 키를 찾을 수 없음: ${key}`);
				return key;
			}
		}

		// 옵션으로 변수 대체
		if (options && typeof value === "string") {
			Object.keys(options).forEach((optionKey) => {
				value = value.replace(new RegExp(`{{${optionKey}}}`, "g"), options[optionKey]);
			});
		}

		return value;
	},

	// 현재 언어 가져오기
	getCurrentLanguage: function () {
		return currentLanguage;
	},

	// 언어 설정
	setLanguage: function (lang) {
		if (!supportedLanguages.includes(lang)) {
			console.error(`지원하지 않는 언어: ${lang}`);
			return false;
		}

		currentLanguage = lang;
		saveLanguageSetting(lang);
		return true;
	},

	// 저장된 언어 설정 로드
	loadSavedLanguage: function () {
		currentLanguage = loadLanguageSetting();
		return currentLanguage;
	},

	// 지원하는 언어 목록 가져오기
	getSupportedLanguages: function () {
		return supportedLanguages;
	},

	// 브라우저 언어 감지
	detectBrowserLanguage: detectBrowserLanguage,
};

module.exports = i18n;
