import {app, BrowserWindow, dialog} from 'electron';

let mainWindow;

try {
	app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
} catch (err) {
	console.log(err);
	dialog.showErrorBox('Flash Plugin not found', `You need to install Flash Plugin (PPAPI)\n\n${err}`);
	app.quit();
}

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		webPreferences: {
			plugins: true
		}
	});
	mainWindow.loadURL('http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/');
});
