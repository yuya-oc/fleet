import {app, BrowserWindow, dialog} from 'electron';
import loadDevtool from 'electron-load-devtool';
import isDev from 'electron-is-dev';

let mainWindow;

try {
	app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
} catch (err) {
	console.log(err);
	dialog.showErrorBox('Flash Plugin not found', `You need to install Flash Plugin (PPAPI)\n\n${err}`);
	app.quit();
}

app.on('ready', () => {
	mainWindow = new BrowserWindow({show: false});
	if (isDev) {
		loadDevtool(loadDevtool.REACT_DEVELOPER_TOOLS);
		loadDevtool(loadDevtool.REDUX_DEVTOOLS);
		mainWindow.loadURL(`http://localhost:8080/`);
	} else {
		mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
});

app.on('window-all-closed', () => {
	app.quit();
});
