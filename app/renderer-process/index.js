import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import {Router, Route, browserHistory} from 'react-router';
import {syncHistoryWithStore, routerReducer} from 'react-router-redux';

import fleetApp from './reducers';
import App from './components/App';

let store = createStore(
	combineReducers({
		...fleetApp,
		routing: routerReducer
	})
);

const history = syncHistoryWithStore(browserHistory, store);

render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}/>
		</Router>
	</Provider>,
	document.getElementById('root') // eslint-disable-line no-undef
);
