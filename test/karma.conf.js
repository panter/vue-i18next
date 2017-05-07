const webpack = require('webpack');
const path = require('path');
const pkg = require('../package.json');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const webpackConfig = {
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('test')],
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
      __VERSION__: `"${pkg.version}"`,
    }),
  ],
  devtool: '#inline-source-map',
};

module.exports = (config) => {
  config.set({
    // frameworks: ['mocha', 'phantomjs-shim', 'intl-shim'],
    frameworks: ['mocha', 'phantomjs-shim', 'sinon-chai'],
    browsers: ['PhantomJS'],
    client: {
      chai: {
        includeStack: true,
      },
    },
    // browsers: ['Chrome', 'Firefox', 'Safari'],
    reporters: ['progress', 'coverage'],
    singleRun: true,
    files: [
      './unit/index.js',
    ],
    preprocessors: {
      './unit/index.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
    },
    plugins: [
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-shim',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher',
      'karma-sinon-chai',
    ],
    coverageReporter: {
      dir: './coverage',
      reporters: [
          { type: 'lcov', subdir: '.' },
          { type: 'text-summary' },
      ],
    },
  });
};
