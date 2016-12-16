module.exports = {
	entry: {
		main: './app/main.js',
		'renderer-process/index': './app/renderer-process/index.js'
	},
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
					presets: ['es2015', 'react']
				}
			}
		]
	},
	target: 'electron',
	devtool: '#inline-source-map'
};
