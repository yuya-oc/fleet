
export const SET_SCREENSHOT_DIR = 'SET_SCREENSHOT_DIR';

export const setScreenshotDir = directory => {
	return {
		type: SET_SCREENSHOT_DIR,
		directory
	};
};

export const SAVE_CONFIG = 'SAVE_CONFIG';
export const LOAD_CONFIG = 'LOAD_CONFIG';
export const SET_CONFIG = 'SET_CONFIG';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const SET_LOGIN_REQUIRED = 'SET_LOGIN_REQUIRED';

export const saveConfig = key => {
	return {
		type: SAVE_CONFIG,
		key
	};
};

export const loadConfig = () => {
	return {
		type: LOAD_CONFIG
	};
};

export const setConfig = config => {
	return {
		type: SET_CONFIG,
		config
	};
};

export const requestLogin = () => {
	return {
		type: REQUEST_LOGIN
	};
};

export const setLoginRequired = loginRequired => {
	return {
		type: SET_LOGIN_REQUIRED,
		loginRequired
	};
};

export const SET_AUDIO_MUTED = 'SET_MUTED';

export const setAudioMuted = (targetId, muted) => {
	return {
		type: SET_AUDIO_MUTED,
		targetId,
		muted
	};
};

export const SET_WEBVIEW_SCALE = 'SET_WEBVIEW_SCALE';

export const setWebviewScale = scale => {
	return {
		type: SET_WEBVIEW_SCALE,
		scale
	};
};

export const TAKE_SCREENSHOT = 'TAKE_SCREENSHOT';

export const takeScreenshot = bounds => ({
	type: TAKE_SCREENSHOT,
	bounds
});

export const SET_KCSAPI_MASTER_DATA = 'SET_KCSAPI_MASTER_DATA';
export const SET_KCSAPI_USER_DATA = 'SET_KCSAPI_USER_DATA';
export const SET_KCSAPI_DECK_SHIP = 'SET_KCSAPI_DECK_SHIP';
export const SET_KCSAPI_DECK = 'SET_KCSAPI_DECK';
export const SET_KCSAPI_PRESET_DECK = 'SET_KCSAPI_PRESET_DECK';
export const SET_KCSAPI_PRESET_SELECT = 'SET_KCSAPI_PRESET_SELECT';
export const SET_KCSAPI_PRESET_REGISTER = 'SET_KCSAPI_PRESET_REGISTER';

export const setKcsapiMasterData = data => ({
	type: SET_KCSAPI_MASTER_DATA,
	data
});

export const setKcsapiUserData = data => ({
	type: SET_KCSAPI_USER_DATA,
	data
});

export const setKcsapiDeckShip = data => ({
	type: SET_KCSAPI_DECK_SHIP,
	data
});

export const setKcsapiDeck = data => ({
	type: SET_KCSAPI_DECK,
	data
});

export const setKcsapiPresetDeck = data => ({
	type: SET_KCSAPI_PRESET_DECK,
	data
});

export const setKcsapiPresetSelect = data => ({
	type: SET_KCSAPI_PRESET_SELECT,
	data
});

export const setKcsapiPresetRegister = data => ({
	type: SET_KCSAPI_PRESET_REGISTER,
	data
});

export const TOGGLE_ALWAYS_ON_TOP = 'TOGGLE_ALWAYS_ON_TOP';
export const SET_ALWAYS_ON_TOP = 'SET_ALWAYS_ON_TOP';

export const toggleAlwaysOnTop = () => ({
	type: TOGGLE_ALWAYS_ON_TOP
});

export const setAlwaysOnTop = flag => ({
	type: SET_ALWAYS_ON_TOP,
	flag
});

export const RELOAD_WEBVIEW = 'RELOAD_WEBVIEW';
export const reloadWebview = (targetId, clearCache) => ({
	type: RELOAD_WEBVIEW,
	targetId,
	clearCache
});

export const SET_SWF_URL = 'SET_SWF_URL';
export const setSwfURL = swfURL => ({
	type: SET_SWF_URL,
	swfURL
});

export const SET_HAS_NOTIFICATION = 'SET_HAS_NOTIFICATION';
export const setHasNotification = hasNotification => ({
	type: SET_HAS_NOTIFICATION,
	hasNotification
});
