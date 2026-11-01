import type { Middleware } from "@reduxjs/toolkit";

import { adminActions } from "@/entities/Admin/model/slice/adminSlice";
import { userActions } from "@/entities/User/model/slice/userSlice";
import { API_BASE_URL } from "@/shared/constants/api";

type Send = (url: string, init: RequestInit) => unknown;

/**
 * Выход на сервере (GS-218): бэкенд стирает cookie входа и отзывает
 * refresh-токен. Без этого после выхода cookie продолжала бы авторизовывать
 * запросы — старое SPA шлёт запросы с credentials: "include".
 *
 * Срабатывает до редьюсера, пока сессия (с refresh-токеном) ещё в сторе, и только
 * при выходе из активной сессии: withReauthOn401 зовёт logout и для гостя
 * (протухшую cookie гостя бэкенд стирает сам в ответе на 401).
 */
type AuthState = {
    user?: { authData?: { refreshToken?: unknown } };
    admin?: { authData?: unknown };
};

const defaultSend: Send = (url, init) => fetch(url, init);

export const createServerLogoutMiddleware = (
    send: Send = defaultSend,
): Middleware => (store) => (next) => (action) => {
    const state = store.getState() as AuthState;
    const endsSession = (userActions.logout.match(action) && state.user?.authData)
        || (adminActions.logout.match(action) && state.admin?.authData);

    if (endsSession) {
        // Из сессии в сторе: в localStorage токен лежит JSON-строкой (в кавычках)
        const raw = state.user?.authData?.refreshToken;
        const refreshToken = typeof raw === "string" && raw !== "" ? raw : null;
        try {
            Promise.resolve(send(`${API_BASE_URL}token/logout`, {
                method: "POST",
                credentials: "include",
                keepalive: true,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(refreshToken ? { refresh_token: refreshToken } : {}),
            })).catch(() => undefined);
        } catch {
            // Выход в интерфейсе не должен зависеть от сети
        }
    }

    return next(action);
};
