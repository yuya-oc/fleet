import {readFileSync} from 'fs';

export function getDistribution() {
	if (process.platform !== 'linux') {
		return 'not linux';
	}
	const procVersion = readFileSync('/proc/version');
	if (procVersion.includes('Ubuntu')) {
		return 'ubuntu';
	}
	return 'undetect';
}
