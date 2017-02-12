import {app, BrowserWindow, screen} from 'electron';
import isDev from 'electron-is-dev';
import windowStateKeeper from 'electron-window-state';
import winston from 'winston';

function createMainWindow() {
	const scaleFactor = screen.getPrimaryDisplay().scaleFactor;
	const mainWindowState = windowStateKeeper({
		defaultWidth: (800 + 400) / scaleFactor,
		defaultHeight: 600
	});

	const mainWindow = new BrowserWindow({
		show: false,
		autoHideMenuBar: true,
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		backgroundColor: '#f5f5f5'
	});
	mainWindowState.manage(mainWindow);
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
			winston.error('You need to execute `yarn run watch` in another console.');
			app.quit();
		}
	});

	mainWindow.dispatch = action => {
		mainWindow.webContents.send('IPC_REDUX_DISPATCH', action);
	};

	return mainWindow;
}

export default createMainWindow;
