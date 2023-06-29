import { Configuration as WebpackConfiguration } from "webpack";

import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import { BuildOptions } from "./types/config";
import { buildPlugins } from "./buildPlugins";
import { buildLoaders } from "./buildLoaders";
import { buildResolvers } from "./buildResolvers";
import { buildDevServer } from "./buildDevServer";

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

export function buildWebpackConfig(options: BuildOptions): Configuration {
    const { paths, mode, isDev } = options;

    return {
        mode,
        entry: paths.entry,
        output: {
            filename: "[name].[contenthash].js",
            path: paths.build,
            clean: true,
            assetModuleFilename: "[hash][ext][query]",
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options),
        },
        watchOptions: {
            ignored: /node_modules/,
        },
        resolve: buildResolvers(options),
        devtool: isDev ? "inline-source-map" : undefined,
        devServer: isDev ? buildDevServer(options) : undefined,
    };
}
