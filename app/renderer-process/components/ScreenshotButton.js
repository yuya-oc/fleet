import React from 'react';
import {Button} from 'react-bootstrap';

class ScreenshotButton extends React.Component {
	constructor() {
		super();
		this.handleScreenshot = this.handleScreenshot.bind(this);
	}

	handleScreenshot(onClick) {
		if (onClick) {
			return () => {
				const rect = document.getElementById(this.props.targetId).getBoundingClientRect(); // eslint-disable-line no-undef
				const bounds = {
					x: rect.left,
					y: rect.top,
					width: rect.width,
					height: rect.height
				};
				onClick(bounds);
			};
		}
	}

	render() {
		return (
			<Button
				onClick={this.handleScreenshot(this.props.onClick)}
				>Screenshot</Button>
		);
	}
}

ScreenshotButton.propTypes = {
	targetId: React.PropTypes.string.isRequired,
	onClick: React.PropTypes.func.isRequired
};

export default ScreenshotButton;
