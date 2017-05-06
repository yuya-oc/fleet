import {createStore, combineReducers, compose, applyMiddleware} from 'redux';
import {routerReducer} from 'react-router-redux';
import {remote} from 'electron';
import reducers from '../reducers';
import electronMiddleware from './middleware/electronMiddleware';
import configManager from './middleware/configManager';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function selectHasNotification(state) {
	if (state && state.appState) {
		return state.appState.hasNotification;
	}
	return null;
}

function subscribe(store, handlers) {
	let currentState = reducers.initialState;
	store.subscribe(() => {
		const nextState = store.getState();
		if (selectHasNotification(currentState) !== selectHasNotification(nextState)) {
			if (handlers.onChangeHasNotification) {
				handlers.onChangeHasNotification(selectHasNotification(nextState));
			}
		}
		currentState = nextState;
	});
}

export const createReduxStore = (handlers = {}) => {
	const store = createStore(
		combineReducers({
			...reducers,
			routing: routerReducer
		}),
		{},
		composeEnhancers(
			applyMiddleware(electronMiddleware, configManager(remote.app.getPath('userData')))
		)
	);
	subscribe(store, handlers);
	return store;
};
