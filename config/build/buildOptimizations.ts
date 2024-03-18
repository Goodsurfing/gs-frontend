import TerserPlugin from 'terser-webpack-plugin';

export const buildOptimizations = () => {
    return {
        runtimeChunk: 'single',
        chunkIds: 'deterministic',
        moduleIds: 'deterministic',
        minimizer: [new TerserPlugin({
            minify: TerserPlugin.swcMinify,
            parallel: true,
        })],
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            cacheGroups: {
                bundle: {
                    chunks: 'all',
                    automaticNameDelimiter: '~',
                    minChunks: 2,
                },
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true,
                },
            },
        },
    };
} 