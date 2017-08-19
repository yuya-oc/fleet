import {app, dialog, ipcMain, session, shell} from 'electron';
import {fork} from 'child_process';
import path from 'path';

import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from 'electron-devtools-installer';
import isDev from 'electron-is-dev';
import {autoUpdater} from 'electron-updater';
import winston from 'winston';

import {setKcsapiMasterData, setKcsapiUserData, setKcsapiDeckShip, setKcsapiDeck, setKcsapiPresetDeck, setKcsapiPresetSelect, setKcsapiPresetRegister, setLoginRequired, REQUEST_LOGIN, TAKE_SCREENSHOT, SET_WEBVIEW_SCALE} from './actions';
import createMainWindow from './main-process/createMainWindow';
import createLoginModal from './main-process/createLoginModal';
import getFlashPluginPath, {hasPPAPIFlashPath} from './main-process/getFlashPluginPath';
import {takeScreenshot, getCurrentDeviceScaleFactor} from './main-process/ipcReduxActions';
import kcsapi from './lib/kcsapi';

const localProxyPort = 20010;

let mainWindow = null;
let loginModal = null;
let proxyProcess = null;

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

if (!hasPPAPIFlashPath(process.argv)) {
	try {
		app.commandLine.appendSwitch('ppapi-flash-path', getFlashPluginPath());
	} catch (err) {
		winston.error(err);
		dialog.showErrorBox('Flash Plugin not found', `You need to install Flash Plugin (PPAPI)\n\n${err}`);
		app.quit();
	}
}

app.commandLine.appendSwitch('proxy-server', `http=localhost:${localProxyPort}`);

function handleProxyMessage(win, message) {
	if (message.event === 'kcsapi') {
		const {pathname, requestData, responseData} = message;
		if (kcsapi.isSucceeded(responseData)) {
			switch (pathname) {
				case '/kcsapi/api_start2': // ログイン直後、GAME START押下前
					win.dispatch(setKcsapiMasterData(responseData.api_data));
					break;
				case '/kcsapi/api_port/port': // 母港帰投時
					win.dispatch(setKcsapiUserData(responseData.api_data));
					break;
				case '/kcsapi/api_get_member/deck':
					win.dispatch(setKcsapiDeck(responseData.api_data));
					break;
				case '/kcsapi/api_get_member/preset_deck':
					win.dispatch(setKcsapiPresetDeck(responseData.api_data));
					break;
				case '/kcsapi/api_req_hensei/change':
					win.dispatch(setKcsapiDeckShip(requestData));
					break;
				case '/kcsapi/api_req_hensei/preset_register':
					win.dispatch(setKcsapiPresetRegister(requestData));
					break;
				case '/kcsapi/api_req_hensei/preset_select':
					win.dispatch(setKcsapiPresetSelect(requestData));
					break;
				default:
					winston.debug('Unhandled API:', pathname);
					break;
			}
		} else {
			winston.info('API response failed: Need to login');
			win.dispatch(setLoginRequired(true));
		}
		if (isDev || process.argv.includes('--save-kcsapi')) {
			kcsapi.saveToDirectory(app.getPath('userData'), pathname, requestData, responseData, err => {
				if (err) {
					winston.warn(err);
				}
			});
		}
	}
}

function createProxyProcess(proxyModule) {
	return new Promise((resolve, reject) => {
		const proxy = fork(proxyModule, [localProxyPort]);
		proxy.once('message', message => {
			if (message.event === 'listening') {
				resolve(proxy);
			} else {
				reject(new Error(`Unexpected message: ${message}`));
			}
		});
	});
}

function setNotification(browserWindow, hasNotification) {
	switch (process.platform) {
		case 'win32':
			if (hasNotification) {
				mainWindow.setOverlayIcon(`${app.getAppPath()}/assets/badge.ico`, `${app.getName()} has notifications`);
			} else {
				mainWindow.setOverlayIcon(null, `${app.getName()} has no notifications`);
			}
			break;
		case 'darwin':
			app.dock.setBadge(hasNotification ? '•' : '');
			break;
		case 'linux':
			app.setBadgeCount(hasNotification ? 1 : 0);
			break;
		default:
			break;
	}
}

app.on('quit', () => {
	proxyProcess.kill();
});

app.on('ready', async () => {
	proxyProcess = await createProxyProcess(path.join(app.getAppPath(), 'proxy-process/index_bundle.js'));
	const userAgent = session.defaultSession.getUserAgent()
					.replace(new RegExp(`${app.getName()}\\/[^\\s]+\\s*`), '')
					.replace(/Electron\/[^\s]+\s*/, '');
	session.defaultSession.setUserAgent(userAgent);

	mainWindow = createMainWindow();
	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	proxyProcess.on('message', message => {
		handleProxyMessage(mainWindow, message);
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
		setNotification(mainWindow, hasNotification);
	});

	autoUpdater.on('update-available', info => {
		dialog.showMessageBox({
			type: 'info',
			buttons: ['更新する', 'キャンセル'],
			defaultId: 0,
			title: '更新',
			message: '新しいバージョンがあります。更新しますか？',
			cancelId: 1
		},
		response => {
			if (response === 0) {
				shell.openExternal(`https://github.com/yuya-oc/fleet/releases/v${info.version}`);
			}
		});
	}).on('error', err => {
		console.err(err);
	});
	autoUpdater.autoDownload = false;
	// If (isDev) {
	//	autoUpdater.setFeedURL('http://localhost:8081');
	// }
	autoUpdater.checkForUpdates();
});

app.on('window-all-closed', () => {
	app.quit();
});
