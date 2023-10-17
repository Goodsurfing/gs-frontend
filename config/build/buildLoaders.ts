import webpack from "webpack";
import { BuildOptions } from "./types/config";
import { buildCssLoader } from "./loaders/buildCssLoader";
import { buildBabelLoader } from "./loaders/buildBabelLoader";

export function buildLoaders(options: BuildOptions): webpack.RuleSetRule[] {
    const { isDev } = options;

    const babelLoader = buildBabelLoader(options);

    const codeBabelLoader = buildBabelLoader({ ...options, isTsx: false });
    const tsxCodeBabelLoader = buildBabelLoader({ ...options, isTsx: true });

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

    return [babelLoader, codeBabelLoader, tsxCodeBabelLoader, ...cssLoader, svgLoader, imgLoader];
}
