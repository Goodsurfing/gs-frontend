/**
 * Вход и привязка через Яндекс ID (GS-336): authorization code + PKCE (S256).
 * Ключи приложения Яндекса — на бэкенде; GET /api/v1/oauth/providers отдаёт
 * clientId и адрес авторизации только включённых провайдеров (нет ключей —
 * пустой список, кнопки нет). code_verifier и state хранит и проверяет сайт
 * (sessionStorage вкладки), код меняет на вход бэкенд.
 *
 * Типы ответов — по контракту gs-backend (PR GS-336); в OpenAPI-клиенте
 * (`@goodsurfing/api`) этих путей пока нет — после выкатки бэкенда
 * перегенерировать типы и перейти на browserApi.
 */
import { isLocale, type Locale } from "@/i18n/config";
import { safeSitePath, storedAuthHeaders } from "@/lib/authSession";
import { API_URL } from "@/lib/browserApi";
import { storageGet, storageRemove, storageSet } from "@/lib/safeStorage";

export interface OAuthProvider {
    name: string;
    clientId: string;
    authorizeUrl: string;
    scope: string;
}

export interface OAuthAccount {
    provider: string;
    linked: boolean;
    canUnlink: boolean;
}

/** Путь страницы-колбэка: ровно он зарегистрирован в приложении Яндекса (без языка — язык в sessionStorage) */
export const YANDEX_CALLBACK_PATH = "/oauth/yandex";

/** Отметка «только что привязали» для блока в настройках (sessionStorage) */
export const YANDEX_LINKED_FLASH = "gs.yandexIdLinked";

export const yandexRedirectUri = (origin: string) => `${origin}${YANDEX_CALLBACK_PATH}`;

/** Что запомнить перед уходом на Яндекс: проверить state и вернуть человека туда, откуда он пришёл */
export interface YandexFlow {
    state: string;
    verifier: string;
    mode: "login" | "link";
    locale: Locale;
    /** Путь этого сайта, куда вернуть после успеха */
    returnTo: string;
    /** Куда вести кнопкой «Вернуться» при ошибке (вход или настройки) */
    backTo: string;
    /** С регистрации с отмеченным согласием на рассылку — формулировка согласия */
    consentWording?: string;
    createdAt: number;
}

const FLOW_KEY = "gs.yandexIdFlow";
/** Сколько ждём возвращения с Яндекса: дольше — начинать заново */
export const FLOW_TTL_MS = 30 * 60 * 1000;

/** base64url без «=» (RFC 7636) */
export function base64Url(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Случайная строка base64url: 32 байта → 43 символа (допустимая длина verifier — 43…128) */
export function randomToken(bytes = 32): string {
    return base64Url(crypto.getRandomValues(new Uint8Array(bytes)));
}

/** code_challenge = base64url(SHA-256(verifier)) */
export async function codeChallenge(verifier: string): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    return base64Url(new Uint8Array(digest));
}

/** Ссылка на авторизацию Яндекса по контракту GS-336 */
export function buildAuthorizeUrl(provider: OAuthProvider, params: { redirectUri: string; challenge: string; state: string }): string {
    const url = new URL(provider.authorizeUrl);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", provider.clientId);
    url.searchParams.set("redirect_uri", params.redirectUri);
    url.searchParams.set("scope", provider.scope);
    url.searchParams.set("code_challenge", params.challenge);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("state", params.state);
    url.searchParams.set("force_confirm", "no");
    return url.toString();
}

/**
 * Начать вход или привязку: verifier и state — в sessionStorage, в ответ —
 * адрес Яндекса для перехода. Без sessionStorage вернуться не выйдет — null.
 */
export async function startYandexFlow(provider: OAuthProvider, options: {
    origin: string;
    mode: YandexFlow["mode"];
    locale: Locale;
    returnTo: string;
    backTo: string;
    consentWording?: string;
}): Promise<string | null> {
    const flow: YandexFlow = {
        state: randomToken(24),
        verifier: randomToken(48),
        mode: options.mode,
        locale: options.locale,
        returnTo: options.returnTo,
        backTo: options.backTo,
        ...(options.consentWording ? { consentWording: options.consentWording } : {}),
        createdAt: Date.now(),
    };
    storageSet(FLOW_KEY, JSON.stringify(flow), "session");
    if (storageGet(FLOW_KEY, "session") === null) return null;
    const challenge = await codeChallenge(flow.verifier);
    return buildAuthorizeUrl(provider, { redirectUri: yandexRedirectUri(options.origin), challenge, state: flow.state });
}

/** Сохранённый поток, если он целый (битую или чужую запись не используем) */
export function parseFlow(raw: string | null): YandexFlow | null {
    if (!raw) return null;
    try {
        const data = JSON.parse(raw) as Partial<YandexFlow>;
        if (typeof data.state !== "string" || typeof data.verifier !== "string" || typeof data.createdAt !== "number") return null;
        if (data.mode !== "login" && data.mode !== "link") return null;
        if (typeof data.locale !== "string" || !isLocale(data.locale)) return null;
        const returnTo = safeSitePath(data.returnTo);
        const backTo = safeSitePath(data.backTo);
        if (!returnTo || !backTo) return null;
        return {
            state: data.state,
            verifier: data.verifier,
            mode: data.mode,
            locale: data.locale,
            returnTo,
            backTo,
            ...(typeof data.consentWording === "string" && data.consentWording ? { consentWording: data.consentWording } : {}),
            createdAt: data.createdAt,
        };
    } catch {
        return null;
    }
}

