import {app, BrowserWindow, ipcMain} from 'electron';
import isDev from 'electron-is-dev';
import winston from 'winston';
import {SET_SWF_URL, setSwfURL} from '../actions';

if (isDev || process.argv.includes('--log-level=debug')) {
	winston.level = 'debug';
}

ipcMain.on('LOGIN-MESSAGE', (event, level, message) => {
	winston.log(level, message);
});

function createLoginModal(mainWindow) {
	let icon = `${app.getAppPath()}/assets/icon`;
	switch (process.platform) {
		case 'win32':
			icon += '.ico';
			break;
		case 'linux':
			icon += '.png';
			break;
		default:
			break;
	}
	const loginModal = new BrowserWindow({
		icon,
		parent: mainWindow,
		backgroundThrottling: false,
		modal: true,
		show: false,
		webPreferences: {
			nodeIntegration: false,
			preload: `${app.getAppPath()}/renderer-process/login.js`
		}
	});
	loginModal.loadURL('https://www.dmm.com/my/-/login/', {extraHeaders: 'pragma: no-cache\n'});
	ipcMain.once(SET_SWF_URL, (e, swfURL) => {
		mainWindow.dispatch(setSwfURL(swfURL));
	});
	return loginModal;
}

export default createLoginModal;
