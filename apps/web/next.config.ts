import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
    // Образ для стенда: минимальный сервер без node_modules целиком
    output: "standalone",
    // Корень трассировки — корень репозитория (packages/api вне apps/web);
    // одинаковая раскладка standalone локально и в Docker: apps/web/server.js
    outputFileTracingRoot: path.join(__dirname, "../.."),
    reactStrictMode: true,
    poweredByHeader: false,
    // Пакеты монорепо — исходники TypeScript, их собирает Next
    transpilePackages: ["@goodsurfing/api"],
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "storage.yandexcloud.net" },
        ],
    },
};

export default config;
