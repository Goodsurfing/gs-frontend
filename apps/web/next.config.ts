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
    experimental: {
        // Страница 404 для неизвестных адресов на уровне маршрутизации
        // (app/global-not-found.tsx): не вкладывается в страницы и не делает их динамическими
        globalNotFound: true,
    },
    // Карта сайта собирается бэкендом из базы (GS-213); раньше её проксировал nginx старого SPA
    async rewrites() {
        const api = (process.env.NEXT_PUBLIC_API_URL || "https://api-staging.goodsurfing.org").replace(/\/$/, "");
        return {
            beforeFiles: [
                { source: "/sitemap.xml", destination: `${api}/sitemap.xml` },
                { source: "/sitemap-:name([a-z]+).xml", destination: `${api}/sitemap-:name.xml` },
            ],
            afterFiles: [],
            fallback: [],
        };
    },
    // Статика из public/web: по умолчанию Next отдаёт её с max-age=0, и браузер перед каждой страницей
    // переспрашивает сервер про шрифты и картинки — шрифт приходил позже текста, текст перескакивал.
    // Шрифты не меняются (новый шрифт — новое имя файла) — на год; картинки и значки могут смениться под
    // тем же именем — сутки и ещё неделю из кэша, пока проверяется свежая. push-sw.js и manifest не трогаем:
    // обработчик уведомлений должен обновляться сразу.
    async headers() {
        return [
            { source: "/web/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
            { source: "/web/:dir(images|icons)/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
        ];
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "storage.yandexcloud.net" },
        ],
    },
};

export default config;
