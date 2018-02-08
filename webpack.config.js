const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const VENDOR_LIBS = [
	"axios",
	"lodash",
	"react",
	"react-dom",
	"react-redux",
	"react-router-dom",
	"redux",
	"redux-form",
	"redux-promise",
	"react-easy-chart",
	"react-stockcharts"
];

module.exports = {
	entry: {
		bundle: './src/index.js',
		vendors: VENDOR_LIBS
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].[chunkhash].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)$/,
				use: [
					{
						loader: 'url-loader',
						options: {limit: 40000}
					},
				'image-webpack-loader'
				]
			}
		]
	},
	plugins: [
	new webpack.optimize.CommonsChunkPlugin({
		names: ['vendors', 'manifest']
	}),
	new htmlWebpackPlugin({
		template: 'src/index.html'
	}),
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	})
	],
	devServer: {
		historyApiFallback: true,
		contentBase: './',
		port: 8088
	}
};
