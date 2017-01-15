import {app, dialog, session} from 'electron';
import url from 'url';

import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from 'electron-devtools-installer';
import isDev from 'electron-is-dev';

import {setKcsapiMasterData, setKcsapiPortData} from './actions';
import createProxyServer from './main-process/createProxyServer';
import createReduxStore from './main-process/createReduxStore';
import createMainWindow from './main-process/createMainWindow';
import createLoginModal from './main-process/createLoginModal';
import kcsapi from './lib/kcsapi';

const localProxyPort = 20010;

let mainWindow;
let loginModal;
let store;

const shouldQuit = app.makeSingleInstance(() => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}
		mainWindow.focus();
	}
});

if (shouldQuit) {
	app.quit();
}

try {
	app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
} catch (err) {
	console.log(err);
	dialog.showErrorBox('Flash Plugin not found', `You need to install Flash Plugin (PPAPI)\n\n${err}`);
	app.quit();
}

app.commandLine.appendSwitch('proxy-server', `http=localhost:${localProxyPort}`);
const proxyServer = createProxyServer().listen(localProxyPort, 'localhost');
proxyServer.on('proxyRes', (proxyRes, req) => {
	if (kcsapi.isKcsapiURL(req.url)) {
		console.log(req.headers['user-agent']);
		kcsapi.getResponseBuffer(proxyRes, buffer => {
			const pathname = url.parse(req.url).pathname;
			try {
				const data = kcsapi.parseResponseBuffer(buffer);
				if (kcsapi.isSucceeded(data)) {
					switch (pathname) {
						case '/kcsapi/api_start2':
							store.dispatch(setKcsapiMasterData(data));
							break;
						case '/kcsapi/api_port/port':
							store.dispatch(setKcsapiPortData(data));
							break;
						default:
							break;
					}
				}
			} catch (err) {
				console.log(err);
			}

			if (isDev || process.argv.includes('--save-kcsapi')) {
				kcsapi.saveToDirectory(app.getPath('userData'), pathname, buffer, err => {
					if (err) {
						console.log(err);
					}
				});
			}
		});
	}
});

app.on('quit', () => {
	proxyServer.close();
});

app.on('ready', () => {
	const userAgent = session.defaultSession.getUserAgent()
					.replace(new RegExp(`${app.getName()}\\/[^\\s]+\\s*`), '')
					.replace(/Electron\/[^\s]+\s*/, '');
	session.defaultSession.setUserAgent(userAgent);

	mainWindow = createMainWindow();
	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	store = createReduxStore(mainWindow); // eslint-disable-line no-unused-vars

	loginModal = createLoginModal(mainWindow, store);
	loginModal.on('closed', () => {
		loginModal = null;
		if (store.getState().appState.swfURL === '') {
			mainWindow.close();
		}
	});

	if (isDev) {
		installExtension(REACT_DEVELOPER_TOOLS)
			.then(name => console.log(`Added Extension:  ${name}`))
			.catch(err => console.log('An error occurred: ', err));
		installExtension(REDUX_DEVTOOLS)
			.then(name => console.log(`Added Extension:  ${name}`))
			.catch(err => console.log('An error occurred: ', err));
	}
});

app.on('window-all-closed', () => {
	app.quit();
});
