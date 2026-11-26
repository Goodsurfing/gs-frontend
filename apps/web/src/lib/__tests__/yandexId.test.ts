import { afterEach, describe, expect, it, vi } from "vitest";

import {
    base64Url, buildAuthorizeUrl, checkCallback, codeChallenge, exchangeYandexCode, fetchYandexProvider, findYandex, FLOW_TTL_MS,
    type OAuthProvider, parseFlow, randomToken, startYandexFlow, takeStoredFlow, unlinkYandex, YANDEX_ERRORS, type YandexFlow,
    yandexErrorFromCheck, yandexErrorFromResponse, yandexRedirectUri,
} from "@/lib/yandexId";
import { yandexButtonLabels, yandexCallbackLabels, yandexSettingsLabels } from "@/lib/yandexIdLabels";

import ru from "../../../../../public/locales/ru/translation.json";
import en from "../../../../../public/locales/en/translation.json";
import es from "../../../../../public/locales/es/translation.json";

const PROVIDER: OAuthProvider = { name: "yandex", clientId: "abc123", authorizeUrl: "https://oauth.yandex.ru/authorize", scope: "login:email login:info login:avatar" };

const FLOW: YandexFlow = { state: "st4te", verifier: "v".repeat(64), mode: "login", locale: "en", returnTo: "/en/offers/5", backTo: "/en/signin", createdAt: 1_000_000 };

/** sessionStorage в памяти: тесты идут в node, без браузера */
function stubSessionStorage() {
    const data = new Map<string, string>();
    const storage = {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => void data.set(key, value),
        removeItem: (key: string) => void data.delete(key),
    };
    vi.stubGlobal("window", { sessionStorage: storage, localStorage: storage });
    return data;
}

function translator(dict: Record<string, unknown>) {
    return (key: string) => {
        let node: unknown = dict;
        for (const part of key.split(".")) node = (node as Record<string, unknown> | undefined)?.[part];
        return typeof node === "string" ? node : (dict as Record<string, Record<string, string>>).login?.[key.replace(/^login\./, "")] ?? key;
    };
}

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("PKCE", () => {
    it("code_challenge = base64url(SHA-256(verifier)) без «=»", async () => {
        // Значение посчитано независимо (Python: hashlib.sha256 + urlsafe_b64encode)
        expect(await codeChallenge("test-verifier-0123456789-abcdefghijklmnopqrstuvwxyz")).toBe("nw4Cig7sk_DT0QSX9Qn-3UKs33fmbbp8bRuv1b5-wXw");
    });

    it("base64url заменяет + и / и убирает выравнивание", () => {
        expect(base64Url(new Uint8Array([0xfb, 0xff, 0xfe]))).toBe("-__-");
        expect(base64Url(new Uint8Array([1]))).toBe("AQ");
    });

    it("случайные verifier и state — допустимые символы и длина, каждый раз новые", () => {
        const verifier = randomToken(48);
        expect(verifier).toMatch(/^[A-Za-z0-9_-]{64}$/);
        expect(randomToken()).toHaveLength(43);
        expect(randomToken()).not.toBe(randomToken());
    });
});

