// Work around for https://github.com/angular/angular-cli/issues/7200

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    // This is our Express server for Dynamic universal
    server: './server.ts',
    // This is an example of Static prerendering (generative)
    prerender: './prerender.ts'
  },
  target: 'node',
  resolve: { extensions: ['.ts', '.js'] },
  // Dont include modules with ES6 module import
  externals: [nodeExternals({
	whitelist: [
	  /^ngx-markdown/,
	  /^ngx-bootstrap/,
	  /^ngx-page-scroll/,
	  /^ng2-truncate/,
	  /^@agm/,
	  /^firebase/,
	  /^angularfire2/,
	  /^videogular2/,
	  /^ngx-infinite-scroll/
	]
  })],
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
	)
  ]
}
  