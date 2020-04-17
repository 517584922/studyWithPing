const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
//  非js代码打包静态资源文件
const ExtractPlugin = require('extract-text-webpack-plugin');
const baseConfig = require('./webpack.config.base');

const isDev = process.env.NODE_ENV === "development";

const defaultPluins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev ? '"development"' : '"production"'
        }
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin()
]

const devServer = {
    port: 3000,
    host: '0.0.0.0',
    overlay: {
        errors: true
    },
    hot: true
}

let config;

if (isDev) {
    config = merge(baseConfig, {
        module: {
            rules: [
                {
                    test: /\.styl$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        'stylus-loader'
                    ],
                },
            ]
        },
        devServer,
        plugins: defaultPluins.concat([
            new webpack.HotModuleReplacementPlugin()
        ])
    })
} else {
    config = merge(baseConfig, {
        entry: {
            app: path.join(__dirname, "../client/index.js")
        },
        output: {
            filename: '[name].[chunkhash:8].js'
        },
        module: {
            rules: [
                {
                    test: /\.styl$/,
                    use: ExtractPlugin.extract({
                        fallback: 'vue-style-loader',
                        use: [
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    sourceMap: true
                                }
                            },
                            'stylus-loader'
                        ],
                    })
                }
            ]
        },
        plugins: defaultPluins.concat([
            new ExtractPlugin('styles.[contentHash:8].css'),
            new webpack.optimize.RuntimeChunkPlugin({
                name: "runtime"
            })
        ]),
        optimization: {
            splitChunks: {
                chunks: "all"
            },
            runtimeChunk: true
        }
    })
}

module.exports = config
