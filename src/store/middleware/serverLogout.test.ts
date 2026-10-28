import { configureStore, createSlice } from "@reduxjs/toolkit";
import {
    beforeEach, describe, expect, it, vi,
} from "vitest";

import { userActions } from "@/entities/User/model/slice/userSlice";

import { createServerLogoutMiddleware } from "./serverLogout";

const makeStore = (authData: unknown, send: ReturnType<typeof vi.fn>) => {
    const user = createSlice({
        name: "userState",
        initialState: { authData },
        reducers: {},
        extraReducers: (builder) => builder.addCase(userActions.logout, (state) => {
            state.authData = undefined;
        }),
    });
    return configureStore({
        reducer: { user: user.reducer },
        middleware: (getDefault) => getDefault().concat(createServerLogoutMiddleware(send)),
    });
};

describe("createServerLogoutMiddleware", () => {
    beforeEach(() => localStorage.clear());

    it("при выходе из сессии зовёт /token/logout с refresh-токеном из сессии (без кавычек JSON)", () => {
        // В localStorage токен лежит JSON-строкой — брать его оттуда как есть нельзя
        localStorage.setItem("refreshToken", JSON.stringify("refresh-123"));
        const send = vi.fn(() => Promise.resolve());
        makeStore({ id: "1", refreshToken: "refresh-123" }, send).dispatch(userActions.logout());

        expect(send).toHaveBeenCalledTimes(1);
        const [url, init] = send.mock.calls[0] as unknown as [string, RequestInit];
        expect(url).toMatch(/\/api\/v1\/token\/logout$/);
        expect(init.credentials).toBe("include");
        expect(JSON.parse(init.body as string)).toEqual({ refresh_token: "refresh-123" });
    });

    it("для гостя (logout из withReauthOn401) сервер не дёргает", () => {
        const send = vi.fn();
        makeStore(undefined, send).dispatch(userActions.logout());
        expect(send).not.toHaveBeenCalled();
    });

    it("сбой сети не мешает выходу", () => {
        const send = vi.fn(() => { throw new Error("offline"); });
        const store = makeStore({ id: "1" }, send);
        expect(() => store.dispatch(userActions.logout())).not.toThrow();
        expect(store.getState().user.authData).toBeUndefined();
    });
});
