import webpack from 'webpack';
import ReactRefreshTypeScipt from 'react-refresh-typescript';

import { BuildOptions } from './types/config';
import { buildCssLoader } from './loaders/buildCssLoaders';

export function buildLoaders(options: BuildOptions): webpack.RuleSetRule[] {
    const { isDev } = options;

    const typescriptLoader: webpack.RuleSetRule = {
        test: /\.tsx?$/,
        use: [
            {
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: () => ({
                        before: [isDev && ReactRefreshTypeScipt()].filter(Boolean),
                    }),
                    transpileOnly: isDev,
                },
            },
        ],
        exclude: /node_modules/,
    };

    const babelLoader = {
        test: /\.(js|tsx|ts|jsx)$/,
        exclude: '/node_modules/',
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: [
                    [
                        'i18next-extract',
                        {
                            locales: ['ru', 'en'],
                            keyAsDefaultValue: true,
                        },
                    ],
                ],
            },
        },
    };

    const cssLoader = buildCssLoader(isDev);

    const svgLoader: webpack.RuleSetRule = {
        test: /\.svg$/,
        type: 'asset/resource',
        generator: {
            filename: './icons/[contenthash].[ext]',
        },
    };

    const imgLoader: webpack.RuleSetRule = {
        test: /\.(png|jpg)$/i,
        type: 'asset/resource',
        generator: {
            filename: './img/[contenthash].[ext]',
        },
    };

    return [babelLoader, typescriptLoader, cssLoader, svgLoader, imgLoader];
}
