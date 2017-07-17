const merge = require('webpack-merge');
const base = require('./webpack.config.base');

module.exports = merge(base, {
	entry: {
		main: './app/main.js',
		'proxy-process/index': './app/proxy-process/index.js'
	}
});
