const chokidar = require('chokidar');
const electron = require('electron-connect').server.create();

const file = process.argv[2];
electron.start(['app']);
chokidar.watch(file).on('change', () => {
	electron.restart(['app']);
});
