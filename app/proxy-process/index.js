import url from 'url';
import createProxyServer from '../main-process/createProxyServer';
import kcsapi from '../lib/kcsapi';

const localProxyPort = process.argv[2];

const proxyServer = createProxyServer().listen(localProxyPort, 'localhost', () => {
	process.send({event: 'listening'});
});

proxyServer.on('proxyReq', (proxyReq, req) => {
	if (kcsapi.isKcsapiURL(req.url)) {
		kcsapi.getRequestData(req, requestData => {
//			Winston.silly(req.url);
			kcsapi.getProxyResponseData(proxyReq, responseData => {
				const pathname = url.parse(req.url).pathname;
				process.send({
					event: 'kcsapi',
					pathname,
					requestData,
					responseData
				});
			});
		});
	}
});

process.on('exit', () => {
	proxyServer.close();
});
