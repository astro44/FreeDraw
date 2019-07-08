const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const glob = require("glob")
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    "wb5.js": glob.sync("./js/*.?(js)").map(f => path.resolve(__dirname, f)),
  },
  output: {
    path: path.join(__dirname, './public/js'),
    // publicPath: '/public/js/',
    filename: "wb5.min.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src', 'wrapper.js')
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
    new MinifyPlugin()
  ]
};