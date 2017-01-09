import fs from 'fs';
import dateFormat from 'dateformat';
import {TAKE_SCREENSHOT, setCurrentDateValue} from '../../actions';

function getFileName(date) {
	return `fleet_${dateFormat(date, 'yyyy-mm-dd_HH-MM-ss-l')}.png`;
}

function takeScreenshot(browserWindow, screenshotDir, webviewBounds, webviewScale) {
	const bounds = Object.assign({}, webviewBounds, {
		x: Math.floor(webviewBounds.x),
		y: Math.floor(webviewBounds.y),
		width: Math.ceil(webviewBounds.width),
		height: Math.ceil(webviewBounds.height)
	});
	const date = new Date();
	browserWindow.webContents.capturePage(bounds, image => {
		const screenshot = image.crop({
			x: 0,
			y: 0,
			width: Math.round(800 * webviewScale),
			height: Math.round(480 * webviewScale)
		});
		const filename = `${screenshotDir}/${getFileName(date)}`;
		fs.writeFile(filename, screenshot.toPNG(), err => {
			if (err) {
				console.error(err);
			}
		});
	});
}

const electronMiddleware = mainWindow => {
	return store => {
		setInterval(() => {
			setImmediate(() => {
				store.dispatch(setCurrentDateValue(Date.now()));
			});
		}, 1000);

		return next => action => {
			switch (action.type) {
				case TAKE_SCREENSHOT: {
					const state = store.getState();
					takeScreenshot(mainWindow, state.config.screenshotDir, action.bounds, state.appState.webviewScale);
					break;
				}
				default:
					break;
			}
			return next(action);
		};
	};
};

export default electronMiddleware;
