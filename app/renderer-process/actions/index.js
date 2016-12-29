
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

export const SET_AUDIO_MUTED = 'SET_MUTED';

export const setAudioMuted = muted => {
	return {
		type: SET_AUDIO_MUTED,
		muted
	};
};
