import {
    describe, it, expect, beforeEach, vi,
} from "vitest";
import { userReducer, userActions } from "./userSlice";
import {
    TOKEN_LOCALSTORAGE_KEY,
    MERCURE_TOKEN_LOCALSTORAGE_KEY,
    REFRESH_TOKEN_LOCALSTORAGE_KEY,
    USER_LOCALSTORAGE_KEY,
    ROLES_LOCALSTORAGE_KEY,
} from "@/shared/constants/localstorage";

/**
 * GS-136: refresh_token — новое поле в authData/localStorage, добавленное
 * ради тихого обновления сессии в withReauthOn401 (baseQuery.test.ts).
 * setAuthData/initAuthData/logout должны согласованно хранить и чистить
 * его вместе с остальными токенами; updateTokensAfterRefresh обновляет
 * только токены после успешного refresh, не трогая username/roles.
 */
describe("userSlice", () => {
    beforeEach(() => {
        const store = new Map<string, string>();
        vi.stubGlobal("localStorage", {
            getItem: (key: string) => store.get(key) ?? null,
            setItem: (key: string, value: string) => { store.set(key, value); },
            removeItem: (key: string) => { store.delete(key); },
            clear: () => { store.clear(); },
        });
        vi.stubGlobal("sessionStorage", {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
            clear: () => {},
        });
    });

    it("setAuthData сохраняет refreshToken и в state, и в localStorage", () => {
        const state = userReducer(undefined, userActions.setAuthData({
            username: "vol@test.com",
            token: "access.token",
            mercureToken: "mercure.token",
            refreshToken: "refresh.token",
            rememberMe: false,
            roles: ["ROLE_USER"],
        }));

        expect(state.authData?.refreshToken).toBe("refresh.token");
        expect(JSON.parse(localStorage.getItem(REFRESH_TOKEN_LOCALSTORAGE_KEY) as string)).toBe("refresh.token");
    });

    it("initAuthData восстанавливает refreshToken из localStorage", () => {
        localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify({ username: "vol@test.com" }));
        localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify("access.token"));
        localStorage.setItem(MERCURE_TOKEN_LOCALSTORAGE_KEY, JSON.stringify("mercure.token"));
        localStorage.setItem(REFRESH_TOKEN_LOCALSTORAGE_KEY, JSON.stringify("refresh.token"));
        localStorage.setItem(ROLES_LOCALSTORAGE_KEY, JSON.stringify(["ROLE_USER"]));

        const state = userReducer(undefined, userActions.initAuthData());

        expect(state.authData?.refreshToken).toBe("refresh.token");
        expect(state._inited).toBe(true);
    });

    it("initAuthData без сохранённого refreshToken (старая сессия до GS-136) не падает", () => {
        localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify({ username: "vol@test.com" }));
        localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify("access.token"));
        localStorage.setItem(MERCURE_TOKEN_LOCALSTORAGE_KEY, JSON.stringify("mercure.token"));
        localStorage.setItem(ROLES_LOCALSTORAGE_KEY, JSON.stringify(["ROLE_USER"]));

        const state = userReducer(undefined, userActions.initAuthData());

        expect(state.authData?.refreshToken).toBeUndefined();
        expect(state.authData?.token).toBe("access.token");
    });

    it("updateTokensAfterRefresh обновляет токены, но не трогает username/roles/rememberMe", () => {
        const loggedIn = userReducer(undefined, userActions.setAuthData({
            username: "vol@test.com",
            token: "old.access",
            mercureToken: "old.mercure",
            refreshToken: "old.refresh",
            rememberMe: true,
            roles: ["ROLE_USER"],
        }));

        const refreshed = userReducer(loggedIn, userActions.updateTokensAfterRefresh({
            token: "new.access",
            mercureToken: "new.mercure",
            refreshToken: "new.refresh",
        }));

        expect(refreshed.authData).toMatchObject({
            username: "vol@test.com",
            token: "new.access",
            mercureToken: "new.mercure",
            refreshToken: "new.refresh",
            rememberMe: true,
            roles: ["ROLE_USER"],
        });
        expect(JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) as string)).toBe("new.access");
        expect(JSON.parse(localStorage.getItem(REFRESH_TOKEN_LOCALSTORAGE_KEY) as string)).toBe("new.refresh");
    });

    it("updateTokensAfterRefresh — no-op без активной сессии (не создаёт authData из ничего)", () => {
        const state = userReducer(undefined, userActions.updateTokensAfterRefresh({
            token: "new.access",
            mercureToken: "new.mercure",
            refreshToken: "new.refresh",
        }));

        expect(state.authData).toBeUndefined();
    });

    it("logout чистит refreshToken из state и storage вместе с остальными токенами", () => {
        const loggedIn = userReducer(undefined, userActions.setAuthData({
            username: "vol@test.com",
            token: "access.token",
            mercureToken: "mercure.token",
            refreshToken: "refresh.token",
            rememberMe: false,
            roles: ["ROLE_USER"],
        }));

        const loggedOut = userReducer(loggedIn, userActions.logout());

        expect(loggedOut.authData).toBeUndefined();
        expect(localStorage.getItem(REFRESH_TOKEN_LOCALSTORAGE_KEY)).toBeNull();
    });
});
