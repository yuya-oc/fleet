import {SET_CURRENT_DATE_VALUE, SET_AUDIO_MUTED, TOGGLE_ALWAYS_ON_TOP, RELOAD_WEBVIEW, setAlwaysOnTop} from '../../actions';
import {remote} from 'electron';

const sec = 1000;
const minute = 60 * sec;

const electronMiddleware = store => next => action => {
	switch (action.type) {
		case SET_CURRENT_DATE_VALUE: {
			store.getState().gameData.user.fleets.forEach(fleet => {
				const mission = fleet.mission;
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
		case RELOAD_WEBVIEW: {
			const webview = document.getElementById(action.targetId);
			if (action.clearCache) {
				webview.getWebContents().session.clearCache(() => {
					webview.reload();
				});
			} else {
				webview.reload();
			}
			break;
		}
		default:
			break;
	}
	return next(action);
};

export default electronMiddleware;
