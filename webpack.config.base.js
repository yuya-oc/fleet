const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const path = require('path');

const plugins = [
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
	})
];
if (process.env.NODE_ENV === 'production') {
	plugins.push(new BabiliPlugin());
}

module.exports = {
	output: {
		path: path.resolve(__dirname, 'app'),
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
	plugins,
	target: 'electron',
	devtool: process.env.NODE_ENV === 'production' ? false : '#inline-source-map'
};
