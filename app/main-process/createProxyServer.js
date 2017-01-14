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
	proxy.on('proxyRes', (proxyRes, req, res) => {
		proxyServer.emit('proxyRes', proxyRes, req, res);
	});
	return proxyServer;
}

export default createProxyServer;
