import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Медленный интернет (правило владельца 04.11.2026): у каждой картинки из
 * данных (src — выражение, а не строка с иконкой) явно указано, ленивая она
 * или нет, а у ленивой зарезервирован размер — иначе до загрузки её высота
 * нулевая, нет заглушки и страница прыгает (так было со слайдером отзывов
 * на /membership).
 */
const ROOT = join(__dirname, "..", "..");

const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" ? [] : files(path);
    return path.endsWith(".tsx") ? [path] : [];
});

/** Открывающий тег <img …> целиком: «>» внутри {…} (стрелочные функции) тег не закрывает */
const readTag = (source: string, start: number) => {
    let depth = 0;
    for (let i = start; i < source.length; i++) {
        const ch = source[i];
        if (ch === "{") depth++;
        else if (ch === "}") depth--;
        else if (ch === ">" && depth === 0) return source.slice(start, i + 1);
    }
    return source.slice(start);
};

const imgTags = files(ROOT).flatMap((file) => {
    const source = readFileSync(file, "utf8");
    return [...source.matchAll(/<img\b/g)].map((match) => ({ file: relative(ROOT, file), tag: readTag(source, match.index) }));
});

const dynamicSrc = (tag: string) => {
    const src = /\bsrc=(\{[^}]*\}|"[^"]*")/.exec(tag)?.[1] ?? "";
    return src.startsWith("{") && !/icon|logo|flag|svg|\bIMG\b/i.test(src);
};

const hasReservedSize = (tag: string) => {
    const className = /className=(\{`[^`]*`\}|"[^"]*"|\{[^}]*\})/.exec(tag)?.[1] ?? "";
    return className.split(/[\s{}`"$]+/).some((token) => /^(h-|size-|aspect-|inset-0)/.test(token)) || (/\bheight=/.test(tag) && /\bwidth=/.test(tag));
};

describe("картинки на медленном интернете", () => {
    it("у картинки из данных явно задано loading", () => {
        const missing = imgTags.filter(({ tag }) => dynamicSrc(tag) && !/\bloading=/.test(tag)).map(({ file }) => file);
        expect(missing, "добавьте loading=\"lazy\" (есть размер) или loading=\"eager\" (размер задаёт картинка)").toEqual([]);
    });

    it("у ленивой картинки зарезервирован размер", () => {
        const unsized = imgTags.filter(({ tag }) => /loading="lazy"/.test(tag) && !hasReservedSize(tag)).map(({ file, tag }) => `${file}: ${tag.slice(0, 80)}`);
        expect(unsized, "ленивой картинке нужен размер без условия по ширине: h-, size-, aspect-, inset-0 или атрибуты width и height").toEqual([]);
    });
});
