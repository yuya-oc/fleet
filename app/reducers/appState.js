import {SET_AUDIO_MUTED, SET_WEBVIEW_SCALE} from '../actions';

const initialState = {muted: false, webviewScale: 1.0};

const appState = (state = initialState, action) => {
	switch (action.type) {
		case SET_AUDIO_MUTED:
			return Object.assign({}, state, {muted: action.muted});
		case SET_WEBVIEW_SCALE:
			return Object.assign({}, state, {webviewScale: action.scale});
		default:
			return state;
	}
};

export default appState;
