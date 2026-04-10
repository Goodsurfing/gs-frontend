import webpack from "webpack";
import { BuildOptions } from "./types/config";

export const buildOptimizations = (options: BuildOptions) => {
    const {} = options;
    return {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 25,
            maxAsyncRequests: 30,
            minSize: 20000,
            cacheGroups: {
                // Core React libs — always needed, cached long-term
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                    name: 'npm.react',
                    priority: 40,
                    reuseExistingChunk: true,
                },
                // Router — needed for navigation
                router: {
                    test: /[\\/]node_modules[\\/](react-router|react-router-dom|@remix-run)[\\/]/,
                    name: 'npm.router',
                    priority: 35,
                    reuseExistingChunk: true,
                },
                // MUI — large UI framework
                mui: {
                    test: /[\\/]node_modules[\\/](@mui|@emotion|@popperjs)[\\/]/,
                    name: 'npm.mui',
                    priority: 30,
                    reuseExistingChunk: true,
                },
                // Rich text editor — only needed on editor pages
                editor: {
                    test: /[\\/]node_modules[\\/](@tiptap|prosemirror|linkifyjs)[\\/]/,
                    name: 'npm.editor',
                    chunks: 'async',
                    priority: 25,
                    reuseExistingChunk: true,
                },
                // Emoji picker — only needed in chat
                emoji: {
                    test: /[\\/]node_modules[\\/](emoji-picker-react)[\\/]/,
                    name: 'npm.emoji',
                    chunks: 'async',
                    priority: 25,
                    reuseExistingChunk: true,
                },
                // Remaining vendor modules
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module: any) {
                        const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                        if (!match) return 'npm.misc';
                        const packageName = match[1];
                        return `npm.${packageName.replace('@', '')}`;
                    },
                    priority: 10,
                    reuseExistingChunk: true,
                },
            },
        },
    };
} 