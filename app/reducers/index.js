import masterData from './masterData';
import gameData from './gameData';
import config from './config';
import appState from './appState';

const reducers = {
	masterData,
	gameData,
	config,
	appState
};

export const initialState = {
	masterData: masterData.initialState,
	gameData: gameData.initialState,
	config: config.initialState,
	appState: appState.initialState
};

export default reducers;
