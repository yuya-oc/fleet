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
				loader: 'babel'
			}, {
				test: /\.json$/,
				loader: 'json'
			}
		]
	},
	target: 'electron',
	devtool: process.env.NODE_ENV === 'production' ? null : '#inline-source-map'
};
