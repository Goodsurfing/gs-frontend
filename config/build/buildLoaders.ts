import webpack from "webpack";
import { BuildOptions } from "./types/config";
import { buildCssLoader } from "./loaders/buildCssLoader";
import { buildJsLoader } from "./loaders/buildJsLoader";

export function buildLoaders(options: BuildOptions): webpack.RuleSetRule[] {
    const { isDev } = options;

    const jsLoader = buildJsLoader(options);

    const cssLoader = buildCssLoader(isDev);

    const svgLoader: webpack.RuleSetRule = {
        test: /\.svg$/,
        type: "asset/resource",
        generator: {
            filename: "./icons/[contenthash].[ext]",
        },
    };

    const imgLoader: webpack.RuleSetRule = {
        test: /\.(png|jpg|jpeg)$/i,
        type: "asset/resource",
        generator: {
            filename: "./img/[contenthash].[ext]",
        },
    };

    return [jsLoader, ...cssLoader, svgLoader, imgLoader];
}
