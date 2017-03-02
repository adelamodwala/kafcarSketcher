var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: ['whatwg-fetch', "./app.js"],
    output: {
        filename: "index_bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['react', 'es2015']
            }
        }]
    },
    resolve: {
        extensions: ['.js', '.es6']
    },
    plugins: [
      new HtmlWebpackPlugin({
          title: 'Custom template',
          template: './_index.html'
      })
    ],
    watch: true
}
