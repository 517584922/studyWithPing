const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
//  非js代码打包静态资源文件
const ExtractPlugin = require('extract-text-webpack-plugin');

const isDev = process.env.NODE_ENV === "development";

const config = {
    target: 'web',
    entry: path.join(__dirname, "../client/index.js"),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, "dist")
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new VueLoaderPlugin(),
        new HTMLPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: '[name]-limit.[ext]'
                        }
                    }
                ]
            }
        ]
    }
}

if (isDev) {
    config.module.rules.push(
        {
            test: /\.styl$/,
            use: [
                'style-loader',
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
    )
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 1299,
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        hot: true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    config.entry = {
        app: path.join(__dirname, "client/index.js"),
        vendor: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push(
        {
            test: /\.styl$/,
            use: ExtractPlugin.extract({
                fallback: 'style-loader',
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
        },
    )
    config.optimization = {
        splitChunks: {
            name: "vendor",
            chunks: "all"
        }
    }
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.RuntimeChunkPlugin({
            name: "runtime"
        }),
    )
}

module.exports = config
