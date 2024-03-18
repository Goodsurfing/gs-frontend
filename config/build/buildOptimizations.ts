import TerserPlugin from 'terser-webpack-plugin';

export const buildOptimizations = () => {
    return {
        runtimeChunk: 'single',
        chunkIds: 'deterministic',
        moduleIds: 'deterministic',
        minimizer: [new TerserPlugin({
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
                    test: /[\\/]node_modules[\\/]/,
                    name(module: any) {
                    // get the name. E.g. node_modules/packageName/not/this/part.js
                    // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                    // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
        },
    };
} 