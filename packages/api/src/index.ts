import createClient, { type Middleware } from "openapi-fetch";

import type { paths } from "./schema";

export type { components, paths } from "./schema";

export interface ApiClientOptions {
    /** Адрес API без /api/v1, например https://api.goodsurfing.org */
    baseUrl: string;
    /** JWT пользователя; без него — гостевые запросы */
    token?: string;
    /** Язык для бэкенда (заголовок Accept-Language) */
    locale?: string;
}

/**
 * Типизированный клиент gs-backend: пути, параметры и ответы берутся из
 * OpenAPI. Изменение API без правки клиента ломает сборку, а не прод.
 */
export const createApiClient = ({ baseUrl, token, locale }: ApiClientOptions) => {
    const client = createClient<paths>({ baseUrl });
    const headers: Middleware = {
        onRequest({ request }) {
            if (token) request.headers.set("Authorization", `Bearer ${token}`);
            if (locale) request.headers.set("Accept-Language", locale);
            return request;
        },
    };
    client.use(headers);
    return client;
};

export type ApiClient = ReturnType<typeof createApiClient>;
