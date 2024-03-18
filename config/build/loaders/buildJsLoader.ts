import type { BuildOptions } from "../types/config";

export function buildJsLoader({ isDev }: { isDev: boolean }) {
    return {
        test: /.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
            loader: "swc-loader",
            options: {
                module: {
                    type: 'nodenext',
                },
                minify: !isDev,
                jsc: {
                    minify: {
                        compress: true,
                        mangle: true,
                        format: {
                            asciiOnly: true,
                        },
                    },
                    // TODO: Split builds for new and old browsers and add 2021's build
                    target: 'es2015',
                    parser: {
                        syntax: 'typescript',
                        tsx: true,
                    },
                    transform: {
                        react: {
                            runtime: 'automatic',
                        },
                    },
                },
            },
        },
    };
}
