const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

dllConfig = {
    entry: {
        lib: [
            'axios',
            'babel-polyfill',
            'babel-runtime/core-js/promise.js',
            'babel-runtime/helpers/extends.js',
            'babel-runtime/helpers/typeof.js',
            'buffer',
            'element-ui',
            'js-cookie',
            'nprogress',
            'qs',
            'vue/dist/vue.esm.js',
            'vue-router',
            'vuex',
            'element-ui/lib/theme-chalk/index.css',
            'normalize.css/normalize.css',
            'nprogress/nprogress.css'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: '[name].[chunkhash:7].js',
        library: '[name]_library'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.DllPlugin({
            path: path.resolve(__dirname, '../public/[name]-mainfest.json'),
            name: '[name]_library',
            context: __dirname // 执行的上下文环境，对之后DllReferencePlugin有用
        }),
        new ExtractTextPlugin('[name].[contenthash:7].css'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new AssetsPlugin({
            filename: 'bundle-config.json',
            path: './public'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    }
};

if (process.env.npm_config_report) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    dllConfig.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        generateStatsFile: true,
        statsFilename: 'stats.json'
    }));
}

module.exports = dllConfig;