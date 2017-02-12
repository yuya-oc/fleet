import {SET_KCSAPI_MASTER_DATA, SET_KCSAPI_USER_DATA, SET_KCSAPI_DECK_SHIP} from '../actions';

export const initialState = {
	master: null,
	user: {
		ships: [],
		fleets: []
	}
};

const gameData = (state = initialState, action) => {
	switch (action.type) {
		case SET_KCSAPI_MASTER_DATA:
			return Object.assign({}, state, {
				master: action.data
			});
		case SET_KCSAPI_USER_DATA:
			return Object.assign({}, state, {
				user: action.data
			});
		case SET_KCSAPI_DECK_SHIP: {
			const newState = Object.assign({}, state, {
				user: state.user
			});
			const fleetIndex = Math.floor(action.data.api_ship_idx / 6);
			const shipIndex = action.data.api_ship_idx % 6;
			console.log(newState.user.api_deck_port[fleetIndex].api_ship[shipIndex]);
			newState.user.api_deck_port[fleetIndex].api_ship = [...newState.user.api_deck_port[fleetIndex].api_ship]; // eslint-disable-line camelcase
			newState.user.api_deck_port[fleetIndex].api_ship[shipIndex] = action.data.api_ship_id;
			console.log(newState.user.api_deck_port[fleetIndex].api_ship[shipIndex]);
			return newState;
		}
		default:
			return state;
	}
};

export default gameData;
