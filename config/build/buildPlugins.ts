import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack, { WebpackError } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CircularDependencyPlugin from "circular-dependency-plugin";
import Dotenv from "dotenv-webpack";
import { BuildOptions } from "./types/config";

const MAX_CYCLES = 5;
let numCyclesDetected = 0;

export function buildPlugins({
    paths, analyze, isDev, apiUrl, project,
}: BuildOptions): webpack.WebpackPluginInstance[] {
    const plugins = [
        new HtmlWebpackPlugin({
            template: paths.html,
        }),
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
            chunkFilename: "css/[name].[contenthash:8].css",
        }),
        new webpack.DefinePlugin({
            __IS_DEV__: JSON.stringify(isDev),
            __API__: JSON.stringify(apiUrl),
            __PROJECT__: JSON.stringify(project),
        }),
        new Dotenv(),
        new webpack.ids.HashedModuleIdsPlugin(),
    ];

    if (isDev) {
        plugins.push(new ReactRefreshWebpackPlugin());
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new CircularDependencyPlugin({
            onStart({ compilation }) {
                numCyclesDetected = 0;
            },
            onDetected({ module: webpackModuleRecord, paths, compilation }) {
                numCyclesDetected++;
                compilation.warnings.push(new WebpackError(paths.join(" -> ")));
            },
            onEnd({ compilation }) {
                if (numCyclesDetected > MAX_CYCLES) {
                    compilation.errors.push(new WebpackError(
                        `Detected ${numCyclesDetected} cycles which exceeds configured limit of ${MAX_CYCLES}`,
                    ));
                }
            },
        }));
    }

    if (analyze) {
        plugins.push(new BundleAnalyzerPlugin({
            openAnalyzer: true,
            analyzerPort: 3001,
        }));
    }

    return plugins;
}
