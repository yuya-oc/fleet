const webpack = require('webpack');

module.exports = {
	output: {
		path: './app',
		filename: '[name]_bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react'],
					plugins: ['transform-object-rest-spread']
				}
			}, {
				test: /\.json$/,
				loader: 'json'
			}
		]
	},
	target: 'electron',
	devtool: process.env.NODE_ENV === 'production' ? null : '#inline-source-map'
};
