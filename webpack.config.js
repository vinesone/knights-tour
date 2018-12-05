const path = require('path');
const outputPath = path.resolve(__dirname, 'dist');

const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./index.html",
  filename: "./index.html"
});

module.exports = {

  mode: 'development',

  entry: {
    bundle: './index.js'
  },

  output: {
    path: outputPath,
    publicPath: '/dist/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss$/,
        use: [ 'style-loader', 'css-loader', 'sass-loader' ],
      },
    ],
  },

  devServer: {
    publicPath: '/dist/',
  },

  devtool: 'eval-source-map', //'cheap-module-source-map',

  plugins: [htmlPlugin]
};
