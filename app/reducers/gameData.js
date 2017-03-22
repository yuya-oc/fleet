/* eslint-disable camelcase */

import {SET_KCSAPI_USER_DATA, SET_KCSAPI_DECK, SET_KCSAPI_DECK_SHIP, SET_KCSAPI_PRESET_DECK, SET_KCSAPI_PRESET_SELECT, SET_KCSAPI_PRESET_REGISTER} from '../actions';

export const initialState = {
	user: {},
	presetDeck: {}
};

function searchShipFromDecks(apiDeckPort, shipId) {
	for (let deckIndex = 0; deckIndex < apiDeckPort.length; deckIndex++) {
		const orderIndex = apiDeckPort[deckIndex].api_ship.indexOf(shipId);
		if (orderIndex > -1) {
			return {deckIndex, orderIndex};
		}
	}
	return null;
}

function deepCopyState(state) {
	return JSON.parse(JSON.stringify(state));
}

const gameData = (state = initialState, action) => {
	switch (action.type) {
		case SET_KCSAPI_USER_DATA:
			return Object.assign({}, state, {
				user: action.data
			});
		case SET_KCSAPI_DECK_SHIP: {
			const newState = deepCopyState(state);
			const deckIndex = action.data.api_id - 1;
			const orderIndex = action.data.api_ship_idx;
			switch (action.data.api_ship_id) {
				case -1: // はずす
					newState.user.api_deck_port[deckIndex].api_ship.splice(orderIndex, 1);
					newState.user.api_deck_port[deckIndex].api_ship.push(-1);
					break;
				case -2: // 随伴艦一括解除
					newState.user.api_deck_port[deckIndex].api_ship.splice(1, 5, -1, -1, -1, -1, -1);
					break;
				default: {
					const shipId = action.data.api_ship_id;
					const existingShipId = newState.user.api_deck_port[deckIndex].api_ship[orderIndex];
					const from = searchShipFromDecks(newState.user.api_deck_port, shipId);
					newState.user.api_deck_port[deckIndex].api_ship[orderIndex] = shipId;
					if (from) {
						newState.user.api_deck_port[from.deckIndex].api_ship[from.orderIndex] = existingShipId;
					}
					newState.user.api_deck_port = newState.user.api_deck_port.map(deck => {
						deck.api_ship = deck.api_ship.filter(v => v !== -1);
						deck.api_ship.push(-1, -1, -1, -1, -1, -1);
						deck.api_ship.length = 6;
						return deck;
					});
					break;
				}
			}
			return newState;
		}
		case SET_KCSAPI_DECK: {
			const newState = deepCopyState(state);
			newState.user.api_deck_port = action.data;
			return newState;
		}
		case SET_KCSAPI_PRESET_DECK:
			return Object.assign({}, state, {
				presetDeck: action.data
			});
		case SET_KCSAPI_PRESET_SELECT: {
			const newState = deepCopyState(state);
			const deckIndex = action.data.api_deck_id - 1;
			const presetIndex = action.data.api_preset_no;
			Object.assign(newState.user.api_deck_port[deckIndex], newState.presetDeck.api_deck[presetIndex]);
			return newState;
		}
		case SET_KCSAPI_PRESET_REGISTER: {
			const newState = deepCopyState(state);
			const deckIndex = action.data.api_deck_id - 1;
			const presetIndex = action.data.api_preset_no;
			newState.presetDeck.api_deck[presetIndex] = {
				api_name: action.data.api_name,
				api_name_id: action.data.api_name_id,
				api_preset_no: action.data.api_preset_no,
				api_ship: newState.user.api_deck_port[deckIndex].api_ship.concat()
			};
			return newState;
		}
		default:
			return state;
	}
};

export default gameData;
