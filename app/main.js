import {app, BrowserWindow, dialog} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from 'electron-devtools-installer';
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
		installExtension(REACT_DEVELOPER_TOOLS).then(name => {
			console.log(`Added Extension: ${name}`);
		});
		installExtension(REDUX_DEVTOOLS).then(name => {
			console.log(`Added Extension: ${name}`);
		});
		mainWindow.loadURL(`http://localhost:8080/`);
	} else {
		mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.on('did-fail-load', () => {
		if (isDev) {
			console.log('You need to execute `yarn run watch` in another console.');
			app.quit();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
});

app.on('window-all-closed', () => {
	app.quit();
});