describe("ссылка на Яндекс", () => {
    it("все параметры контракта, redirect_uri — /oauth/yandex без языка", () => {
        const url = new URL(buildAuthorizeUrl(PROVIDER, { redirectUri: yandexRedirectUri("https://staging.goodsurfing.org"), challenge: "ch", state: "st" }));
        expect(url.origin + url.pathname).toBe("https://oauth.yandex.ru/authorize");
        expect(Object.fromEntries(url.searchParams)).toEqual({
            response_type: "code",
            client_id: "abc123",
            redirect_uri: "https://staging.goodsurfing.org/oauth/yandex",
            scope: "login:email login:info login:avatar",
            code_challenge: "ch",
            code_challenge_method: "S256",
            state: "st",
            force_confirm: "no",
        });
    });

    it("startYandexFlow сохраняет поток в sessionStorage, challenge в ссылке — от сохранённого verifier", async () => {
        stubSessionStorage();
        const href = await startYandexFlow(PROVIDER, { origin: "https://goodsurfing.org", mode: "login", locale: "es", returnTo: "/es/offers/7", backTo: "/es/signin", consentWording: "Хочу письма" });
        const url = new URL(href ?? "");
        const flow = takeStoredFlow();
        expect(flow).toMatchObject({ mode: "login", locale: "es", returnTo: "/es/offers/7", backTo: "/es/signin", consentWording: "Хочу письма" });
        expect(url.searchParams.get("state")).toBe(flow?.state);
        expect(url.searchParams.get("code_challenge")).toBe(await codeChallenge(flow?.verifier ?? ""));
        expect(url.searchParams.get("redirect_uri")).toBe("https://goodsurfing.org/oauth/yandex");
        // Запись одноразовая
        expect(takeStoredFlow()).toBeNull();
    });

    it("без sessionStorage уходить на Яндекс бессмысленно — null", async () => {
        vi.stubGlobal("window", {});
        expect(await startYandexFlow(PROVIDER, { origin: "https://goodsurfing.org", mode: "login", locale: "ru", returnTo: "/", backTo: "/signin" })).toBeNull();
    });
});

describe("сохранённый поток", () => {
    it("целая запись читается", () => {
        expect(parseFlow(JSON.stringify(FLOW))).toEqual(FLOW);
    });

    it.each([
        ["не JSON", "{"],
        ["нет state", JSON.stringify({ ...FLOW, state: undefined })],
        ["неизвестный режим", JSON.stringify({ ...FLOW, mode: "steal" })],
        ["неизвестный язык", JSON.stringify({ ...FLOW, locale: "de" })],
        ["возврат на чужой сайт", JSON.stringify({ ...FLOW, returnTo: "//evil.example/x" })],
        ["возврат по полному адресу", JSON.stringify({ ...FLOW, backTo: "https://evil.example" })],
    ])("битая запись (%s) не используется", (_, raw) => {
        expect(parseFlow(raw)).toBeNull();
    });
});

describe("возврат с Яндекса", () => {
    const now = FLOW.createdAt + 60_000;

    it("код и совпавший state — можно менять код на вход", () => {
        expect(checkCallback("?code=12345&state=st4te", FLOW, now)).toEqual({ ok: true, flow: FLOW, code: "12345" });
    });

    it("чужой или пустой state — отказ (подмена ответа)", () => {
        expect(checkCallback("?code=12345&state=other", FLOW, now)).toMatchObject({ ok: false, reason: "state" });
        expect(checkCallback("?code=12345", FLOW, now)).toMatchObject({ ok: false, reason: "state" });
    });

    it("нет сохранённого потока или он старый — «время истекло»", () => {
        expect(checkCallback("?code=1&state=st4te", null, now)).toMatchObject({ ok: false, reason: "expired" });
        expect(checkCallback("?code=1&state=st4te", FLOW, FLOW.createdAt + FLOW_TTL_MS + 1)).toMatchObject({ ok: false, reason: "expired" });
    });

    it("отказ на Яндексе (?error=access_denied) и ответ без кода", () => {
        expect(checkCallback("?error=access_denied&state=st4te", FLOW, now)).toMatchObject({ ok: false, reason: "denied" });
        expect(checkCallback("?state=st4te", FLOW, now)).toMatchObject({ ok: false, reason: "missing" });
    });

    it("причины проверки → тексты ошибок", () => {
        expect(yandexErrorFromCheck("denied")).toBe("denied");
        expect(yandexErrorFromCheck("state")).toBe("expired");
        expect(yandexErrorFromCheck("expired")).toBe("expired");
        expect(yandexErrorFromCheck("missing")).toBe("unknown");
    });
});

describe("ошибки бэкенда (контракт GS-336)", () => {
    it.each([
        [403, { error: "account_deleted" }, "deleted"],
        [401, { error: "oauth_failed" }, "oauthFailed"],
        [404, { error: "provider_disabled" }, "disabled"],
        [422, { error: "no_email" }, "noEmail"],
        [409, { error: "linked_to_other" }, "linkedToOther"],
        [409, { error: "last_login_method" }, "lastMethod"],
        [400, [{ message: "code: This value should not be blank." }], "unknown"],
        [500, null, "unknown"],
        [401, null, "oauthFailed"],
    ])("%i %j → %s", (status, body, expected) => {
        expect(yandexErrorFromResponse(status, body)).toBe(expected);
    });
});

