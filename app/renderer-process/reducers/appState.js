import {SET_AUDIO_MUTED} from '../actions';

const initialState = {muted: false};

const appState = (state = initialState, action) => {
	switch (action.type) {
		case SET_AUDIO_MUTED:
			return Object.assign({}, state, {muted: action.muted});
		default:
			return state;
	}
};

export default appState;
