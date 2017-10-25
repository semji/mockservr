let path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

if (process.env.NODE_ENV === 'development') {
    scssLoaders = [
        {loader: "style-loader"},
        {loader: "css-loader", options: {sourceMap: true}},
        {loader: "sass-loader", options: {outFile: "app.css", sourceMap: true}}
    ];
} else {
    scssLoaders = ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {minimize: true}
        },
            {loader: "sass-loader", options: {outFile: "app.css"}}
            ]
    });
}

module.exports = {
    entry: {
        app: [
            './src/app.js',
            './styles/global.scss'
        ],
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'css': 'style-loader!css-loader',
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.scss$/,
                use: scssLoaders,
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new ExtractTextPlugin("app.css"),
    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            },
            API_URL: '"/api/"'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
} else {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"developement"'
            },
            API_URL: process.env.API_URL ? '"' + process.env.API_URL + '"' : '"http://localhost:8045/api/"'
        }),
    ])
}
