const Application = require('spectron').Application;
const assert = require('assert');
const fixtures = require('./fixtures');

describe('Application', function () {
	this.timeout(10000);

	beforeEach(function () {
		this.app = new Application({
			path: fixtures.getPackedAppPath('Fleet')
		});
		return this.app.start();
	});

	afterEach(function () {
		if (this.app && this.app.isRunning()) {
			return this.app.stop();
		}
	});

	it('shows initial windows', function () {
		return this.app.client.waitUntilWindowLoaded()
			.getWindowCount().then(count => {
				// main, webview, login
				assert.equal(count, 3);
			});
	});
});
