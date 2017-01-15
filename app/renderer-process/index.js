import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {Router, Route, IndexRedirect, hashHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import {webFrame} from 'electron';
import {electronEnhancer} from 'redux-electron-store';

import reducers from '../reducers';
import electronMiddleware from './middleware/electronMiddleware';
import App from './components/App';
import Overview from './containers/Overview';
import Settings from './containers/Settings';

import '!style!css!photon/dist/css/photon.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	}),
	{},
	composeEnhancers(
		applyMiddleware(electronMiddleware),
		electronEnhancer({
			dispatchProxy: a => store.dispatch(a)
		})
	)
);

const history = syncHistoryWithStore(hashHistory, store);

const webviewId = 'kancolle';

render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App} webviewId={webviewId}>
				<IndexRedirect to="/overview"/>
				<Route path="/overview">
					<IndexRedirect to="/overview/0"/>
					<Route path="/overview/:fleetIndex" component={Overview}/>
				</Route>
				<Route path="/settings" component={Settings}/>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root')
);

webFrame.setVisualZoomLevelLimits(1, 1);
