const merge = require('webpack-merge');
const base = require('./webpack.config.base');

module.exports = merge(base, {
	entry: {
		'renderer-process/index': './app/renderer-process/index.js'
	}
});
