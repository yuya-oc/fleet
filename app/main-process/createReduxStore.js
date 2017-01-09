import fs from 'fs';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {electronEnhancer} from 'redux-electron-store';

import {setWebviewScale} from '../actions';
import reducers from '../reducers';
import electronMiddleware from './middleware/electronMiddleware';
import configManager, {configFile} from './middleware/configManager';

function createReduxStore(mainWindow) {
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
		applyMiddleware(configManager, electronMiddleware(mainWindow)),
		electronEnhancer({
			dispatchProxy: a => store.dispatch(a)
		})
	);

	const initialState = Object.assign({}, reducers.initialState, {config});

	store = createStore(combineReducers(reducers), initialState, enhancer);
	store.dispatch(setWebviewScale(1.0));

	return store;
}

export default createReduxStore;
