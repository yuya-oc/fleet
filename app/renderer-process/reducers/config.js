import {SET_SCREENSHOT_DIR} from '../actions';

const initialState = {screenshotDir: '.'};

const config = (state = initialState, action) => {
	if (action.type === SET_SCREENSHOT_DIR) {
		return Object.assign({}, state, {
			screenshotDir: action.directory
		});
	}
	return state;
};

export default config;
