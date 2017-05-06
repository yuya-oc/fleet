import {ipcRenderer} from 'electron';
import winston from 'winston';
import fs from 'fs';

import {setWebviewScale} from '../actions';

export function hasNotificationHandler(hasNotification) {
	ipcRenderer.send('SET_NOTIFICATION', hasNotification);
}

export function appStateReplacer(key, value) {
	if (key === 'swfURL') {
		return '';
	}
	return value;
}

export function appStateHandler(appStateJsonPath) {
	return appState => {
		fs.writeFile(
		appStateJsonPath,
		JSON.stringify(appState, appStateReplacer, '  '),
		err => {
			if (err) {
				winston.info(err);
			}
		});
	};
}

export function restoreAppState(store, appState) {
	store.dispatch(setWebviewScale(appState.webviewScale));
}
