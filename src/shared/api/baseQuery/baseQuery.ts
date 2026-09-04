import { BaseQueryFn, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import type {
    FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta,
} from "@reduxjs/toolkit/dist/query";
import qs from "qs";
import { RootState } from "@/store/store";

import { API_ADMIN_BASE_URL, API_BASE_URL, API_BASE_URL_ABSOLUTE } from "@/shared/constants/api";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
// Прямой импорт файла слайса, а не barrel @/entities/User — тот
// реэкспортирует useGetUserHostInfo из entities/Profile, которое тянет
// entities/Host, чей api-слайс сам использует baseQuery отсюда же:
// импорт через barrel дал бы циклический baseQuery → entities/User →
// entities/Host → baseQuery.
import { userActions } from "@/entities/User/model/slice/userSlice";

// Бэкенд (firewall `api`, jwt: ~ на весь /api/v1) валит запросы 401-м при
// ЛЮБОМ невалидном/протухшем Authorization-заголовке — даже на роуты с
// PUBLIC_ACCESS вроде /api/v1/vacancy. prepareHeaders ниже слепо цепляет
// токен из localStorage/redux к каждому запросу без проверки срока
// годности, так что протухший токен ломал не только "мои" данные, а вообще
// всю публичную выдачу вакансий (0 вариантов на /offers-map — живой репорт
// пользователя со скриншотом, 2026-09-04). На 401 чистим стухшую авторизацию
// и повторяем тот же запрос один раз уже анонимно.
type ReauthBaseQuery<Args> = BaseQueryFn<
Args, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta
>;

export function withReauthOn401<Args = string | FetchArgs>(
    query: ReauthBaseQuery<Args>,
): ReauthBaseQuery<Args> {
    return async function reauthOn401(args, api, extraOptions) {
        let result = await query(args, api, extraOptions);

        if (result.error?.status === 401) {
            api.dispatch(userActions.logout());
            result = await query(args, api, extraOptions);
        }

        return result;
    };
}

const baseQueryRaw = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = state.user.authData?.token
            || JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null")
            || JSON.parse(sessionStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
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
        const state = getState() as RootState;
        const token = state.user.authData?.token
            || JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null")
            || JSON.parse(sessionStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
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
        const state = getState() as RootState;
        const token = state.user.authData?.token
            || JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null")
            || JSON.parse(sessionStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
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
        const state = getState() as RootState;
        const token = state.user.authData?.token
            || JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null")
            || JSON.parse(sessionStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null");

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("accept", "application/json");
        return headers;
    },
    paramsSerializer: (params) => qs.stringify(params, {
        arrayFormat: "brackets",
        encode: true,
    }),
});

export const baseAdminQueryAcceptJson = withReauthOn401(baseAdminQueryAcceptJsonRaw);
