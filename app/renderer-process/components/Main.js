import React from 'react';
import ScreenshotButton from './ScreenshotButton';
import SettingsButton from './SettingsButton';

const Main = props => (
	<div>
		<ScreenshotButton
			targetId={props.route.webviewId}
			screenshotDir={'.'}
			/>
		{' '}
		<SettingsButton/>
	</div>
);

Main.propTypes = {
	route: React.PropTypes.object
};

export default Main;
