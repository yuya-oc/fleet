import {app, BrowserWindow} from 'electron';
import isDev from 'electron-is-dev';

function createMainWindow() {
	const mainWindow = new BrowserWindow({show: false, backgroundColor: '#f5f5f5'});
	if (isDev) {
		mainWindow.loadURL(`http://localhost:8080/`);
	} else {
		mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
		if (isDev) {
			mainWindow.openDevTools();
		}
	});

	mainWindow.webContents.on('did-fail-load', () => {
		if (isDev) {
			console.log('You need to execute `yarn run watch` in another console.');
			app.quit();
		}
	});

	return mainWindow;
}

export default createMainWindow();
