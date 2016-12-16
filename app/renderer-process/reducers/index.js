import {combineReducers} from 'redux';
import fleets from './fleets';

const fleetApp = combineReducers({
	fleets
});

export default fleetApp;
