
export const SET_SCREENSHOT_DIR = 'SET_SCREENSHOT_DIR';

export const setScreenshotDir = directory => {
	return {
		type: SET_SCREENSHOT_DIR,
		directory
	};
};
