const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const Dotenv = require("dotenv-webpack");

/** @type {import('webpack').Configuration} */
module.exports = {
    entry: "./src/index",
    target: "web",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].[contenthash].js",
        chunkFilename: "js/[name].[contenthash].js",
    },
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@components": path.resolve(__dirname, "src/components"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@store": path.resolve(__dirname, "src/store"),
            "@types": path.resolve(__dirname, "src/types"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@constants": path.resolve(__dirname, "src/constants"),
        },
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    devtool: "source-map",
    devServer: {
        contentBase: "./dist",
        port: 3000,
        hot: true,
        disableHostCheck: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "images/[hash]-[name].[ext]",
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: false,
            template: "./public/index.html",
        }),
        new ForkTsCheckerWebpackPlugin(),
        new ReactRefreshWebpackPlugin(),
        new Dotenv(),
    ],
};
