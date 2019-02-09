var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30,
      maxSize: 0,
      minChunks: 1,
      cacheGroups: {
        commons: {
          test: /shared/,
          name: 'shared',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$' // embed all javascript and css inline
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
  ]
};
