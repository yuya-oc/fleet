
const config = (state = {screenshotDir: 'screenshots'}, action) => {
	if (action.type === 'aaa') {
		return {};
	}
	return state;
};

export default config;
