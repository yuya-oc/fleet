import fs from 'fs';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {electronEnhancer} from 'redux-electron-store';

import reducers from '../reducers';
import configManager, {configFile} from './middleware/configManager';

function createReduxStore() {
	let store;

	const config = (() => {
		try {
			return JSON.parse(fs.readFileSync(configFile, 'utf-8'));
		} catch (e) {
			console.error(e);
			return {};
		}
	})();

	const enhancer = compose(
		applyMiddleware(configManager),
		electronEnhancer({
			dispatchProxy: a => store.dispatch(a)
		})
	);

	const initialState = {
		config,
		fleets: {},
		appState: {
			muted: false,
			webviewScale: 1.0
		}
	};

	store = createStore(combineReducers(reducers), initialState, enhancer);

	return store;
}

export default createReduxStore;
