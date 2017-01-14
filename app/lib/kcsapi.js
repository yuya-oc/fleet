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

export default {
	isKcsapiURL,
	getResponseBuffer,
	parseResponseBuffer,
	isSucceeded,
	saveToDirectory
};
