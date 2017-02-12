
const webpack = require('webpack');
const spawn = require('cross-spawn');
const kill = require('tree-kill');

const config = require('../webpack.config.main');

const appPath = process.argv[2];

let child;

function spawnElectron() {
	return spawn('electron', ['-r', 'babel-register', appPath], {stdio: 'inherit'});
}

webpack(config).watch({}, (err, stats) => {
	if (err) {
		console.log(err);
		return;
	}

	console.log(stats.toString({colors: true}));
	if (stats.hasErrors()) {
		return;
	}
	if (child) {
		kill(child.pid, 'SIGINT');
	}
	child = spawnElectron();
});
