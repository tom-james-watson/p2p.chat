const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

require('es6-promise').polyfill()

const env = process.env.NODE_ENV || 'development'

console.info(`Building bundle for ${env}`)

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
  entry: './src/main.js',

  output: {
    path: __dirname,
    filename: 'dist/js/app.js'
  },

  plugins: [
    // Specify the resulting CSS filename
    new ExtractTextPlugin('dist/css/app.css'),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      }
    }),

  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        })
      }
    ]
  },

  stats: {
    // Colored output
    colors: true
  },

  // Create Sourcemaps for the bundle
  devtool: 'source-map'
}

if (env === 'production') {
  config.plugins.push(new UglifyJsPlugin())
}

module.exports = config
