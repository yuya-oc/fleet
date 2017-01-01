import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';
import {electronEnhancer} from 'redux-electron-store';

import reducers from '../reducers';
import App from './components/App';
import Main from './components/Main';
import Settings from './containers/Settings';
import ipcManager from './middleware/ipcManager';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-undef

let store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	}),
	{},
	composeEnhancers(
		applyMiddleware(ipcManager),
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
				<IndexRoute component={Main} webviewId={webviewId}/>
				<Route path="/settings" component={Settings}/>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('root') // eslint-disable-line no-undef
);
