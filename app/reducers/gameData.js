/* eslint-disable camelcase */

import {SET_KCSAPI_MASTER_DATA, SET_KCSAPI_USER_DATA, SET_KCSAPI_DECK, SET_KCSAPI_DECK_SHIP, SET_KCSAPI_PRESET_DECK, SET_KCSAPI_PRESET_SELECT, SET_KCSAPI_PRESET_REGISTER} from '../actions';

export const initialState = {
	master: {},
	user: {},
	presetDeck: {}
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
			const newState = Object.assign({}, state);
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
		case SET_KCSAPI_DECK: {
			const newState = Object.assign({}, state);
			newState.user.api_deck_port = action.data;
			return newState;
		}
		case SET_KCSAPI_PRESET_DECK:
			return Object.assign({}, state, {
				presetDeck: action.data
			});
		case SET_KCSAPI_PRESET_SELECT: {
			const newState = Object.assign({}, state);
			const fleetIndex = action.data.api_deck_id - 1;
			const presetIndex = action.data.api_preset_no;
			Object.assign(newState.user.api_deck_port[fleetIndex], newState.presetDeck.api_deck[presetIndex]);
			return newState;
		}
		case SET_KCSAPI_PRESET_REGISTER: {
			const newState = Object.assign({}, state);
			const fleetIndex = action.data.api_deck_id - 1;
			const presetIndex = action.data.api_preset_no;
			newState.presetDeck.api_deck[presetIndex] = {
				api_name: action.data.api_name,
				api_name_id: action.data.api_name_id,
				api_preset_no: action.data.api_preset_no,
				api_ship: newState.user.api_deck_port[fleetIndex].api_ship.concat()
			};
			return newState;
		}
		default:
			return state;
	}
};

export default gameData;
