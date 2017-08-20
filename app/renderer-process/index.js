import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {ipcRenderer, remote, webFrame} from 'electron';
import winston from 'winston';
import fs from 'fs';
import path from 'path';

import {loadConfig, reloadWebview, setHasNotification} from '../actions';
import {createReduxStore} from './createReduxStore';
import {hasNotificationHandler, appStateHandler, restoreAppState} from './reduxHandlers';
import App from './components/App';
import Overview from './containers/Overview';
import Settings from './containers/Settings';

import kcsapi from '../lib/kcsapi';

import '!style-loader!css-loader!photonkit/dist/css/photon.css';

const appStateJsonPath = path.join(remote.app.getPath('userData'), 'appState.json');
const webviewId = 'kancolle';

webFrame.setVisualZoomLevelLimits(1, 1);

const store = createReduxStore({
	onChangeHasNotification: hasNotificationHandler,
	onChangeAppState: appStateHandler(appStateJsonPath)
});

try {
	const data = fs.readFileSync(appStateJsonPath, 'utf8');
	const appState = JSON.parse(data);
	restoreAppState(store, appState);
} catch (err) {
	winston.info(err);
}

store.dispatch(loadConfig());

ipcRenderer.on('IPC_REDUX_DISPATCH', (event, action) => {
	store.dispatch(action);
});

ipcRenderer.on('IPC_REQUEST_STATE', () => {
	ipcRenderer.send('IPC_RESPOND_STATE', store.getState());
});

ipcRenderer.on('IPC_RELOAD_WEBVIEW', () => {
	store.dispatch(reloadWebview(webviewId, false));
});

const history = syncHistoryWithStore(hashHistory, store);
const routes = (
	<Route path="/" component={App} webviewId={webviewId}>
		<IndexRedirect to="/overview"/>
		<Route path="/overview">
			<IndexRedirect to="/overview/0"/>
			<Route path="/overview/:fleetIndex" component={Overview}/>
		</Route>
		<Route path="/settings" component={Settings}/>
	</Route>
);

function renderUI() {
	render(
		<Provider store={store}>
			<Router history={history} routes={routes}/>
		</Provider>,
	document.getElementById('root')
);
}
renderUI();
setInterval(() => {
	renderUI();
}, 1000);

const sec = 1000;
const minute = 60 * sec;

setInterval(() => {
	const state = store.getState();
	const missions = state.gameData.user.api_deck_port ? kcsapi.resolveMissions(state.masterData, state.gameData.user) : [];
	let hasNotification = false;
	missions.forEach(mission => {
		if (mission.sortie) {
			if (Math.abs(mission.completionDateValue - minute - Date.now()) <= sec / 2) {
				const notification = new Notification(mission.api_name, {body: 'まもなく帰還します'});
				notification.onclick = () => {
					remote.getCurrentWindow().show();
				};
			}
			if (mission.completionDateValue - Date.now() < minute) {
				hasNotification = true;
			}
		}
	});

	if (state.appState.hasNotification !== hasNotification) {
		store.dispatch(setHasNotification(hasNotification));
	}
}, 1000);
