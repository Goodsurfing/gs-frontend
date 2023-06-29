import path from "path";
import { ResolveOptions } from "webpack";
import { BuildOptions } from "./types/config";

export function buildResolvers(options: BuildOptions): ResolveOptions {
    const { paths } = options;
    return {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss"],
        preferAbsolute: true,
        modules: [paths.src, "node_modules"],
        mainFiles: ["index"],
        alias: {
            "@": path.resolve(__dirname, "..", "..", "src"),
            "@utils": path.resolve(__dirname, "..", "..", "src/shared/utils"),
            "@components": path.resolve(__dirname, "..", "..", "src/components"),
            "@pages": path.resolve(__dirname, "..", "..", "src/pages"),
            "@store": path.resolve(__dirname, "..", "..", "src/store"),
            "@types": path.resolve(__dirname, "..", "..", "src/types"),
            "@assets": path.resolve(__dirname, "..", "..", "src/shared/assets"),
            "@shared": path.resolve(__dirname, "..", "..", "src/shared"),
            "@constants": path.resolve(__dirname, "..", "..", "src/shared/constants"),
        },
    };
}
