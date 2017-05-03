import {app, BrowserWindow, ipcMain} from 'electron';
import {SET_SWF_URL, setSwfURL} from '../actions';
import isDev from 'electron-is-dev';

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
		show: false
	});
	if (isDev) {
		loginModal.loadURL('http://localhost:8080/login.html');
	} else {
		loginModal.loadURL(`file://${app.getAppPath()}/login.html`);
	}
	ipcMain.once(SET_SWF_URL, (e, swfURL) => {
		mainWindow.dispatch(setSwfURL(swfURL));
	});
	return loginModal;
}

export default createLoginModal;
