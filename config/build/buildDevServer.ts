import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { BuildOptions } from "./types/config";
import fs from 'fs';
import path from 'path';

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
    return {
        port: options.port,
        open: true,
        historyApiFallback: true,
        hot: true,
        https: {
            key: fs.readFileSync('localhost+1-key.pem'),
            cert: fs.readFileSync('localhost+1.pem'),
            ca: fs.readFileSync(path.resolve(__dirname, 'C:/Users/admin/AppData/Local/mkcert/rootCA.pem')),
        }
    };
}