describe("запросы", () => {
    it("провайдеры: Яндекс в списке — кнопка есть, пусто или ошибка — нет", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(new Response(JSON.stringify({ providers: [PROVIDER] })))
            .mockResolvedValueOnce(new Response(JSON.stringify({ providers: [] })))
            .mockResolvedValueOnce(new Response("oops", { status: 500 }));
        vi.stubGlobal("fetch", fetchMock);
        expect(await fetchYandexProvider()).toEqual(PROVIDER);
        expect(await fetchYandexProvider()).toBeNull();
        expect(await fetchYandexProvider()).toBeNull();
        expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/api\/v1\/oauth\/providers$/);
    });

    it("findYandex пропускает чужие и неполные записи", () => {
        expect(findYandex([{ ...PROVIDER, name: "vk" }])).toBeNull();
        expect(findYandex([{ ...PROVIDER, clientId: "" }])).toBeNull();
        expect(findYandex(undefined)).toBeNull();
    });

    it("вход и привязка шлют code и codeVerifier на свои адреса с cookie", async () => {
        stubSessionStorage().set("token", JSON.stringify("jwt-old"));
        const fetchMock = vi.fn().mockImplementation(async () => new Response(JSON.stringify({ accessToken: "a" })));
        vi.stubGlobal("fetch", fetchMock);
        expect(await exchangeYandexCode("login", "c0de", "ver")).toEqual({ status: 200, body: { accessToken: "a" } });
        await exchangeYandexCode("link", "c0de", "ver");
        const [loginUrl, loginInit] = fetchMock.mock.calls[0] as [string, RequestInit];
        const [linkUrl, linkInit] = fetchMock.mock.calls[1] as [string, RequestInit];
        expect(loginUrl).toMatch(/\/api\/v1\/oauth\/yandex\/login$/);
        expect(linkUrl).toMatch(/\/api\/v1\/oauth\/yandex\/link$/);
        expect(loginInit).toMatchObject({ method: "POST", credentials: "include", body: JSON.stringify({ code: "c0de", codeVerifier: "ver" }) });
        // Привязка — от имени вошедшего: токен старого формата вместе с cookie
        expect((linkInit.headers as Record<string, string>).Authorization).toBe("Bearer jwt-old");
        expect((loginInit.headers as Record<string, string>).Authorization).toBeUndefined();
    });

    it("отвязка: 204 — получилось, 409 last_login_method — понятная ошибка", async () => {
        stubSessionStorage();
        vi.stubGlobal("fetch", vi.fn()
            .mockResolvedValueOnce(new Response(null, { status: 204 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ error: "last_login_method" }), { status: 409 })));
        expect(await unlinkYandex()).toBeNull();
        expect(await unlinkYandex()).toBe("lastMethod");
    });
});

describe("тексты", () => {
    it.each([["ru", ru], ["en", en], ["es", es]])("все подписи есть на %s", (_, dict) => {
        const t = translator(dict as Record<string, unknown>);
        const callback = yandexCallbackLabels(t);
        const settings = yandexSettingsLabels(t);
        const texts = [
            ...Object.values(yandexButtonLabels(t)),
            ...Object.values(callback).flatMap((value) => (typeof value === "string" ? [value] : Object.values(value))),
            ...Object.values(settings).flatMap((value) => (typeof value === "string" ? [value] : Object.values(value))),
        ];
        expect(texts.filter((text) => text.startsWith("yandexId.") || text.startsWith("login."))).toEqual([]);
        expect(Object.keys(callback.errors).sort()).toEqual([...YANDEX_ERRORS].sort());
        // Удалённый аккаунт — тот же текст, что у VK
        expect(callback.errors.deleted).toBe((dict as { login: Record<string, string> }).login["Пользователь был удален или не создавался"]);
    });
});
