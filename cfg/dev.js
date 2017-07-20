'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let API = JSON.stringify('http://server.baotianqi.cn/selfTemp')
let wxpayAPI = JSON.stringify('http://pay.baotianqi.cn/wxpay')
let wx = JSON.stringify('http://m.baotianqi.cn/wx')
baseConfig.devServer.proxy = {
    '/selfTemp': {
        target: API,
        secure: false
    },
    '/wxpay': {
        target: wxpayAPI,
        secure: false
    },
    '/wx': {
        target: wx,
        secure: false
    }
}

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
            API: API,
            wxpayAPI: wxpayAPI,
            wx: wx
        })
    ]),
    module: defaultSettings.getDefaultModules()
});

module.exports = config;
