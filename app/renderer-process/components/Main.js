import React from 'react';
import ScreenshotButton from '../containers/ScreenshotButton';
import SettingsButton from './SettingsButton';
import MuteButton from '../containers/MuteButton';
import ScaleDropdownButton from '../containers/ScaleDropdownButton';

const scales = [1.0, 1.25, 1.5, 1.75, 2.0];

const Main = props => (
	<div>
		<ScreenshotButton
			targetId={props.route.webviewId}
			/>
		{' '}
		<MuteButton targetId={props.route.webviewId}>Mute</MuteButton>
		{' '}
		<ScaleDropdownButton scales={scales} id="scaleDropdownButton"/>
		{' '}
		<SettingsButton/>
	</div>
);

Main.propTypes = {
	route: React.PropTypes.object
};

export default Main;
