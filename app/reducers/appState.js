import {SET_AUDIO_MUTED, SET_ALWAYS_ON_TOP, SET_WEBVIEW_SCALE} from '../actions';

const initialState = {muted: false, webviewScale: 1.0, alwaysOnTop: false};

const appState = (state = initialState, action) => {
	switch (action.type) {
		case SET_AUDIO_MUTED:
			return Object.assign({}, state, {muted: action.muted});
		case SET_WEBVIEW_SCALE:
			return Object.assign({}, state, {webviewScale: action.scale});
		case SET_ALWAYS_ON_TOP:
			return Object.assign({}, state, {alwaysOnTop: action.flag});
		default:
			return state;
	}
};

export default appState;
