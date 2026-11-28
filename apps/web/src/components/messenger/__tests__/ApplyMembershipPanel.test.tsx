import { readFileSync } from "node:fs";
import { join } from "node:path";

import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ApplyMembershipPanel, ApplyRestoredNote } from "../ApplyMembershipPanel";

const locales = join(__dirname, "../../../../../../public/locales");
const dict = (locale: string) => JSON.parse(readFileSync(join(locales, locale, "messenger.json"), "utf8")) as { apply: { membership: Record<string, string>; return: Record<string, string> } };

const labels = dict("ru").apply.membership as unknown as Parameters<typeof ApplyMembershipPanel>[0]["labels"];

describe("отклик упёрся в членство (GS-341)", () => {
    it("лимит: заголовок, объяснение, что заполненное сохранится, и кнопка «Оформить членство» на страницу членства", () => {
        const html = renderToString(<ApplyMembershipPanel reason="limit" href="/membership" onGo={() => undefined} labels={labels} />);
        expect(html).toContain('role="alert"');
        expect(html).toContain("Чтобы откликнуться, нужно членство");
        expect(html).toContain("Бесплатные отклики в этом году закончились");
        expect(html).toContain("сохранится");
        expect(html).toMatch(/<a href="\/membership"[^>]*>Оформить членство<\/a>/);
    });

    it("вакансия только для участников с членством — свой текст", () => {
        const html = renderToString(<ApplyMembershipPanel reason="verified" href="/membership" onGo={() => undefined} labels={labels} />);
        expect(html).toContain("только от участников с членством");
        expect(html).not.toContain("Бесплатные отклики");
    });

    it("восстановленный черновик — подсказка проверить и отправить", () => {
        expect(renderToString(<ApplyRestoredNote text={labels.restored} />)).toContain('role="status"');
    });

    it("в новых текстах нет цен и сравнений (Гудсёрфинг — НКО), во всех языках", () => {
        for (const locale of ["ru", "en", "es"]) {
            const { membership, return: back } = dict(locale).apply;
            const texts = [...Object.values(membership), ...Object.values(back)].join(" ");
            expect(Object.keys(membership).sort()).toEqual(["cta", "limit", "restored", "saved", "title", "verified"]);
            expect(Object.keys(back).sort()).toEqual(["cta", "text", "textNoTitle", "title"]);
            expect(texts).not.toMatch(/₽|руб|\$|€|\d{3}|стоит|cost|price|precio/i);
            expect(back.text).toContain("{title}");
        }
    });
});
