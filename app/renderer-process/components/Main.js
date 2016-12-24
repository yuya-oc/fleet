import React from 'react';
import ScreenshotButton from '../containers/ScreenshotButton';
import SettingsButton from './SettingsButton';

const Main = props => (
	<div>
		<ScreenshotButton
			targetId={props.route.webviewId}
			/>
		{' '}
		<SettingsButton/>
	</div>
);

Main.propTypes = {
	route: React.PropTypes.object
};

export default Main;
