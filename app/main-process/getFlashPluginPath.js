import {app} from 'electron';
import {getDistribution} from '../lib/linux';

function getLinuxFlashPluginPath(distribution) {
	switch (distribution) {
		case 'ubuntu':
			return '/usr/lib/adobe-flashplugin/libpepflashplayer.so';
		default:
			return app.getPath('pepperFlashSystemPlugin');
	}
}

export default function getFlashPluginPath() {
	switch (process.platform) {
		case 'linux':
			return getLinuxFlashPluginPath(getDistribution());
		default:
			return app.getPath('pepperFlashSystemPlugin');
	}
}

export function hasPPAPIFlashPath(argv) {
	for (let v of argv) {
		if (v.match(/^--ppapi-flash-path=/)) {
			return true;
		}
	}
	return false;
}
