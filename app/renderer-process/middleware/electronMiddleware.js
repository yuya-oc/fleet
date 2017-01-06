import {SET_AUDIO_MUTED} from '../../actions';

const electronMiddleware = store => next => action => {
	switch (action.type) {
		case SET_AUDIO_MUTED: {
			const webview = document.getElementById(action.targetId); // eslint-disable-line no-undef
			webview.getWebContents().setAudioMuted(action.muted);
			break;
		}
		default:
			break;
	}
	return next(action);
};

export default electronMiddleware;
