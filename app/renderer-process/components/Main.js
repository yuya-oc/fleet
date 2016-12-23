import React from 'react';
import ScreenshotButton from './ScreenshotButton';

class Main extends React.Component {
	 render() {
		return (
			<ScreenshotButton
				targetId={this.props.route.webviewId}
				screenshotDir={'.'}
				/>
		);
	}
}

Main.propTypes = {
	route: React.PropTypes.object
};

export default Main;
