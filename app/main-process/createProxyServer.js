import httpProxy from 'http-proxy';
import http from 'http';
import url from 'url';
import fs from 'fs';
import zlib from 'zlib';
import stripBomBuf from 'strip-bom-buf';
import mkdirp from 'mkdirp';
import {app} from 'electron';
import isDev from 'electron-is-dev';
import streamBuffers from 'stream-buffers';

function createProxyServer() {
	const proxy = httpProxy.createProxyServer();
	const proxyServer = http.createServer((req, res) => {
		const parsed = url.parse(req.url);
		const target = `${parsed.protocol}//${parsed.host}`;
		proxy.web(req, res, {target});
	});
	proxy.on('proxyRes', function (proxyRes, req) {
		const parsed = url.parse(req.url);
		if (parsed.path.startsWith('/kcsapi/')) {
			const bufStream = new streamBuffers.WritableStreamBuffer();
			const contentEncoding = proxyRes.headers['content-encoding'];
			console.log('content-encoding:', contentEncoding);
			switch (contentEncoding) {
				case 'gzip':
					proxyRes.pipe(zlib.createGunzip()).pipe(bufStream);
					break;
				case 'deflate':
					proxyRes.pipe(zlib.createInflate()).pipe(bufStream);
					break;
				default:
					proxyRes.pipe(bufStream);
					break;
			}
			proxyRes.on('end', () => {
				const buffer = bufStream.getContents();
				try {
					if (isDev || process.argv.includes('--save-kcsapi')) {
						console.log('content-type:', proxyRes.headers['content-type']);
						const match = parsed.pathname.match(/^\/(.*)\/([^\/]*)$/); // eslint-disable-line no-useless-escape
						const dir = `${app.getPath('userData')}/${match[1]}`;
						const file = match[2];
						console.log('file:', dir + '/' + file);
						mkdirp(dir, err => {
							if (err) {
								console.error(err);
								return;
							}
							fs.writeFile(`${dir}/${file}`, buffer, err => {
								if (err) {
									console.error(err);
								}
							});
						});
					}
				} catch (e) {
					console.error(e);
				}
				const body = stripBomBuf(buffer).toString();
				proxyServer.emit('kcsapiRes', proxyRes, req, parsed.pathname, body);
			});
		}
	});
	return proxyServer;
}

export default createProxyServer;
