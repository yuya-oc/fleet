import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import fs from 'fs';

import reducers from './reducers';
import App from './components/App';
import Main from './components/Main';
import Settings from './containers/Settings';
import configManager, {configFile} from './middleware/configManager';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-undef

const config = (() => {
	try {
		return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	} catch (e) {
		console.error(e);
		return {};
	}
})();

let store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	}),
	{config},
	composeEnhancers(applyMiddleware(configManager))
);

const history = syncHistoryWithStore(browserHistory, store);

const webviewId = 'kancolle';

render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App} webviewId={webviewId}>
				<IndexRoute component={Main} webviewId={webviewId}/>
				<Route path="/settings" component={Settings}/>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root') // eslint-disable-line no-undef
);
