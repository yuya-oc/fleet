import fs from 'fs';
import url from 'url';
import zlib from 'zlib';
import {WritableStreamBuffer} from 'stream-buffers';
import stripBomBuf from 'strip-bom-buf';
import mkdirp from 'mkdirp';

const svDataLen = 'svdata='.length;

function isKcsapiURL(URL) {
	return url.parse(URL).path.startsWith('/kcsapi/');
}

function parseRequestBuffer(buffer) {
	const data = decodeURIComponent(buffer.toString());
	const obj = {};
	for (const pair of data.split('&')) {
		const [key, value] = pair.split('=');
		if (value.match(/^-?[0-9]+$/)) {
			obj[key] = parseInt(value, 10);
		} else {
			obj[key] = value;
		}
	}
	return obj;
}

function getRequestBuffer(req, callback) {
	const bufStream = new WritableStreamBuffer();
	req.pipe(bufStream).on('finish', () => {
		callback(bufStream.getContents());
	});
}

function getRequestData(req, callback) {
	getRequestBuffer(req, buffer => {
		callback(parseRequestBuffer(buffer));
	});
}

function getResponseStream(res) {
	switch (res.headers['content-encoding']) {
		case 'gzip':
			return res.pipe(zlib.createGunzip());
		case 'deflate':
			return res.pipe(zlib.createInflate());
		default:
			return res;
	}
}

function parseResponseBuffer(buffer) {
	const data = stripBomBuf(buffer).slice(svDataLen);
	return JSON.parse(data.toString());
}

function getResponseBuffer(res, callback) {
	const bufStream = new WritableStreamBuffer();
	getResponseStream(res).pipe(bufStream).on('finish', () => {
		callback(bufStream.getContents());
	});
}

function getProxyResponseData(proxyReq, callback) {
	proxyReq.on('response', proxyRes => {
		getResponseData(proxyRes, callback);
	});
}

function getResponseData(res, callback) {
	getResponseBuffer(res, buffer => {
		callback(parseResponseBuffer(buffer));
	});
}

function isSucceeded(data) {
	return data.api_result === 1;
}

function saveToDirectory(destDir, pathname, buffer, callback) {
	const match = pathname.match(/^\/(.*)\/([^\/]*)$/); // eslint-disable-line no-useless-escape
	const dir = `${destDir}/${match[1]}`;
	const file = match[2];
	mkdirp(dir, err => {
		if (err) {
			callback(err);
		}
		fs.writeFile(`${dir}/${file}`, buffer, callback);
	});
}

function resolveUserShip(masterData, userData, userShipId) {
	const userShip = Object.assign({}, userData.api_ship.find(ship => ship.api_id === userShipId));
	const masterShip = masterData.api_mst_ship.find(ship => ship.api_id === userShip.api_ship_id);
	return Object.assign(userShip, masterShip);
}

function resolveFleet(masterData, userData, index) {
	const deck = userData.api_deck_port[index];
	return {
		name: deck.api_name,
		ship: deck.api_ship.reduce((ships, shipId) => {
			if (shipId >= 0) {
				ships.push(resolveUserShip(masterData, userData, shipId));
			}
			return ships;
		}, [])
	};
}

function resolveMission(masterData, missionId) {
	if (missionId === 0) {
		return null;
	}
	return masterData.api_mst_mission.find(mission => mission.api_id === missionId);
}

function resolveMissions(masterData, userData) {
	return userData.api_deck_port.slice(1).map(deck => ({
		sortie: deck.api_mission[0] !== 0,
		...resolveMission(masterData, deck.api_mission[1]),
		completionDateValue: deck.api_mission[2]
	}));
}

export default {
	isKcsapiURL,
	getRequestData,
	getProxyResponseData,
	isSucceeded,
	saveToDirectory,
	resolveFleet,
	resolveMissions
};
