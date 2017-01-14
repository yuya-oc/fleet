import httpProxy from 'http-proxy';
import http from 'http';
import url from 'url';
import fs from 'fs';
import stripBomBuf from 'strip-bom-buf';
import mkdirp from 'mkdirp';
import {app} from 'electron';
import isDev from 'electron-is-dev';

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
			const chunks = [];
			proxyRes.on('data', chunk => {
				chunks.push(chunk);
			});

			proxyRes.on('end', () => {
				const buffer = Buffer.concat(chunks);
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
