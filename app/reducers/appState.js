import {SET_CURRENT_DATE_VALUE, SET_AUDIO_MUTED, SET_LOGIN_REQUIRED, SET_ALWAYS_ON_TOP, SET_WEBVIEW_SCALE, SET_SWF_URL, SET_HAS_NOTIFICATION} from '../actions';

export const initialState = {
	swfURL: '',
	currentDateValue: 0,
	muted: false,
	webviewScale: 1.0,
	alwaysOnTop: false,
	loginRequired: true,
	hasNotification: false
};

const appState = (state = initialState, action) => {
	switch (action.type) {
		case SET_CURRENT_DATE_VALUE:
			return Object.assign({}, state, {currentDateValue: action.value});
		case SET_AUDIO_MUTED:
			return Object.assign({}, state, {muted: action.muted});
		case SET_WEBVIEW_SCALE:
			return Object.assign({}, state, {webviewScale: action.scale});
		case SET_ALWAYS_ON_TOP:
			return Object.assign({}, state, {alwaysOnTop: action.flag});
		case SET_SWF_URL:
			return Object.assign({}, state, {swfURL: action.swfURL, loginRequired: false});
		case SET_LOGIN_REQUIRED:
			return Object.assign({}, state, {loginRequired: action.loginRequired});
		case SET_HAS_NOTIFICATION:
			return Object.assign({}, state, {hasNotification: action.hasNotification});
		default:
			return state;
	}
};

export default appState;
