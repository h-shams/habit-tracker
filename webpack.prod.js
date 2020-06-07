const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
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

		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),

		new HtmlWebpackPlugin({
			template: 'src/index.html',
		})
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
