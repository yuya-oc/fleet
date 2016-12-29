const chokidar = require('chokidar');
const spawn = require('cross-spawn');
const kill = require('tree-kill');

const appPath = process.argv[2];
const files = process.argv.slice(3);

function spawnElectron() {
	return spawn('electron', ['-r', 'babel-register', appPath], {stdio: 'inherit'});
}

var child = spawnElectron();
chokidar.watch(files).on('change', () => {
	kill(child.pid, 'SIGINT');
	child = spawnElectron();
});
