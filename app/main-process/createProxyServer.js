import httpProxy from 'http-proxy';
import http from 'http';
import url from 'url';

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
				const body = JSON.parse(buffer.toString().replace(/^svdata=/, ''));
				proxyServer.emit('kcsapiRes', req, parsed.pathname, body);
			});
		}
	});
	return proxyServer;
}

export default createProxyServer;
