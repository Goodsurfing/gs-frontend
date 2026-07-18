import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

// Регресс-тест на row 107: "При смене языка сайт переводится очень
// выборочно" — причиной оказались целые секции (например membership.json),
// у которых в en/es отсутствовали десятки ключей, присутствующих в ru.
// i18next в этом случае молча возвращает русский текст как фолбэк
// (fallbackLng: "ru"), поэтому визуально это выглядит как "местами не
// перевелось", а не как явная ошибка — без этого теста регресс невидим.

const LOCALES_DIR = path.resolve(__dirname, "../../../../public/locales");
const SOURCE_LOCALE = "ru";
const TARGET_LOCALES = ["en", "es"];

type LocaleTree = { [key: string]: string | LocaleTree };

function flatten(tree: LocaleTree, prefix = ""): Record<string, string> {
    return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "string") {
            acc[fullKey] = value;
        } else {
            Object.assign(acc, flatten(value, fullKey));
        }
        return acc;
    }, {});
}

const sourceNamespaces = fs.readdirSync(path.join(LOCALES_DIR, SOURCE_LOCALE))
    .filter((f) => f.endsWith(".json"));

describe("i18n locales completeness (ru → en/es)", () => {
    TARGET_LOCALES.forEach((locale) => {
        sourceNamespaces.forEach((namespace) => {
            it(`${locale}/${namespace} содержит все ключи и непустые значения из ru/${namespace}`, () => {
                const sourcePath = path.join(LOCALES_DIR, SOURCE_LOCALE, namespace);
                const targetPath = path.join(LOCALES_DIR, locale, namespace);

                const sourceFlat = flatten(JSON.parse(fs.readFileSync(sourcePath, "utf-8")));

                expect(fs.existsSync(targetPath), `файл ${locale}/${namespace} отсутствует целиком`).toBe(true);

                const targetFlat = flatten(JSON.parse(fs.readFileSync(targetPath, "utf-8")));

                const missing = Object.keys(sourceFlat).filter(
                    (key) => !(key in targetFlat) || targetFlat[key] === "",
                );

                expect(missing, `пропущенные или пустые ключи в ${locale}/${namespace}`).toEqual([]);
            });
        });
    });
});
