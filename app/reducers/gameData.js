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
			const fleetIndex = action.data.api_id - 1;
			const shipIndex = action.data.api_ship_idx;
			switch (action.data.api_ship_id) {
				case -1: // はずす
					newState.user.api_deck_port[fleetIndex].api_ship.splice(shipIndex, 1, -1);
					break;
				case -2: // 随伴艦一括解除
					newState.user.api_deck_port[fleetIndex].api_ship.splice(1, 5, -1, -1, -1, -1, -1);
					break;
				default: {
					newState.user.api_deck_port[fleetIndex].api_ship[shipIndex] = action.data.api_ship_id;
					break;
				}
			}
			return newState;
		}
		default:
			return state;
	}
};

export default gameData;
