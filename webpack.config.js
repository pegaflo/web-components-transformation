var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  target: "node",
  entry: [
    './scripts/index'
  ],
  output: {
      path: "/dist",
      filename: './bundle.js',
      sourceMapFilename: './bundle.map'
  },
  devtool: 'source-map',
  resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.json', '.css', '.html']
  },
  plugins: [
  //	new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor/vendor.bundle.js")
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'scripts')
      },
      {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel'
      },
      { test: /\.html$/,  loader: 'html-loader' },
      { test: /\.(png|jpg|jpeg|gif|woff|svg|eot|ttf|woff2)$/, loader: 'url-loader' },
      { test: /\.css$/,  loader: 'css-loader' },
      { test: /\.scss$/, loaders: ["css", "sass"] },
      { test: /\.json$/,  loader: 'json-loader' },
  ]
  }

};
