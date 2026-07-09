import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 102, п.24: текст сообщений в чате переносился
 * через word-break: break-all — резало слова посреди буквы, читать было
 * невозможно. overflow-wrap: break-word переносит по границе слова,
 * ломая само слово только если оно не помещается в строку целиком.
 */
describe("Message — перенос текста сообщения", () => {
    it(".text использует overflow-wrap: break-word, а не word-break: break-all", () => {
        const scss = readFileSync(join(__dirname, "Message.module.scss"), "utf-8");
        const textBlock = scss.match(/\.text\s*{[^}]*}/)?.[0] ?? "";

        expect(textBlock).toMatch(/overflow-wrap:\s*break-word/);
        expect(textBlock).not.toMatch(/word-break:\s*break-all/);
    });
});
