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
		remote.getCurrentWindow().webContents.capturePage(this.props.screenshotBounds, image => {
			fs.writeFile(`${this.props.screenshotDir}/test.png`, image.toPNG(), err => {
				if (err) {
					console.err(err);
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
	screenshotBounds: React.PropTypes.shape({
		x: React.PropTypes.number.isRequired,
		y: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired
	}).isRequired
};

export default ScreenshotButton;
