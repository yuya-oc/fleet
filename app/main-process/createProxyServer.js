import httpProxy from 'http-proxy';
import http from 'http';
import url from 'url';
import stripBomBuf from 'strip-bom-buf';

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
				const body = stripBomBuf(buffer).toString();
				proxyServer.emit('kcsapiRes', proxyRes, req, parsed.pathname, body);
			});
		}
	});
	return proxyServer;
}

export default createProxyServer;
