import {
    describe, it, expect, vi,
} from "vitest";
import { withReauthOn401 } from "./baseQuery";
import { userActions } from "@/entities/User/model/slice/userSlice";

/**
 * Живой баг (2026-09-04): бэкенд (firewall `api`, jwt: ~ на весь /api/v1)
 * валит запросы 401-м при любом невалидном/протухшем Authorization-
 * заголовке — даже на PUBLIC_ACCESS роуты вроде /api/v1/vacancy.
 * prepareHeaders слепо цепляет токен из localStorage/redux без проверки
 * срока годности, так что протухший токен ломал публичную выдачу
 * вакансий целиком ("0 вариантов" на /offers-map). withReauthOn401 на
 * 401 чистит авторизацию и повторяет запрос анонимно.
 */
describe("withReauthOn401", () => {
    const makeApi = () => ({
        dispatch: vi.fn(),
        getState: vi.fn(),
        signal: new AbortController().signal,
        abort: vi.fn(),
        extra: undefined,
        endpoint: "test",
        type: "query" as const,
    });

    it("на 401 чистит авторизацию и повторяет запрос один раз", async () => {
        const query = vi.fn()
            .mockResolvedValueOnce({ error: { status: 401, data: {} } })
            .mockResolvedValueOnce({ data: { ok: true } });
        const api = makeApi();

        const wrapped = withReauthOn401(query);
        const result = await wrapped("some-arg", api, {});

        expect(query).toHaveBeenCalledTimes(2);
        expect(api.dispatch).toHaveBeenCalledWith(userActions.logout());
        expect(result).toEqual({ data: { ok: true } });
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
        const api = makeApi();

        const wrapped = withReauthOn401(query);
        const result = await wrapped("some-arg", api, {});

        expect(query).toHaveBeenCalledTimes(2);
        expect(result).toEqual({ error: { status: 401, data: {} } });
    });
});
