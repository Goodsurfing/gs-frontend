import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 65: у бейджа «member» на карточке волонтёра не
 * было подсказки, что означает эта иконка. Фикс: обёрнут в MUI Tooltip с
 * текстом «Верифицированный гудсёрфер». PR gs-frontend#331.
 *
 * Компонент слишком тяжёлый для полного рендер-теста (ProfileById,
 * AchievementModal, медали и т.д.) — проверяем исходник, что Tooltip
 * не потерялся при рефакторинге.
 */
describe("VolunteerHeaderCard member badge tooltip (source regress-guard)", () => {
    it("иконка member обёрнута в Tooltip с текстом «Верифицированный гудсёрфер»", () => {
        const tsxPath = join(__dirname, "VolunteerHeaderCard.tsx");
        const source = readFileSync(tsxPath, "utf-8");

        expect(source).toMatch(/import\s*{\s*Tooltip\s*}\s*from\s*"@mui\/material"/);

        const memberIconBlock = source.split("alt=\"member\"")[0]?.slice(-400) ?? "";
        expect(memberIconBlock).toMatch(/<Tooltip/);
        expect(memberIconBlock).toMatch(/Верифицированный гудсёрфер/);
    });
});
