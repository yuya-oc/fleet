import hoxy from 'hoxy';

const localProxyPort = process.argv[2];

const proxyServer = hoxy.createServer().listen(localProxyPort, 'localhost', () => {
	process.send({event: 'listening'});
});

function parseIntInObject(object) {
	const newObj = {};
	for (let key in object) {
		if (Object.prototype.hasOwnProperty.call(object, key)) {
			const value = object[key];
			if (typeof object[key] === 'object') {
				newObj[key] = parseIntInObject(value);
			} else if (value.match(/^-?[0-9]+$/)) {
				newObj[key] = parseInt(value, 10);
			} else {
				newObj[key] = value;
			}
		}
	}
	return newObj;
}

proxyServer.intercept({
	phase: 'request',
	url: '/kcsapi/*',
	as: 'params'
}, (req, resp) => {
	const requestData = parseIntInObject(req.params);
	return new Promise(resolve => {
		process.once('message', message => {
			if (message.event === 'ack-accept-request') {
				if (message.accept === false) {
					resp.string = 'svdata={"api_result": "1", "api_result_msg": "失敗"}';
				}
				resolve();
			}
		});
		process.send({
			event: 'confirm-accept-request',
			pathname: req.url,
			requestData}
		);
	});
});

proxyServer.intercept({
	phase: 'response',
	url: '/kcsapi/*',
	as: 'string'
}, (req, resp) => {
	const requestData = parseIntInObject(req.params);
	const responseData = JSON.parse(resp.string.slice('svdata='.length));
	process.send({
		event: 'kcsapi',
		pathname: req.url,
		method: req.method,
		requestData,
		responseData
	});
});

process.on('exit', () => {
	proxyServer.close();
});
