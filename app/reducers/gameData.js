import {SET_KCSAPI_MASTER_DATA, SET_KCSAPI_USER_DATA, SET_KCSAPI_DECK_PORT} from '../actions';

export const initialState = {
	master: null,
	user: {
		ships: [],
		fleets: []
	}
};

function getShipName(master, shipId) {
	return master.ships.find(ship => ship.id === shipId).name;
}

function getMissionName(master, missionId) {
	if (missionId === 0) {
		return '';
	}
	return master.missions.find(mission => mission.id === missionId).name;
}

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
		case SET_KCSAPI_DECK_PORT:
			return Object.assign({}, state, {
				user: Object.assign({}, state.user.api_deck_port, action.data)
			});
		default:
			return state;
	}
};

export default gameData;
