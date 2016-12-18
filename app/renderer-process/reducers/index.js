import {combineReducers} from 'redux';
import fleets from './fleets';
import config from './config';

const fleetApp = combineReducers({
	fleets,
	config
});

export default fleetApp;
