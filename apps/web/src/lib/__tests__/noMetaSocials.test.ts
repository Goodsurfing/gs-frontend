import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Meta признана в РФ экстремистской (решение владельца 10.11.2026): в публичной части сайта
 * не показываем логотипы и ссылки Facebook и Instagram. Админка (внутренний инструмент) и тела
 * запросов к API (поля facebook/instagram в данных остаются) — исключения.
 */
const ROOT = path.resolve(__dirname, "../../..");
const ALLOWED = [
    "src/components/admin/",
    "/__tests__/",
    "src/lib/profileForm.ts", // прежние значения не стираем при сохранении профиля
    "src/components/cabinet/host/HostDescriptionForm.tsx", // API требует поля при создании организации
];

function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const full = path.join(dir, name);
        return statSync(full).isDirectory() ? files(full) : [full];
    });
}

describe("нет Facebook и Instagram в публичной части", () => {
    it("ни в коде страниц, ни в текстах, ни в иконках", () => {
        const sources = [...files(path.join(ROOT, "src")), ...files(path.resolve(ROOT, "../../public/locales"))]
            .filter((file) => /\.(tsx?|json)$/.test(file))
            .filter((file) => !ALLOWED.some((allowed) => file.includes(allowed)));
        const offenders = sources.filter((file) => /facebook|instagram/i.test(readFileSync(file, "utf8").replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "")));
        expect(offenders.map((file) => path.relative(ROOT, file))).toEqual([]);

        const icons = files(path.join(ROOT, "public/web/icons")).filter((file) => /facebook|instagram/i.test(file));
        expect(icons).toEqual([]);
    });
});
