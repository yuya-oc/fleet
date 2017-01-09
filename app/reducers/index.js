import gameData from './gameData';
import config from './config';
import appState from './appState';

const reducers = {
	gameData,
	config,
	appState
};

export const initialState = {
	gameData: gameData.initialState,
	config: config.initialState,
	appState: appState.initialState
};

export default reducers;
