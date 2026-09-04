import {
    describe, it, expect, vi, beforeEach, afterEach,
} from "vitest";
import { withReauthOn401 } from "./baseQuery";
import { userActions } from "@/entities/User/model/slice/userSlice";

// jsdom в этом тестовом окружении не инициализирует localStorage вне
// компонентных тестов с render() (та же пре-существующая проблема, что и
// в других "чистых" юнит-тестах на слайсы/утилиты этого репо) —
// стабим минимальную рабочую реализацию, чтобы тест не зависел от этой
// внешней особенности среды.
beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => { store.set(key, value); },
        removeItem: (key: string) => { store.delete(key); },
        clear: () => { store.clear(); },
    });
});

/**
 * Живой баг (2026-09-04): бэкенд (firewall `api`, jwt: ~ на весь /api/v1)
 * валит запросы 401-м при любом невалидном/протухшем Authorization-
 * заголовке — даже на PUBLIC_ACCESS роуты вроде /api/v1/vacancy.
 * prepareHeaders слепо цепляет токен из localStorage/redux без проверки
 * срока годности, так что протухший токен ломал публичную выдачу
 * вакансий целиком ("0 вариантов" на /offers-map).
 *
 * GS-136 (best-practices follow-up): на 401 сначала пробуем тихо обновить
 * сессию по refresh_token — активный пользователь не должен вылетать из
 * аккаунта просто потому что access-токен истёк, пока refresh_token ещё
 * жив (30 дней против суток у access-токена). Разлогин — только если
 * обновить нечем/не вышло.
 */
describe("withReauthOn401", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    const makeApi = (authData: Record<string, unknown> | undefined = undefined) => ({
        dispatch: vi.fn(),
        getState: vi.fn(() => ({ user: { authData } })),
        signal: new AbortController().signal,
        abort: vi.fn(),
        extra: undefined,
        endpoint: "test",
        type: "query" as const,
    });

    it("на 401 без refresh-токена (гость) чистит авторизацию и повторяет запрос анонимно", async () => {
        const query = vi.fn()
            .mockResolvedValueOnce({ error: { status: 401, data: {} } })
            .mockResolvedValueOnce({ data: { ok: true } });
        const api = makeApi(undefined);

        const wrapped = withReauthOn401(query);
        const result = await wrapped("some-arg", api, {});

        expect(query).toHaveBeenCalledTimes(2);
        expect(api.dispatch).toHaveBeenCalledWith(userActions.logout());
        expect(result).toEqual({ data: { ok: true } });
    });

    it("на 401 с рабочим refresh-токеном тихо обновляет сессию и повторяет запрос без разлогина", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                token: "new.token", mercureToken: "new.mercure", refresh_token: "new.refresh",
            }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const query = vi.fn()
            .mockResolvedValueOnce({ error: { status: 401, data: {} } })
            .mockResolvedValueOnce({ data: { ok: true } });
        const api = makeApi({ token: "stale.token", refreshToken: "valid.refresh" });

        const wrapped = withReauthOn401(query);
        const result = await wrapped("some-arg", api, {});

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock.mock.calls[0][0]).toContain("token/refresh");
        expect(api.dispatch).toHaveBeenCalledWith(userActions.updateTokensAfterRefresh({
            token: "new.token",
            mercureToken: "new.mercure",
            refreshToken: "new.refresh",
        }));
        expect(api.dispatch).not.toHaveBeenCalledWith(userActions.logout());
        expect(query).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ data: { ok: true } });
    });

    it("если refresh-запрос сам падает — чистит авторизацию и повторяет запрос анонимно", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

        const query = vi.fn()
            .mockResolvedValueOnce({ error: { status: 401, data: {} } })
            .mockResolvedValueOnce({ data: { ok: true } });
        const api = makeApi({ token: "stale.token", refreshToken: "dead.refresh" });

        const wrapped = withReauthOn401(query);
        const result = await wrapped("some-arg", api, {});

        expect(api.dispatch).toHaveBeenCalledWith(userActions.logout());
        expect(query).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ data: { ok: true } });
    });

    it("два параллельных 401 с одним и тем же refresh-токеном шлют только один refresh-запрос (single_use на бэке)", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                token: "new.token", mercureToken: "new.mercure", refresh_token: "new.refresh",
            }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const query = vi.fn().mockImplementation(async () => ({ data: { ok: true } }));
        query.mockResolvedValueOnce({ error: { status: 401, data: {} } });
        query.mockResolvedValueOnce({ error: { status: 401, data: {} } });

        const api = makeApi({ token: "stale.token", refreshToken: "valid.refresh" });
        const wrapped = withReauthOn401(query);

        await Promise.all([
            wrapped("req-1", api, {}),
            wrapped("req-2", api, {}),
        ]);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("не трогает авторизацию и не повторяет запрос при успехе с первого раза", async () => {
        const query = vi.fn().mockResolvedValueOnce({ data: { ok: true } });
        const api = makeApi();

        const wrapped = withReauthOn401(query);
        const result = await wrapped("some-arg", api, {});

        expect(query).toHaveBeenCalledTimes(1);
        expect(api.dispatch).not.toHaveBeenCalled();
        expect(result).toEqual({ data: { ok: true } });
    });

    it("не повторяет запрос при ошибках, отличных от 401 (например 500)", async () => {
        const query = vi.fn().mockResolvedValueOnce({ error: { status: 500, data: {} } });
        const api = makeApi();

        const wrapped = withReauthOn401(query);
        const result = await wrapped("some-arg", api, {});

        expect(query).toHaveBeenCalledTimes(1);
        expect(api.dispatch).not.toHaveBeenCalled();
        expect(result).toEqual({ error: { status: 500, data: {} } });
    });

    it("если повторный запрос тоже 401 (реально протухшая сессия) — возвращает финальную ошибку без зацикливания", async () => {
        const query = vi.fn().mockResolvedValue({ error: { status: 401, data: {} } });
        const api = makeApi(undefined);

        const wrapped = withReauthOn401(query);
        const result = await wrapped("some-arg", api, {});

        expect(query).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ error: { status: 401, data: {} } });
    });
});
