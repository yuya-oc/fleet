const webpack = require('webpack');

module.exports = {
	output: {
		path: './app',
		filename: '[name]_bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader'
			}, {
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000'
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		})
	],
	target: 'electron',
	devtool: process.env.NODE_ENV === 'production' ? false : '#inline-source-map'
};
