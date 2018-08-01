
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        vendor: ["react", "react-dom", "react-router-dom",  "mobx", "mobx-react"],
        app: "./demo/index.tsx"
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].js",
        chunkFilename: "[name].js"
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
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            //处理SCSS
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
        ]
    },
    plugins: [
        //用来处理分包的问题
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor"]
        }),
        //把css都放到单独的文件里
        new ExtractTextPlugin("styles.css"),
        //用来把编译好的脚本插入到index.html中
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './index.html',
            inject: true
        })
    ],
    //配置服务
    devServer: {
        hot: true,
        inline: true,
        port: 8092,
    }
};