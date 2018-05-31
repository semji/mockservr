let path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

if (process.env.NODE_ENV === 'development') {
  scssLoaders = [
    'style-loader',
    { loader: 'css-loader', options: { sourceMap: true } },
    {
      loader: 'sass-loader',
      options: { sourceMap: true },
    },
  ];
} else {
  scssLoaders = [
    'style-loader',
    { loader: 'css-loader', options: { minimize: true } },
    'sass-loader',
  ];
}

const config = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, 'src/main.js'),
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.scss$/,
        use: scssLoaders,
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, '../dist')]),
    new webpack.NamedModulesPlugin(),
    new VueLoaderPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, '../'),
    filename: 'dist/[name].js',
    sourceMapFilename: 'dist/[name].map',
    chunkFilename: 'dist/[id].chunk.js',
    pathinfo: true,
  },
  performance: {
    hints: false,
  },
  devServer: {
    overlay: true,
    compress: true,
    historyApiFallback: true,
    noInfo: true,
    hot: true,
    port: 8086,
    host: '0.0.0.0',
    contentBase: path.resolve(__dirname, '../'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'cheap-module-eval-source-map';
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"developement"',
      },
      API_URL: process.env.API_URL
        ? '"' + process.env.API_URL + '"'
        : '"http://localhost:8045/api/"',
    })
  );
} else {
  config.plugins.push(
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: true,
        mangle: false,
        output: {
          comments: false,
          ascii_only: true,
        },
      },
    })
  );
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
      API_URL: '"/api/"',
    })
  );
}

module.exports = config;
