const path = require('path');
const createVueLoaderOptions = require('./vue-loader.config');

const isDev = process.env.NODE_ENV === "development";

const config = {
    target: 'web',
    entry: path.resolve(__dirname, "../client/index.js"),
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: 'bundle.[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: createVueLoaderOptions(isDev)
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
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
                            name: 'resources/[path][name]-[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    }
}

module.exports = config
