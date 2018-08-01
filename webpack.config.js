
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');
const ROOT_PATH = process.cwd();
const SRC_PATH = path.join(ROOT_PATH, 'src');
const DIST_PATH = path.join(ROOT_PATH, 'dist');

module.exports = {
    entry: {
        xformula: "./src/index.ts"
    },
    output: {
        path: DIST_PATH,
        filename: "[name].js"
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                /*exclude: path.resolve(__dirname, 'node_modules'), //编译时，不需要编译哪些文件*/
                /*include: path.resolve(__dirname, 'src'),//在config中查看 编译时，需要包含哪些文件*/
                query: {
                    presets: ['latest'] //按照最新的ES6语法规则去转换
                }
            }
        ]
    }
};