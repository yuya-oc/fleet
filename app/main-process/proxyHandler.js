import {app} from 'electron';
import isDev from 'electron-is-dev';
import winston from 'winston';
import {fork} from 'child_process';
import path from 'path';
import {setKcsapiMasterData, setKcsapiUserData, setKcsapiDeckShip, setKcsapiDeck, setKcsapiPresetDeck, setKcsapiPresetSelect, setKcsapiPresetRegister, setLoginRequired} from '../actions';
import customDialog from './customDialog';
import kcsapi from '../lib/kcsapi';

function createProxyProcess(localProxyPort) {
	const proxyModule = path.join(app.getAppPath(), 'proxy-process/index_bundle.js');
	return new Promise((resolve, reject) => {
		const proxy = fork(proxyModule, [localProxyPort]);
		proxy.once('message', message => {
			if (message.event === 'listening') {
				resolve(proxy);
			} else {
				reject(new Error(`Unexpected message: ${message}`));
			}
		});

		proxy.acceptRequest = accept => {
			proxy.send({event: 'ack-accept-request', accept});
		};

		proxy.registerMainWindow = win => {
			proxy.on('message', async message => {
				if (message.event === 'confirm-accept-request') {
					const accept = await handleProxyRequest(win, message);
					proxy.acceptRequest(accept);
					if (accept === false) {
						setTimeout(() => {
							win.reloadWebview();
						}, 500);
					}
				} else if (message.event === 'kcsapi') {
					handleProxyResponse(win, message);
				}
			});
		};
	});
}

async function handleProxyRequest(win, message) {
	let accept = true;
	switch (message.pathname) {
		case '/kcsapi/api_req_map/start': {
			if (message.requestData.api_maparea_id === 1 && message.requestData.api_mapinfo_no === 1) {
				const state = await win.requestState();
				const numOfShips = state.gameData.user.api_deck_port[message.requestData.api_deck_id - 1].api_ship.filter(s => s !== -1).length;
				if (numOfShips > 2) {
					accept = await customDialog.confirmActuallyLaunch(win);
				}
			}
			break;
		}
		default:
			break;
	}
	return accept;
}

function handleProxyResponse(win, message) {
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
				winston.debug('Unhandled API:', message.method, pathname);
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

module.exports = {
	createProxyProcess
};
