import { createApiClient } from "@goodsurfing/api";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api-staging.goodsurfing.org";

/**
 * Клиент API в браузере: запросы несут cookie входа (GS-218). token — для
 * переходного периода, когда вход есть только в старом SPA (localStorage).
 */
export const browserApi = (token?: string) => createApiClient({ baseUrl: API_URL, credentials: "include", token });
