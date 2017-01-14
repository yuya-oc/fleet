import {app, dialog} from 'electron';

import installExtension, {REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} from 'electron-devtools-installer';
import isDev from 'electron-is-dev';

import {setKcsapiMasterData, setKcsapiPortData} from './actions';
import createProxyServer from './main-process/createProxyServer';
import createReduxStore from './main-process/createReduxStore';
import createMainWindow from './main-process/createMainWindow';
import createLoginModal from './main-process/createLoginModal';

const localProxyPort = 20010;

let mainWindow;
let loginModal;
let store;

try {
	app.commandLine.appendSwitch('ppapi-flash-path', app.getPath('pepperFlashSystemPlugin'));
} catch (err) {
	console.log(err);
	dialog.showErrorBox('Flash Plugin not found', `You need to install Flash Plugin (PPAPI)\n\n${err}`);
	app.quit();
}

app.commandLine.appendSwitch('proxy-server', `http=localhost:${localProxyPort}`);
const proxyServer = createProxyServer().listen(localProxyPort, 'localhost');
proxyServer.on('kcsapiRes', (proxyRes, req, pathname, body) => {
	console.log(proxyRes.statusCode, pathname);
	const index = body.indexOf('svdata=');
	const dataString = index === -1 ? body : body.substr(index + 7);
	if (proxyRes.statusCode === 200) {
		try {
			const data = JSON.parse(dataString);
			console.log('api_result:', data.api_result);
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
		} catch (e) {
			console.log(e);
			console.log('index:', index);
			console.log('dataString:', dataString.slice(0, 10), '...');
		}
	}
});

app.on('quit', () => {
	proxyServer.close();
});

app.on('ready', () => {
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
