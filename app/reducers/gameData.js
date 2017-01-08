import {SET_KCSAPI_MASTER_DATA, SET_KCSAPI_PORT_DATA} from '../actions';

const initialState = {
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
				master: {
					ships: action.data.api_data.api_mst_ship.map(ship => ({
						id: ship.api_id,
						name: ship.api_name
					})),
					missions: action.data.api_data.api_mst_mission.map(mission => ({
						id: mission.api_id,
						name: mission.api_name
					}))
				}
			});
		case SET_KCSAPI_PORT_DATA: {
			const data = action.data.api_data;
			const newState = Object.assign({}, state, {
				user: {
					ships: data.api_ship.map(ship => ({
						id: ship.api_id,
						name: getShipName(state.master, ship.api_ship_id),
						level: ship.api_lv,
						condition: ship.api_cond
					})
				)}
			});
			newState.user.fleets = data.api_deck_port.map(deck => ({
				id: deck.api_id,
				name: deck.api_name,
				ships: deck.api_ship.reduce((ships, shipId) => {
					if (shipId >= 0) {
						ships.push(newState.user.ships.find(ship => ship.id === shipId));
					}
					return ships;
				}, []),
				mission: {
					sortie: deck.api_mission[0] === 1,
					name: getMissionName(state.master, deck.api_mission[1]),
					completionDateValue: deck.api_mission[2]
				}
			}));
			return newState;
		}
		default:
			return state;
	}
};

export default gameData;