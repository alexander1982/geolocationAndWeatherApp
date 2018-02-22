const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
	entry    : {
		bundle : './src/index.js',
		vendors: VENDOR_LIBS
	},
	output   : {
		path    : path.join(__dirname, 'dist'),
		filename: '[name].[chunkhash].js'
	},
	module   : {
		rules: [
			{
				test   : /\.js$/,
				use    : 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use : ['style-loader', 'css-loader']
			},
			{
				test   : /\.scss$/,
				loaders: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(jpe?g|png|gif|mp4)$/i,
				use : [
					{
						loader : 'url-loader',
						options: { limit: 4000000 }
					},
					'image-webpack-loader'
				]
			},
			{
				test  : /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file-loader?name=fonts/[name].[ext]'
			}
		]
	},
	plugins  : [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),

		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendors', 'manifest']
		}),
		new htmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		new CopyWebpackPlugin([
			{ from: 'assets/images', to: path.join(__dirname, 'dist/images') }
		])
	],
	devServer: {
		historyApiFallback: true,
		contentBase       : path.join(__dirname, 'dist'),
		port              : 8088
	}
};
