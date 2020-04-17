const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');


const defaultPluins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV:  '"development"'
        }
    }),
    new VueLoaderPlugin(),
    new HTMLPlugin({
        template: path.join(__dirname,'template.html')
    })
]

const devServer = {
    port: 2121,
    host: '0.0.0.0',
    overlay: {
        errors: true
    },
    hot: true
}

 let config = merge(baseConfig, {
    entry: path.join(__dirname,'../practice/index.js'),
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
    resolve: {
        alias: {
            'vue': path.join(__dirname,'../node_modules/vue/dist/vue.esm.js')
        }
    },
    plugins: defaultPluins.concat([
        new webpack.HotModuleReplacementPlugin()
    ])
})

module.exports = config
