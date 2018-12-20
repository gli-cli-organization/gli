const path = require('path');
const webpack = require('webpack');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

webpackConfig = {
    entry: {
        app: ['babel-polyfill', './src/main.js']
    },
    externals: {
        echarts: {
            amd: 'echarts',
            root: 'Echarts',
            commonjs: 'echarts',
            commonjs2: 'echarts'
        }
    },
    output: {
        libraryTarget: 'umd',
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            {{#if_eq build "standalone"}}
            'vue$': 'vue/dist/vue.esm.js',
            {{/if_eq}}
            '@': resolve('src'),
        }
    },
    module: {
        rules: [
          {{#lint}}
          {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          include: [resolve('src'), resolve('test')],
          options: {
          	formatter: require('eslint-friendly-formatter')
          }
          },
          {{/lint}}
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: []
};

if (!process.env.npm_config_nodll) {
    webpackConfig.plugins.push(new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('../public/lib-mainfest.json')
    }));
}

module.exports = webpackConfig;
