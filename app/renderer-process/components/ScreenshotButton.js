import React from 'react';
import {Button} from 'react-bootstrap';
import {remote} from 'electron';
import fs from 'fs';

class ScreenshotButton extends React.Component {
	constructor() {
		super();
		this.handleScreenshot = this.handleScreenshot.bind(this);
	}

	handleScreenshot() {
		const rect = document.getElementById(this.props.targetId).getBoundingClientRect(); // eslint-disable-line no-undef
		const bounds = {
			x: Math.floor(rect.left),
			y: Math.floor(rect.top),
			width: Math.floor(rect.width),
			height: Math.floor(rect.height)
		};
		remote.getCurrentWindow().webContents.capturePage(bounds, image => {
			fs.writeFile(`${this.props.screenshotDir}/test.png`, image.toPNG(), err => {
				if (err) {
					console.error(err);
				}
			});
		});
	}

	render() {
		return (
			<Button
				onClick={this.handleScreenshot}
				>Screenshot</Button>
		);
	}
}

ScreenshotButton.propTypes = {
	screenshotDir: React.PropTypes.string.isRequired,
	targetId: React.PropTypes.string.isRequired
};

export default ScreenshotButton;
