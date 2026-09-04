import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import type {
    BaseQueryApi, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta,
} from "@reduxjs/toolkit/dist/query";
import qs from "qs";
import { RootState } from "@/store/store";

import { API_ADMIN_BASE_URL, API_BASE_URL, API_BASE_URL_ABSOLUTE } from "@/shared/constants/api";
import {
    REFRESH_TOKEN_LOCALSTORAGE_KEY, TOKEN_LOCALSTORAGE_KEY,
} from "@/shared/constants/localstorage";
// Прямой импорт файла слайса, а не barrel @/entities/User — тот
// реэкспортирует useGetUserHostInfo из entities/Profile, которое тянет
// entities/Host, чей api-слайс сам использует baseQuery отсюда же:
// импорт через barrel дал бы циклический baseQuery → entities/User →
// entities/Host → baseQuery.
import { userActions } from "@/entities/User/model/slice/userSlice";

const readToken = (state: RootState) => state.user.authData?.token
    || JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null")
    || JSON.parse(sessionStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null");

const readRefreshToken = (state: RootState) => state.user.authData?.refreshToken
    || JSON.parse(localStorage.getItem(REFRESH_TOKEN_LOCALSTORAGE_KEY) || "null");

const prepareAuthHeaders = (headers: Headers, getState: () => unknown) => {
    const token = readToken(getState() as RootState);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
};

// GS-136: single-flight — несколько параллельных запросов, поймавших 401
// одновременно (протухший access-токен), не должны запускать N параллельных
// обновлений. refresh_token одноразовый (single_use на бэке): второй
// параллельный вызов получил бы уже использованный токен и упал бы, даже
// если первый вызов только что успешно обновился. Все, кто ловит 401, пока
// обновление уже идёт, ждут один и тот же промис.
let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(api: BaseQueryApi): Promise<boolean> {
    const state = api.getState() as RootState;
    const refreshToken = readRefreshToken(state);

    if (!refreshToken) return false;

    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}token/refresh`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });

                if (!response.ok) return false;

                const data = await response.json();
                if (!data.token || !data.refresh_token) return false;

                api.dispatch(userActions.updateTokensAfterRefresh({
                    token: data.token,
                    mercureToken: data.mercureToken ?? state.user.authData?.mercureToken ?? "",
                    refreshToken: data.refresh_token,
                }));
                return true;
            } catch {
                return false;
            } finally {
                refreshPromise = null;
            }
        })();
    }

    return refreshPromise;
}

// Бэкенд (firewall `api`, jwt: ~ на весь /api/v1) валит запросы 401-м при
// ЛЮБОМ невалидном/протухшем Authorization-заголовке — даже на роуты с
// PUBLIC_ACCESS вроде /api/v1/vacancy. prepareHeaders ниже слепо цепляет
// токен из localStorage/redux к каждому запросу без проверки срока
// годности, так что протухший токен ломал не только "мои" данные, а вообще
// всю публичную выдачу вакансий (0 вариантов на /offers-map — живой репорт
// пользователя со скриншотом, 2026-09-04).
//
// На 401 сначала пробуем тихо обновить сессию через refresh_token
// (GS-136) — если получилось, повторяем запрос уже со свежим токеном и
// пользователь ничего не замечает. Если обновить нечем/не вышло (сессия
// реально истекла или это был гость с мусорным токеном) — чистим
// авторизацию и повторяем запрос анонимно, как и раньше.
type ReauthBaseQuery<Args> = BaseQueryFn<
Args, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta
>;

export function withReauthOn401<Args = string | FetchArgs>(
    query: ReauthBaseQuery<Args>,
): ReauthBaseQuery<Args> {
    return async function reauthOn401(args, api, extraOptions) {
        let result = await query(args, api, extraOptions);

        if (result.error?.status === 401) {
            const refreshed = await refreshAccessToken(api);

            if (!refreshed) {
                api.dispatch(userActions.logout());
            }

            result = await query(args, api, extraOptions);
        }

        return result;
    };
}

const baseQueryRaw = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        prepareAuthHeaders(headers, getState);
        headers.set("Content-Type", "application/json");
        headers.set("accept", "application/json");
        return headers;
    },
});

export const baseQuery = withReauthOn401(baseQueryRaw);

const baseQueryAcceptJsonRaw = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        prepareAuthHeaders(headers, getState);
        // headers.set("Content-Type", "application/merge-patch+json");
        headers.set("accept", "application/json");
        return headers;
    },
    paramsSerializer: (params) => qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
    }),
});

export const baseQueryAcceptJson = withReauthOn401(baseQueryAcceptJsonRaw);

const baseQueryV3Raw = fetchBaseQuery({
    baseUrl: API_BASE_URL_ABSOLUTE,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        prepareAuthHeaders(headers, getState);
        headers.set("accept", "application/json");
        return headers;
    },
    paramsSerializer: (params) => qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
    }),
});

export const baseQueryV3 = withReauthOn401(baseQueryV3Raw);

const baseAdminQueryAcceptJsonRaw = fetchBaseQuery({
    baseUrl: API_ADMIN_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        prepareAuthHeaders(headers, getState);
        headers.set("accept", "application/json");
        return headers;
    },
    paramsSerializer: (params) => qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
    }),
});

export const baseAdminQueryAcceptJson = withReauthOn401(baseAdminQueryAcceptJsonRaw);
