import { afterEach, describe, expect, it, vi } from "vitest";

import { completeSocialLogin } from "@/lib/socialLogin";

/** localStorage в памяти: тесты идут в node */
function stubStorage() {
    const data = new Map<string, string>();
    const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => void data.set(key, value), removeItem: (key: string) => void data.delete(key) };
    vi.stubGlobal("window", { localStorage: storage, sessionStorage: storage });
    return data;
}

afterEach(() => vi.unstubAllGlobals());

describe("вход через внешний аккаунт (VK ID, Яндекс ID)", () => {
    it("сохраняет вход в формате старого SPA и ведёт дальше", () => {
        const data = stubStorage();
        const next = vi.fn();
        const done = completeSocialLogin({ accessToken: "jwt", refresh_token: "r", mercureToken: "m", user: { email: "a@b.c", roles: ["ROLE_USER", "ROLE_HOST"] }, isNew: true }, "yandex", next);
        expect(done).toBe(true);
        // Без счётчика Метрики цель не ждём — переход сразу
        expect(next).toHaveBeenCalledOnce();
        expect(JSON.parse(data.get("token") ?? "null")).toBe("jwt");
        expect(JSON.parse(data.get("refreshToken") ?? "null")).toBe("r");
        expect(JSON.parse(data.get("roles") ?? "null")).toEqual(["ROLE_USER", "ROLE_HOST"]);
        expect(JSON.parse(data.get("user") ?? "null")).toEqual({ username: "a@b.c" });
    });

    it("ответ без токена — не вход, дальше не ведёт", () => {
        stubStorage();
        const next = vi.fn();
        expect(completeSocialLogin({ error: "oauth_failed" } as never, "vk", next)).toBe(false);
        expect(completeSocialLogin(null, "vk", next)).toBe(false);
        expect(next).not.toHaveBeenCalled();
    });
});
