import {ipcRenderer} from 'electron';
import {TAKE_SCREENSHOT} from '../actions';

export const REDUX_IPC_ACTION = 'REDUX_IPC_ACTION';

const ipcManager = store => next => action => {
	switch (action.type) {
		case TAKE_SCREENSHOT: {
			const state = store.getState();
			const ipcAction = Object.assign({}, action, {
				webviewScale: state.appState.webviewScale,
				screenshotDir: state.config.screenshotDir
			});
			ipcRenderer.send(REDUX_IPC_ACTION, ipcAction);
			break;
		}
		default:
			break;
	}
	return next(action);
};

export default ipcManager;
