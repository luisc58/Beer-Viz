const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
  devtool: 'source-map',
	plugins:[
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true, minimize: true }),
		new webpack.DefinePlugin({
			'process.env': {'NODE_ENV':JSON.stringify('production')}
		})
	]
});
