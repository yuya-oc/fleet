import {SET_KCSAPI_MASTER_DATA} from '../actions';

export const initialState = {};

const gameData = (state = initialState, action) => {
	switch (action.type) {
		case SET_KCSAPI_MASTER_DATA:
			return Object.assign({}, action.data);
		default:
			return state;
	}
};

export default gameData;
