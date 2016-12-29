import React from 'react';
import ScreenshotButton from '../containers/ScreenshotButton';
import SettingsButton from './SettingsButton';
import MuteButton from '../containers/MuteButton';

const Main = props => (
	<div>
		<ScreenshotButton
			targetId={props.route.webviewId}
			/>
		{' '}
		<MuteButton targetId={props.route.webviewId}>Mute</MuteButton>
		{' '}
		<SettingsButton/>
	</div>
);

Main.propTypes = {
	route: React.PropTypes.object
};

export default Main;
