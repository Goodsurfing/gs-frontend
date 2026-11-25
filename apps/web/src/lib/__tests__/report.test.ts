import { readFileSync } from "node:fs";
import path from "node:path";

import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { sendComplaint } from "@/components/report/ReportDialog";
import { RULES } from "@/content/legal";

import { blockedSendText, complaintErrorText, errorCode, reportLabels } from "../report";

const dictionary = (locale: string) => JSON.parse(readFileSync(path.resolve(__dirname, `../../../../../public/locales/${locale}/report.json`), "utf8")) as Record<string, unknown>;
// Словарь report — ключи и вложенный reasons.* (как lookup в i18n/dictionary, он только для сервера)
const lookup = (dict: Record<string, unknown>, key: string): string | undefined => {
    const [head, tail] = key.split(".");
    const node = dict[head ?? ""];
    if (tail === undefined) return typeof node === "string" ? node : undefined;
    const value = node && typeof node === "object" ? (node as Record<string, unknown>)[tail] : undefined;
    return typeof value === "string" ? value : undefined;
};
const translator = (locale: string) => {
    const dict = dictionary(locale);
    return (key: string, values?: Record<string, string | number>) => (lookup(dict, key) ?? key).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(values?.[name] ?? ""));
};

describe("подписи «Пожаловаться и заблокировать»", () => {
    it.each(["ru", "en", "es"])("в словаре %s есть все тексты", (locale) => {
        const labels = reportLabels(translator(locale));
        const missing = Object.entries({ ...labels, ...labels.reasons })
            .filter(([key, value]) => typeof value === "string" && (value === key || value === `reasons.${key}` || value === ""))
            .map(([key]) => key);
        expect(missing).toEqual([]);
        expect(labels.blockedSince).toContain("{{date}}");
    });

    it("русские тексты — как в задаче", () => {
        const labels = reportLabels(translator("ru"));
        expect(labels.reasons).toEqual({ spam: "Спам", abuse: "Оскорбления", fraud: "Мошенничество", other: "Другое" });
        expect(labels.sent).toBe("Жалоба отправлена. Мы рассмотрим её в течение суток");
    });
});

describe("ошибки отправки заблокированному", () => {
    const labels = { recipientBlocked: "ограничил", recipientBlockedByYou: "вы заблокировали" };

    it("узнаёт по errorCode и по type", () => {
        expect(blockedSendText({ errorCode: "recipient_blocked", detail: "…" }, labels)).toBe("ограничил");
        expect(blockedSendText({ type: "/errors/recipient_blocked_by_you" }, labels)).toBe("вы заблокировали");
        expect(errorCode({ type: "recipient_blocked" })).toBe("recipient_blocked");
    });

    it("другие ошибки — не про блокировку", () => {
        expect(blockedSendText({ errorCode: "forbidden" }, labels)).toBeNull();
        expect(blockedSendText(null, labels)).toBeNull();
        expect(blockedSendText("текст", labels)).toBeNull();
    });
});

describe("отправка жалобы", () => {
    afterEach(() => vi.unstubAllGlobals());
    const labels = { error: "Не удалось", tooMany: "Слишком много" };

    it("тело запроса и успех", async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 7 }), { status: 201 }));
        vi.stubGlobal("fetch", fetchMock);
        await expect(sendComplaint("tok", { type: "message", id: "15" }, "spam", "  грубит  ", labels)).resolves.toEqual({ ok: true });
        const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
        expect(url).toMatch(/\/api\/v1\/complaints$/);
        expect(JSON.parse(String(init.body))).toEqual({ targetType: "message", targetId: "15", reason: "spam", comment: "грубит" });
        expect((init.headers as Record<string, string>).Authorization).toBe("Bearer tok");
    });

    it("ошибки: текст API, 429, сеть", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "Нельзя пожаловаться на себя", errorCode: "self" }), { status: 400 })));
        await expect(sendComplaint(undefined, { type: "user", id: "u" }, "other", "", labels)).resolves.toEqual({ ok: false, error: "Нельзя пожаловаться на себя" });
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 429 })));
        await expect(sendComplaint(undefined, { type: "user", id: "u" }, "other", "", labels)).resolves.toEqual({ ok: false, error: "Слишком много" });
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
        await expect(sendComplaint(undefined, { type: "user", id: "u" }, "other", "", labels)).resolves.toEqual({ ok: false, error: "Не удалось" });
        expect(complaintErrorText(500, null, labels)).toBe("Не удалось");
    });
});

describe("правила сервиса", () => {
    it.each([
        ["ru", "Жалобы рассматриваются в течение"],
        ["en", "Reports are reviewed within 24 hours"],
        ["es", "Las denuncias se revisan en"],
    ] as const)("%s: абзац о жалобах и блокировке", (locale, text) => {
        const html = renderToString(RULES[locale].body).replace(/\s+/g, " ");
        expect(html).toContain(text);
        expect(html).toContain("5.7.");
    });
});
