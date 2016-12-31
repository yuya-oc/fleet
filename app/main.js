import {app, BrowserWindow, dialog, ipcMain} from 'electron';
import fs from 'fs';
import http from 'http';
import url from 'url';

import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from 'electron-devtools-installer';
import isDev from 'electron-is-dev';
import dateFormat from 'dateformat';
import httpProxy from 'http-proxy';

import {REDUX_IPC_ACTION} from './renderer-process/middleware/ipcManager';
import {TAKE_SCREENSHOT} from './renderer-process/actions';

const localProxyPort = 20010;

let mainWindow;

try {
	app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
} catch (err) {
	console.log(err);
	dialog.showErrorBox('Flash Plugin not found', `You need to install Flash Plugin (PPAPI)\n\n${err}`);
	app.quit();
}

app.commandLine.appendSwitch('proxy-server', `http=localhost:${localProxyPort}`);
const proxy = httpProxy.createProxyServer();
const proxyServer = http.createServer((req, res) => {
	const parsed = url.parse(req.url);
	const target = `${parsed.protocol}//${parsed.host}`;
	proxy.web(req, res, {target});
}).listen(localProxyPort);
proxy.on('proxyRes', function (proxyRes, req) {
	if (url.parse(req.url).path.startsWith('/kcsapi/')) {
		let chunks = [];
		proxyRes.on('data', chunk => {
			chunks.push(chunk);
		});

		proxyRes.on('end', () => {
			var buffer = Buffer.concat(chunks);
			console.log(req.url);
			console.log(buffer.toString());
		});
	}
});
app.on('quit', () => {
	proxyServer.close();
});

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

function getFileName(date) {
	return `fleet_${dateFormat(date, 'yyyy-mm-dd_HH-MM-ss-l')}.png`;
}

ipcMain.on(REDUX_IPC_ACTION, (event, action) => {
	switch (action.type) {
		case TAKE_SCREENSHOT: {
			const bounds = Object.assign({}, action.bounds, {
				width: Math.floor(action.bounds.width) + 1,
				height: Math.floor(action.bounds.height) + 1
			});
			const date = new Date();
			event.sender.capturePage(bounds, image => {
				const screenshot = image.crop({
					x: 0,
					y: 0,
					width: Math.round(800 * action.webviewScale),
					height: Math.round(480 * action.webviewScale)
				});
				const filename = `${action.screenshotDir}/${getFileName(date)}`;
				fs.writeFile(filename, screenshot.toPNG(), err => {
					if (err) {
						console.error(err);
					}
				});
			});
			break;
		}
		default:
			break;
	}
});
