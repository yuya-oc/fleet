import fs from 'fs';
import electron from 'electron';
import dateFormat from 'dateformat';
import mkdirp from 'mkdirp';
import winston from 'winston';

function getFileName(date) {
	return `fleet_${dateFormat(date, 'yyyy-mm-dd_HH-MM-ss-l')}.png`;
}

export function takeScreenshot(browserWindow, screenshotDir, webviewBounds, webviewScale) {
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
		if (!fs.existsSync(screenshotDir)) {
			mkdirp.sync(screenshotDir);
			electron.dialog.showMessageBox(browserWindow, {
				type: 'info',
				message: 'スクリーンショット保存先フォルダを作成しました',
				detail: screenshotDir,
				buttons: ['OK']
			});
		}
		const filename = `${screenshotDir}/${getFileName(date)}`;
		fs.writeFile(filename, screenshot.toPNG(), err => {
			if (err) {
				winston.error(err);
			}
		});
	});
}

export function getCurrentDeviceScaleFactor(browserWindow) {
	const currentDisplay = electron.screen.getDisplayMatching(browserWindow.getBounds());
	return currentDisplay.scaleFactor;
}
