/**
 * «Пригласи друга»: код из ссылки ?ref=… запоминаем в браузере, а когда человек войдёт
 * (после регистрации по почте или через VK) — один раз передаём на сервер.
 */
const KEY = "gs.ref";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

type Stored = { code: string; at: number };

export function rememberReferral(search: string, now = Date.now()): void {
    const code = new URLSearchParams(search).get("ref")?.trim().toLowerCase();
    if (!code || !/^[a-z0-9]{4,12}$/.test(code)) return;
    try {
        localStorage.setItem(KEY, JSON.stringify({ code, at: now } satisfies Stored));
    } catch {
        // Приватный режим без хранилища — без приглашения
    }
}

export function storedReferral(now = Date.now()): string | null {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const value = JSON.parse(raw) as Partial<Stored>;
        if (typeof value.code !== "string" || typeof value.at !== "number" || now - value.at > TTL_MS) {
            localStorage.removeItem(KEY);
            return null;
        }
        return value.code;
    } catch {
        return null;
    }
}

export function forgetReferral(): void {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // нечего делать
    }
}
