import {app, dialog, session} from 'electron';
import url from 'url';

import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from 'electron-devtools-installer';
import isDev from 'electron-is-dev';
import winston from 'winston';

import {setKcsapiMasterData, setKcsapiUserData} from './actions';
import createProxyServer from './main-process/createProxyServer';
import createReduxStore from './main-process/createReduxStore';
import createMainWindow from './main-process/createMainWindow';
import createLoginModal from './main-process/createLoginModal';
import kcsapi from './lib/kcsapi';

const localProxyPort = 20010;

let mainWindow;
let loginModal;
let store;

if (isDev || process.argv.includes('--log-level=debug')) {
	winston.level = 'debug';
}

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
	winston.error(err);
	dialog.showErrorBox('Flash Plugin not found', `You need to install Flash Plugin (PPAPI)\n\n${err}`);
	app.quit();
}

app.commandLine.appendSwitch('proxy-server', `http=localhost:${localProxyPort}`);
const proxyServer = createProxyServer().listen(localProxyPort, 'localhost');
proxyServer.on('proxyReq', (proxyReq, req) => {
	if (kcsapi.isKcsapiURL(req.url)) {
		proxyReq.on('response', proxyRes => {
			winston.silly(req.url);
			kcsapi.getResponseBuffer(proxyRes, buffer => {
				const pathname = url.parse(req.url).pathname;
				try {
					const data = kcsapi.parseResponseBuffer(buffer);
					if (kcsapi.isSucceeded(data)) {
						switch (pathname) {
							case '/kcsapi/api_start2': // ログイン直後、GAME START押下前
								store.dispatch(setKcsapiMasterData(data.api_data));
								break;
							case '/kcsapi/api_port/port': // 母港帰投時
								store.dispatch(setKcsapiUserData(data.api_data));
								break;
							default:
								winston.debug('Unhandled API:', pathname);
								break;
						}
					}
				} catch (err) {
					winston.error(err);
				}

				if (isDev || process.argv.includes('--save-kcsapi')) {
					kcsapi.saveToDirectory(app.getPath('userData'), pathname, buffer, err => {
						if (err) {
							winston.warn(err);
						}
					});
				}
			});
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
			.then(name => winston.info(`Added Extension:  ${name}`))
			.catch(err => winston.warn('An error occurred: ', err));
		installExtension(REDUX_DEVTOOLS)
			.then(name => winston.info(`Added Extension:  ${name}`))
			.catch(err => console.warn('An error occurred: ', err));
	}
});

app.on('window-all-closed', () => {
	app.quit();
});
