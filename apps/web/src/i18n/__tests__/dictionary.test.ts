import { mkdirSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("getTranslator", () => {
    beforeAll(() => {
        const dir = path.join(os.tmpdir(), `web-locales-${Date.now()}`);
        mkdirSync(path.join(dir, "locales", "ru"), { recursive: true });
        writeFileSync(path.join(dir, "locales", "ru", "main.json"), JSON.stringify({
            seo: { title: "Заголовок" },
            "Фраза. С точкой": "Перевод фразы",
            greeting: "Привет, {{name}}!",
            "category-offer": { "Заповедники и нац. парки": "Заповедники" },
        }));
        vi.spyOn(process, "cwd").mockReturnValue(dir);
    });

    it("берёт вложенный ключ, ключ-фразу с точкой и подставляет значения", async () => {
        const { getTranslator } = await import("../dictionary");
        const t = await getTranslator("ru", "main");
        expect(t("seo.title")).toBe("Заголовок");
        expect(t("Фраза. С точкой")).toBe("Перевод фразы");
        expect(t("greeting", { name: "Анна" })).toBe("Привет, Анна!");
    });

    it("вложенный ключ, в имени которого есть точка (как deepFind в i18next)", async () => {
        const { getTranslator } = await import("../dictionary");
        const t = await getTranslator("ru", "main");
        expect(t("category-offer.Заповедники и нац. парки")).toBe("Заповедники");
    });

    it("без перевода возвращает ключ, как i18next", async () => {
        const { getTranslator } = await import("../dictionary");
        const t = await getTranslator("ru", "missing-namespace");
        expect(t("Нет такого ключа")).toBe("Нет такого ключа");
    });
});
