import React from 'react';
import {Button} from 'react-bootstrap';
import {remote} from 'electron';
import fs from 'fs';
import dateFormat from 'dateformat';

function getFileName(date) {
	return `fleet_${dateFormat(date, 'yyyy-mm-dd_HH-MM-ss-l')}.png`;
}

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
		const date = new Date();
		remote.getCurrentWindow().webContents.capturePage(bounds, image => {
			fs.writeFile(`${this.props.screenshotDir}/${getFileName(date)}`, image.toPNG(), err => {
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
