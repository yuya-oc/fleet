import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {Router, Route, IndexRedirect, hashHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import {ipcRenderer, remote, webFrame} from 'electron';

import {loadConfig, requestLogin, setHasNotification} from '../actions';
import reducers from '../reducers';
import electronMiddleware from './middleware/electronMiddleware';
import configManager from './middleware/configManager';
import App from './components/App';
import Overview from './containers/Overview';
import Settings from './containers/Settings';

import kcsapi from '../lib/kcsapi';

import '!style-loader!css-loader!photon/dist/css/photon.css';

webFrame.setVisualZoomLevelLimits(1, 1);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	}),
	{},
	composeEnhancers(
		applyMiddleware(electronMiddleware, configManager(remote.app.getPath('userData')))
	)
);
store.dispatch(loadConfig());
store.dispatch(requestLogin());

ipcRenderer.on('IPC_REDUX_DISPATCH', (event, action) => {
	store.dispatch(action);
});

const history = syncHistoryWithStore(hashHistory, store);
const webviewId = 'kancolle';
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
	missions.forEach(mission => {
		if (mission.sortie && Math.abs(mission.completionDateValue - minute - Date.now()) <= sec / 2) {
			const notification = new Notification(mission.api_name, {body: 'まもなく帰還します'});
			notification.onclick = () => {
				remote.getCurrentWindow().show();
			};
		}
	});

	let hasNotification = false;
	for (let mission of missions) {
		if (mission.sortie && mission.completionDateValue - Date.now() < minute) {
			hasNotification = true;
			break;
		}
	}
	if (state.appState.hasNotification !== hasNotification) {
		store.dispatch(setHasNotification(hasNotification));
	}
}, 1000);

let hasNotification = false;
store.subscribe(() => {
	const currentValue = store.getState().appState.hasNotification;
	if (hasNotification !== currentValue) {
		hasNotification = currentValue;
		ipcRenderer.send('SET_NOTIFICATION', hasNotification);
	}
});
