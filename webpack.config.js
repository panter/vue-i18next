const path = require('path');
const webpack = require('webpack');
const config = require('./package.json');

module.exports = {
  mode: 'development',
  entry: './src/i18n.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.common.js',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: `"${config.version}"`,
    }),
  ],
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/examples/basic/index.html' },
        { from: 'app.js', to: '/examples/basic/app.js' },
      ],
    },
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  devtool: '#eval-source-map',
};
