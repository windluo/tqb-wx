'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
    entry: defaultSettings.entries('dev'),
    cache: true,
    devtool: 'cheap-module-eval-source-map',
    plugins: baseConfig.plugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new BowerWebpackPlugin({
            searchResolveModulesDirectories: false
        }),
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': '"production"'
            API: JSON.stringify('http://testserver.baotianqi.cn/selfTemp/')
        })
    ]),
    module: defaultSettings.getDefaultModules()
});

module.exports = config;
