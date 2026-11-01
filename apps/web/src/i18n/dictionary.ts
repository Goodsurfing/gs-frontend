import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

import type { Locale } from "./config";

type Dictionary = Record<string, unknown>;

const LOCALES_DIR = path.join(process.cwd(), "locales");

/** Словарь пространства (как в старом фронте: public/locales/{lng}/{ns}.json). */
const loadDictionary = cache(async (locale: Locale, namespace: string): Promise<Dictionary> => {
    const file = path.join(LOCALES_DIR, locale, `${namespace}.json`);
    try {
        return JSON.parse(await readFile(file, "utf8")) as Dictionary;
    } catch {
        return {};
    }
});

/**
 * Как deepFind в i18next: сначала ключ целиком (ключи-фразы с точками), затем
 * путь по точкам — причём часть пути сама может содержать точку
 * («category-offer.Заповедники и нац. парки» → category-offer → «Заповедники и нац. парки»).
 */
export const lookup = (dictionary: Dictionary, key: string): string | undefined => {
    const direct = dictionary[key];
    if (typeof direct === "string") return direct;
    const parts = key.split(".");
    for (let i = 1; i < parts.length; i += 1) {
        const node = dictionary[parts.slice(0, i).join(".")];
        if (node && typeof node === "object") {
            const found = lookup(node as Dictionary, parts.slice(i).join("."));
            if (found !== undefined) return found;
        }
    }
    return undefined;
};

export type Translate = (key: string, values?: Record<string, string | number>) => string;

/**
 * Перевод на сервере с теми же ключами, что и в старом фронте. Нет перевода —
 * возвращается ключ (поведение i18next), чтобы тексты не терялись молча.
 */
export const getTranslator = async (locale: Locale, namespace = "translation"): Promise<Translate> => {
    const dictionary = await loadDictionary(locale, namespace);
    return (key, values) => {
        const template = lookup(dictionary, key) ?? key;
        return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(values?.[name] ?? ""));
    };
};
