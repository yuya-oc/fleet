import {SET_AUDIO_MUTED, TOGGLE_ALWAYS_ON_TOP, RELOAD_WEBVIEW, REQUEST_LOGIN, TAKE_SCREENSHOT, SET_WEBVIEW_SCALE, requestLogin, setAlwaysOnTop} from '../../actions';
import {ipcRenderer, remote} from 'electron';

const electronMiddleware = store => next => action => {
	switch (action.type) {
		case SET_AUDIO_MUTED: {
			const webview = document.getElementById(action.targetId);
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
		case RELOAD_WEBVIEW:
			if (store.getState().appState.loginRequired) {
				setImmediate(() => {
					store.dispatch(requestLogin());
				});
			} else {
				const webview = document.getElementById(action.targetId);
				if (action.clearCache) {
					webview.getWebContents().session.clearCache(() => {
						webview.reload();
					});
				} else {
					webview.reload();
				}
			}
			break;
		case SET_WEBVIEW_SCALE: // fallthrough
			ipcRenderer.send('IPC_REDUX_ACTION', action);
			break;
		case TAKE_SCREENSHOT:
			ipcRenderer.send('IPC_REDUX_ACTION', action, store.getState());
			break;
		case REQUEST_LOGIN:
			ipcRenderer.send('IPC_REDUX_ACTION', action);
			break;
		default:
			break;
	}
	return next(action);
};

export default electronMiddleware;
