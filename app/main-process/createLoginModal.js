import {app, BrowserWindow, ipcMain} from 'electron';
import {SET_SWF_URL, setSwfURL} from '../actions';

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
	loginModal.loadURL('http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/');
	ipcMain.once(SET_SWF_URL, (e, swfURL) => {
		mainWindow.dispatch(setSwfURL(swfURL));
	});
	return loginModal;
}

export default createLoginModal;
