import {app, dialog, ipcMain, session} from 'electron';
import url from 'url';

import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from 'electron-devtools-installer';
import isDev from 'electron-is-dev';
import winston from 'winston';

import {setKcsapiMasterData, setKcsapiUserData, setKcsapiDeckShip, setKcsapiDeck, setKcsapiPresetDeck, setKcsapiPresetSelect, setKcsapiPresetRegister, setLoginRequired, REQUEST_LOGIN, TAKE_SCREENSHOT, SET_WEBVIEW_SCALE} from './actions';
import createProxyServer from './main-process/createProxyServer';
import createMainWindow from './main-process/createMainWindow';
import createLoginModal from './main-process/createLoginModal';
import {takeScreenshot, getCurrentDeviceScaleFactor} from './main-process/ipcReduxActions';
import kcsapi from './lib/kcsapi';

const localProxyPort = 20010;

let mainWindow = null;
let loginModal = null;

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
		kcsapi.getRequestData(req, requestData => {
			winston.silly(req.url);
			kcsapi.getProxyResponseData(proxyReq, responseData => {
				const pathname = url.parse(req.url).pathname;
				if (kcsapi.isSucceeded(responseData)) {
					switch (pathname) {
						case '/kcsapi/api_start2': // ログイン直後、GAME START押下前
							mainWindow.dispatch(setKcsapiMasterData(responseData.api_data));
							break;
						case '/kcsapi/api_port/port': // 母港帰投時
							mainWindow.dispatch(setKcsapiUserData(responseData.api_data));
							break;
						case '/kcsapi/api_get_member/deck':
							mainWindow.dispatch(setKcsapiDeck(responseData.api_data));
							break;
						case '/kcsapi/api_get_member/preset_deck':
							mainWindow.dispatch(setKcsapiPresetDeck(responseData.api_data));
							break;
						case '/kcsapi/api_req_hensei/change':
							mainWindow.dispatch(setKcsapiDeckShip(requestData));
							break;
						case '/kcsapi/api_req_hensei/preset_register':
							mainWindow.dispatch(setKcsapiPresetRegister(requestData));
							break;
						case '/kcsapi/api_req_hensei/preset_select':
							mainWindow.dispatch(setKcsapiPresetSelect(requestData));
							break;
						default:
							winston.debug('Unhandled API:', pathname);
							break;
					}
				} else {
					winston.info('API response failed: Need to login');
					mainWindow.dispatch(setLoginRequired(true));
				}
				if (isDev || process.argv.includes('--save-kcsapi')) {
					kcsapi.saveToDirectory(app.getPath('userData'), pathname, responseData, err => {
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
	ipcMain.on('SHOW_LOGIN_WINDOW', (e, show) => {
		if (show) {
			loginModal.show();
		} else {
			loginModal.hide();
		}
	});

	ipcMain.on('IPC_REDUX_ACTION', (event, action, state) => {
		switch (action.type) {
			case TAKE_SCREENSHOT:
				takeScreenshot(mainWindow, state.config.screenshotDir, action.bounds, state.appState.webviewScale);
				break;
			case SET_WEBVIEW_SCALE: {
				const factor = getCurrentDeviceScaleFactor(mainWindow);
				mainWindow.setMinimumSize(Math.ceil(830 * action.scale / factor), Math.ceil(600 * action.scale / factor));
				break;
			}
			case REQUEST_LOGIN:
				if (loginModal === null) {
					loginModal = createLoginModal(mainWindow);
					loginModal.on('closed', () => {
						loginModal = null;
					});
				}
				break;
			default:
				break;
		}
	});

	if (isDev) {
		installExtension(REACT_DEVELOPER_TOOLS)
			.then(name => winston.info(`Added Extension:  ${name}`))
			.catch(err => winston.warn('An error occurred: ', err));
		installExtension(REDUX_DEVTOOLS)
			.then(name => winston.info(`Added Extension:  ${name}`))
			.catch(err => winston.warn('An error occurred: ', err));
	}

	ipcMain.on('SET_NOTIFICATION', (event, hasNotification) => {
		if (hasNotification) {
			mainWindow.setOverlayIcon(`${app.getAppPath()}/assets/badge.ico`, `${app.getName()} has notifications`);
		} else {
			mainWindow.setOverlayIcon(null, '');
		}
	});
});

app.on('window-all-closed', () => {
	app.quit();
});
