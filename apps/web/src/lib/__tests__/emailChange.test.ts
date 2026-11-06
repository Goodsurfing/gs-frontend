import { describe, expect, it } from "vitest";

import { EMAIL_CHANGE_ERRORS, emailChangeErrorText } from "@/lib/emailChange";
import { emailChangeLabels, emailChangeLinkLabels } from "@/lib/emailChangeLabels";

import ru from "../../../../../public/locales/ru/translation.json";
import en from "../../../../../public/locales/en/translation.json";
import es from "../../../../../public/locales/es/translation.json";

/** Простой переводчик по словарю: ключ не найден — вернуть сам ключ (так видно пропуски) */
function translator(dict: Record<string, unknown>) {
    return (key: string, values?: Record<string, string | number>) => {
        let node: unknown = dict;
        for (const part of key.split(".")) node = (node as Record<string, unknown> | undefined)?.[part];
        let text = typeof node === "string" ? node : key;
        for (const [name, value] of Object.entries(values ?? {})) text = text.replaceAll(`{{${name}}}`, String(value));
        return text;
    };
}

describe("смена почты", () => {
    it.each([["ru", ru], ["en", en], ["es", es]])("все подписи есть на %s", (_, dict) => {
        const t = translator(dict as Record<string, unknown>);
        const all = [emailChangeLabels(t), emailChangeLinkLabels(t, "confirm"), emailChangeLinkLabels(t, "revert")];
        const texts: string[] = all.flatMap((labels) => Object.values(labels).flatMap((value: string | Record<string, string>) => (typeof value === "string" ? [value] : Object.values(value))));
        expect(texts.filter((text) => text.startsWith("emailChange."))).toEqual([]);
        // Подстановки остаются для компонента
        expect(emailChangeLabels(t).sent).toContain("{{email}}");
        expect(emailChangeLabels(t).pending).toContain("{{date}}");
    });

    it("неизвестный код ошибки — общий текст", () => {
        const texts = Object.fromEntries(EMAIL_CHANGE_ERRORS.map((code) => [code, code])) as Record<(typeof EMAIL_CHANGE_ERRORS)[number], string>;
        expect(emailChangeErrorText("email_taken", texts)).toBe("email_taken");
        expect(emailChangeErrorText("something_new", texts)).toBe("unknown");
        expect(emailChangeErrorText(undefined, texts)).toBe("unknown");
    });
});
