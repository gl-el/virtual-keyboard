const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'web',
  entry: path.resolve(__dirname, 'src', 'script.js'),
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'script.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: 'src/favicon.ico',
      inject: 'body',
      template: path.resolve(__dirname, 'src', 'index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ico$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext][query]'
        },
      },
    ],
  },
};