export type CallbackCheck =
    | { ok: true; flow: YandexFlow; code: string }
    /** expired — нет записи или она старая (вернулись не в той вкладке, давно ушли); state — подмена; denied — отказ на Яндексе */
    | { ok: false; reason: "expired" | "state" | "denied" | "missing"; flow: YandexFlow | null };

/**
 * Проверка возврата с Яндекса (?code=&state= или ?error=&state=): state
 * должен совпасть с сохранённым, запись одноразовая.
 */
export function checkCallback(search: string, stored: YandexFlow | null, now = Date.now()): CallbackCheck {
    const params = new URLSearchParams(search);
    const state = params.get("state");
    const code = params.get("code");
    if (!stored || now - stored.createdAt > FLOW_TTL_MS) return { ok: false, reason: "expired", flow: stored };
    if (!state || state !== stored.state) return { ok: false, reason: "state", flow: stored };
    if (params.get("error")) return { ok: false, reason: "denied", flow: stored };
    if (!code) return { ok: false, reason: "missing", flow: stored };
    return { ok: true, flow: stored, code };
}

/** Забрать поток из sessionStorage (одноразово) */
export function takeStoredFlow(): YandexFlow | null {
    const flow = parseFlow(storageGet(FLOW_KEY, "session"));
    storageRemove(FLOW_KEY, "session");
    return flow;
}

/** Ошибки, о которых человеку говорим своими словами */
export const YANDEX_ERRORS = ["deleted", "oauthFailed", "disabled", "noEmail", "linkedToOther", "lastMethod", "expired", "denied", "unknown"] as const;
export type YandexError = (typeof YANDEX_ERRORS)[number];

/** Ответ бэкенда с ошибкой → код текста (контракт GS-336) */
export function yandexErrorFromResponse(status: number, body: unknown): YandexError {
    const error = body && typeof body === "object" && typeof (body as { error?: unknown }).error === "string" ? (body as { error: string }).error : "";
    if (error === "account_deleted" || status === 403) return "deleted";
    if (error === "no_email") return "noEmail";
    if (error === "linked_to_other") return "linkedToOther";
    if (error === "last_login_method") return "lastMethod";
    if (error === "provider_disabled" || status === 404) return "disabled";
    if (error === "oauth_failed" || status === 401) return "oauthFailed";
    return "unknown";
}

/** Результат проверки колбэка → код текста ошибки */
export function yandexErrorFromCheck(reason: Exclude<CallbackCheck, { ok: true }>["reason"]): YandexError {
    if (reason === "denied") return "denied";
    if (reason === "expired" || reason === "state") return "expired";
    return "unknown";
}

const timeout = () => AbortSignal.timeout(10_000);

/** Яндекс среди включённых провайдеров; сбой запроса — null (кнопки просто нет) */
export async function fetchYandexProvider(): Promise<OAuthProvider | null> {
    const response = await fetch(`${API_URL}/api/v1/oauth/providers`, { signal: timeout() });
    if (!response.ok) return null;
    const data = await response.json() as { providers?: OAuthProvider[] };
    return findYandex(data?.providers);
}

export function findYandex(providers: OAuthProvider[] | undefined | null): OAuthProvider | null {
    const yandex = Array.isArray(providers) ? providers.find((item) => item?.name === "yandex") : undefined;
    return yandex && yandex.clientId && yandex.authorizeUrl ? yandex : null;
}

/** Обмен кода: вход (POST …/login) или привязка (POST …/link) */
export async function exchangeYandexCode(mode: YandexFlow["mode"], code: string, codeVerifier: string): Promise<{ status: number; body: unknown }> {
    const response = await fetch(`${API_URL}/api/v1/oauth/yandex/${mode === "link" ? "link" : "login"}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(mode === "link" ? storedAuthHeaders() : {}) },
        body: JSON.stringify({ code, codeVerifier }),
    });
    return { status: response.status, body: await response.json().catch(() => null) };
}

/** Привязка Яндекса у вошедшего; пустой список — провайдер выключен (блок не показываем) */
export async function fetchYandexAccount(): Promise<OAuthAccount | null> {
    const response = await fetch(`${API_URL}/api/v1/oauth/accounts`, { credentials: "include", headers: storedAuthHeaders(), signal: timeout() });
    if (!response.ok) return null;
    const data = await response.json() as { accounts?: OAuthAccount[] };
    return (Array.isArray(data?.accounts) ? data.accounts.find((item) => item?.provider === "yandex") : undefined) ?? null;
}

/** Отвязать Яндекс: null — получилось, иначе код текста ошибки */
export async function unlinkYandex(): Promise<YandexError | null> {
    const response = await fetch(`${API_URL}/api/v1/oauth/yandex/link`, { method: "DELETE", credentials: "include", headers: storedAuthHeaders() });
    if (response.ok) return null;
    return yandexErrorFromResponse(response.status, await response.json().catch(() => null));
}
