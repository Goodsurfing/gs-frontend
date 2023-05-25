import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export function buildCssLoader(isDev: boolean) {
    return {
        test: /\.s[ac]ss$/i,
        use: [
            // dont compile css if dev
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,

            // setup css modules
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        localIdentName: isDev
                            ? '[path][name]__[local]--[hash:base64:5]'
                            : '[hash:base64:8]',
                        auto: (resPath: string) => resPath.includes('.module.'),
                    },
                },
            },
            'sass-loader',
        ],
    };
}