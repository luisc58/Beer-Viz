const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
	devtool: 'source-map',
	devServer: {
		port: 3000,
		historyApiFallback: true,
		contentBase: path.join(__dirname, 'dist'),
		index: 'index.html'
	}
});
