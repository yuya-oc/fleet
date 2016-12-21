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
			}
		]
	},
	target: 'electron',
	devtool: '#inline-source-map'
};
