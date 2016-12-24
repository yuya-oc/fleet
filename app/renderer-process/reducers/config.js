const initialState = {screenshotDir: '.'};

const config = (state = initialState, action) => {
	if (action.type === 'aaa') {
		return {};
	}
	return state;
};

export default config;
