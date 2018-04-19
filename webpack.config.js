const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
let envFile = require('node-env-file');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
	if(process.env.NODE_ENV === 'development'){
		envFile(path.join(__dirname, 'config/' + process.env.NODE_ENV + '.env'));
	}
} catch(e) {
	console.log(e);
}

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
				test   : /\.jsx|js$/,
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
			$     : 'jquery',
			jQuery: 'jquery'
			
		}),

		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendors', 'manifest']
		}),
		new htmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV                    : JSON.stringify(process.env.NODE_ENV),
				FIREBASE_API_KEY            : JSON.stringify(process.env.FIREBASE_API_KEY),
				FIREBASE_AUTH_DOMAIN        : JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
				FIREBASE_DATABASE_URL       : JSON.stringify(process.env.FIREBASE_DATABASE_URL),
				FIREBASE_PROJECT_ID         : JSON.stringify(process.env.FIREBASE_PROJECT_ID),
				FIREBASE_STORAGE_BUCKET     : JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
				FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
				GOOGLE_MAP_API_KEY          : JSON.stringify(process.env.GOOGLE_MAP_API_KEY),
				OPEN_WEATHER_MAP_API_KEY    : JSON.stringify(process.env.OPEN_WEATHER_MAP_API_KEY),
				FIREBASE_SDK_TYPE: JSON.stringify(process.env.FIREBASE_SDK_TYPE),
				FIREBASE_SDK_PROJECT_ID: JSON.stringify(process.env.FIREBASE_SDK_PROJECT_ID),
				FIREBASE_SDK_PRIVATE_KEY_ID: JSON.stringify(process.env.FIREBASE_SDK_PRIVATE_KEY_ID),
				FIREBASE_SDK_PRIVATE_KEY: JSON.stringify(process.env.FIREBASE_SDK_PRIVATE_KEY),
				FIREBASE_SDK_CLIENT_EMAIL: JSON.stringify(process.env.FIREBASE_SDK_CLIENT_EMAIL),
				FIREBASE_SDK_CLIENT_ID: JSON.stringify(process.env.FIREBASE_SDK_CLIENT_ID),
				FIREBASE_SDK_AUTH_URI: JSON.stringify(process.env.FIREBASE_SDK_AUTH_URI),
				FIREBASE_SDK_TOKEN_URI: JSON.stringify(process.env.FIREBASE_SDK_TOKEN_URI),
				FIREBASE_SDK_AUTH_PROVIDER: JSON.stringify(process.env.FIREBASE_SDK_AUTH_PROVIDER),
				FIREBASE_SDK_CLIENT_CERT_URL: JSON.stringify(process.env.FIREBASE_SDK_CLIENT_CERT_URL),
				FIREBASE_PROCESS_PASS_ID: JSON.stringify(process.env.FIREBASE_SDK_CLIENT_CERT_URL)
			}

		}),
		new CopyWebpackPlugin([
			{ from: 'assets/images', to: path.join(__dirname, 'dist/images') }
		])
	],
	devServer: {
		historyApiFallback: true,
		contentBase       : path.join(__dirname, 'dist'),
		port              : 8088
	},
	stats    : {
		color: true
	},
	devtool  : 'source-map'
};

