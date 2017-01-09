import {SET_CONFIG, SET_SCREENSHOT_DIR} from '../actions';

export const initialState = {screenshotDir: '.'};

const config = (state = initialState, action) => {
	switch (action.type) {
		case SET_CONFIG:
			return Object.assign({}, state, action.config);
		case SET_SCREENSHOT_DIR:
			return Object.assign({}, state, {
				screenshotDir: action.directory
			});
		default:
			return state;
	}
};

export default config;
