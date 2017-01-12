const path = require('path');

module.exports = {
	getPackedAppPath(productName) {
		const prefix = path.resolve(__dirname, '../../dist');
		switch (process.platform) {
			case 'win32':
				return path.resolve(prefix, `win-ia32-unpacked/${productName}.exe`);
			case 'darwin':
				return path.resolve(prefix, `mac/${productName}.app/Contents/MacOS/${productName}`);
			case 'linux':
				return path.resolve(prefix, `linux-unpacked/${productName.toLowerCase()}`);
			default:
				return '';
		}
	}
};
