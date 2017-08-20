import {app, BrowserWindow, ipcMain, screen} from 'electron';
import isDev from 'electron-is-dev';
import windowStateKeeper from 'electron-window-state';
import winston from 'winston';
import {requestLogin} from '../actions';

function createMainWindow() {
	const scaleFactor = screen.getPrimaryDisplay().scaleFactor;
	const mainWindowState = windowStateKeeper({
		defaultWidth: (800 + 400) / scaleFactor,
		defaultHeight: 600
	});

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

	const mainWindow = new BrowserWindow({
		icon,
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
		mainWindow.dispatch(requestLogin());
		// If (isDev) {
		//	mainWindow.openDevTools();
		// }
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

	mainWindow.requestState = () => {
		return new Promise(resolve => {
			ipcMain.once('IPC_RESPOND_STATE', (event, state) => {
				resolve(state);
			});
			mainWindow.webContents.send('IPC_REQUEST_STATE');
		});
	};

	mainWindow.reloadWebview = () => {
		mainWindow.webContents.send('IPC_RELOAD_WEBVIEW');
	};

	return mainWindow;
}

export default createMainWindow;
