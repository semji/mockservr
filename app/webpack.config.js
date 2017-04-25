const webpack = require('webpack');
const path = require('path');

const config = {
    entry: './frontend/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    module: {
        rules: [
            {test: /\.vue$/, use: 'vue-loader'},
            {test: /\.(js|jsx)$/, use: 'babel-loader', exclude: /node_modules/}
        ]
    }
};

module.exports = config;