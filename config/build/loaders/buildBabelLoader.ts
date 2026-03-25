import { BuildOptions } from "../types/config";

interface BuildBabelLoaderProps extends BuildOptions {
    isTsx?: boolean;
}

export function buildBabelLoader({ isDev, isTsx }: BuildBabelLoaderProps) {
    return {
        test: isTsx ? /\.(jsx|tsx)$/ : /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader",
            options: {
                cacheDirectory: true,
                presets: ["@babel/preset-env"],
                plugins: [
                    isDev && [
                        "i18next-extract",
                        {
                            locales: ["ru", "en"],
                            keyAsDefaultValue: true,
                        },
                    ],
                    [
                        "@babel/plugin-transform-typescript",
                        {
                            isTSX: isTsx,
                        }
                    ],
                    [
                        "@babel/plugin-transform-runtime"
                    ],
                    isDev && require.resolve("react-refresh/babel"),
                ].filter(Boolean),
            },
        },
    };
}
