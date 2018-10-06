const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //i

module.exports = {
  mode: 'production',
  entry: [
    './index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      minify: true
    })
  ]
};