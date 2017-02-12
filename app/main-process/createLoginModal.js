import {app, BrowserWindow, ipcMain} from 'electron';
import {SET_SWF_URL, setSwfURL} from '../actions';
import isDev from 'electron-is-dev';

const gameURL = 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/';

function createLoginModal(mainWindow) {
	console.log('getSwfURL', gameURL);
	const loginModal = new BrowserWindow({
		parent: mainWindow,
		modal: true,
		show: false
	});
	if (isDev) {
		loginModal.loadURL('http://localhost:8080/login.html');
	} else {
		loginModal.loadURL(`file://${app.getAppPath()}/login.html`);
	}
	ipcMain.on('SHOW_LOGIN_WINDOW', (e, show) => {
		if (show) {
			loginModal.show();
		} else {
			loginModal.hide();
		}
	});
	ipcMain.once(SET_SWF_URL, (e, swfURL) => {
		mainWindow.dispatch(setSwfURL(swfURL));
	});
	return loginModal;
}

export default createLoginModal;
