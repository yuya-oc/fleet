import React from 'react';
import ScreenshotButton from './ScreenshotButton';
import SettingsButton from './SettingsButton';

class Main extends React.Component {
	render() {
		return (
			<div>
				<ScreenshotButton
					targetId={this.props.route.webviewId}
					screenshotDir={'.'}
					/>
				{' '}
				<SettingsButton/>
			</div>
		);
	}
}

Main.propTypes = {
	route: React.PropTypes.object
};

export default Main;
