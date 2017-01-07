import {SET_AUDIO_MUTED, TOGGLE_ALWAYS_ON_TOP, RELOAD_WEBVIEW, setAlwaysOnTop} from '../../actions';
import {remote} from 'electron';

const electronMiddleware = store => next => action => {
	switch (action.type) {
		case SET_AUDIO_MUTED: {
			const webview = document.getElementById(action.targetId); // eslint-disable-line no-undef
			webview.getWebContents().setAudioMuted(action.muted);
			break;
		}
		case TOGGLE_ALWAYS_ON_TOP:
			setImmediate(() => {
				const currentWindow = remote.getCurrentWindow();
				const isAlwaysOnTop = currentWindow.isAlwaysOnTop();
				currentWindow.setAlwaysOnTop(!isAlwaysOnTop);
				store.dispatch(setAlwaysOnTop(!isAlwaysOnTop));
			});
			break;
		case RELOAD_WEBVIEW: {
			const webview = document.getElementById(action.targetId); // eslint-disable-line no-undef
			webview.reload();
			break;
		}
		default:
			break;
	}
	return next(action);
};

export default electronMiddleware;
