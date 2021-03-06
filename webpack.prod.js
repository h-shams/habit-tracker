const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const manifest = require('./manifest.json.js');
const {InjectManifest} = require('workbox-webpack-plugin');
const webpackPwaManifest = require('webpack-pwa-manifest');
const faviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = env => {
	const envVariables = setEnvVariables(env)

	return {
		mode: 'production',

	  entry: {
	    main: './src/scripts/core.js',
			sw: './src/scripts/sw/sw.js',
		},

	  output: {
	    filename: '[name].bundle.js',
	    path: path.resolve(__dirname, 'dist'),
	  },

		devtool: 'none',

		plugins: [
			new CleanWebpackPlugin(),

			new webpack.DefinePlugin({
				'__ENV__': JSON.stringify(envVariables)
			}),

			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),

			new webpackPwaManifest(manifest),

			new HtmlWebpackPlugin({
				template: 'src/index.html',
			}),

			new faviconsWebpackPlugin({
				logo: './src/icons/icon_maskable512.png',
				cache: true,
				outputPath: 'icons',
				prefix: 'icons/',
		    favicons: {
		      appName: 'Habit Tracker',
		      appDescription: 'An opne-source habit and goal tracker',
		      icons: {
						android: false,
						firefox: false,
						appleStartup: false,
						windows: false,
						appleIcon: false,
		        coast: false,
		        yandex: false
		      }
		    }
			}),

			new InjectManifest({
				swSrc: './src/scripts/sw/assets.json',
				compileSrc: false,
				swDest: 'assets.json',
				// exclude: ['sw.bundle.js']
				excludeChunks: ['sw']
			}),
		],

		module: {
			rules: [

				// js files
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'eslint-loader',
						options: {
							fix: true,
						},
					},
				},

				// sass files
				{
					test: /\.s[ac]ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
	            options: { importLoaders: 2},
						},
						'postcss-loader',
						'group-css-media-queries-loader',
						'sass-loader',
					],
				},

				//fonts
				{
					test: /\.ttf$/,
					use: [
						'file-loader'
					],
				},

				// svg files
				{
					test: /\.svg$/,
					use: [
						'file-loader'
					],
				},

				// html files
				{
					test: /\.html$/,
					use: [
						'html-loader'
					],
				},
			],
		},
	}
}

function setEnvVariables(env) {
	let baseUrl, isDev
	if(env){
		switch (env.mode) {
			case 'dev':
				baseUrl = 'http://localhost:4200/'
				isDev = true
			break;
			case 'localProd':
				baseUrl = 'http://localhost:5320/'
				isDev = false
			break;
			default:
				baseUrl = 'https://h-shams.github.io/habit-tracker/'
				isDev = false
		}
	}else{
		baseUrl = 'https://h-shams.github.io/habit-tracker/'
		isDev = false
	}

	return{
		baseUrl: baseUrl,
		isDevMode: isDev
	}

}
