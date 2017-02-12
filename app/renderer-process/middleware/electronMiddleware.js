import {SET_CURRENT_DATE_VALUE, SET_AUDIO_MUTED, TOGGLE_ALWAYS_ON_TOP, RELOAD_WEBVIEW, REQUEST_LOGIN, TAKE_SCREENSHOT, SET_WEBVIEW_SCALE, requestLogin, setAlwaysOnTop} from '../../actions';
import {ipcRenderer, remote} from 'electron';
import kcsapi from '../../lib/kcsapi';

const sec = 1000;
const minute = 60 * sec;

const electronMiddleware = store => next => action => {
	switch (action.type) {
		case SET_CURRENT_DATE_VALUE: {
			const state = store.getState();
			const missions = state.gameData.user.api_deck_port ? kcsapi.resolveMissions(state.gameData.master, state.gameData.user) : [];
			missions.forEach(mission => {
				if (mission.sortie && Math.abs(mission.completionDateValue - minute - action.value) <= sec / 2) {
					const notification = new Notification(mission.name, {body: 'まもなく帰還します'});
					const currentWindow = remote.getCurrentWindow();
					notification.onclick = () => {
						currentWindow.show();
					};
				}
			});
			break;
		}
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
