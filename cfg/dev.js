'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let API = JSON.stringify(' http://ts.baotianqi.cn/selfTemp')
let wxpayAPI = JSON.stringify('http://pay.baotianqi.cn/wxpay')
let toWxpay = JSON.stringify('http://m.baotianqi.cn/self/toWxpay')
baseConfig.devServer.proxy = {
    '/selfTemp': {
        target: API,
        secure: false
    },
    '/wxpay': {
        target: wxpayAPI,
        secure: false
    },
    '/toWxpay': {
        target: toWxpay,
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
            toWxpay: toWxpay
        })
    ]),
    module: defaultSettings.getDefaultModules()
});

module.exports = config;
