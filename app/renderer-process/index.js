import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import fleetApp from './reducers';
import App from './components/App';
import Main from './components/Main';
import Settings from './components/Settings';

let store = createStore(
	combineReducers({
		...fleetApp,
		routing: routerReducer
	})
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
