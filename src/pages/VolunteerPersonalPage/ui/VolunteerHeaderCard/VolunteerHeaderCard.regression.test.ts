import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 65: у бейджа «member» на карточке волонтёра не
 * было подсказки, что означает эта иконка. Фикс: обёрнут в MUI Tooltip с
 * текстом «Верифицированный гудсёрфер». PR gs-frontend#331.
 *
 * GS-150: текст сноски называл только одну роль («гудсёрфер»), хотя тот
 * же значок стоит и у организаторов (HostlHeaderCard) — вынесено в общий
 * `MembershipVerifiedBadge` с ролью-нейтральным текстом «пользователь» +
 * ссылкой на /membership, используется и волонтёром, и хостом.
 *
 * Компонент слишком тяжёлый для полного рендер-теста (ProfileById,
 * AchievementModal, медали и т.д.) — проверяем исходник, что бейдж
 * не потерялся при рефакторинге.
 */
describe("VolunteerHeaderCard member badge (source regress-guard)", () => {
    it("иконка member рендерится через общий MembershipVerifiedBadge", () => {
        const tsxPath = join(__dirname, "VolunteerHeaderCard.tsx");
        const source = readFileSync(tsxPath, "utf-8");

        expect(source).toMatch(/import\s*{\s*MembershipVerifiedBadge\s*}\s*from\s*"@\/features\/MembershipVerifiedBadge"/);
        expect(source).toMatch(/isMember\s*&&\s*\(\s*<MembershipVerifiedBadge/);
    });
});

/**
 * Регресс-guard: раньше при отсутствии языков/города/страны показывались
 * многословные фразы вроде «Языки не были указаны» — рядом с меткой
 * «Языки:» это читалось как дублирование слова. Заменено на прочерк «—».
 */
describe("VolunteerHeaderCard пустые языки/локация (source regress-guard)", () => {
    it("не содержит многословных фраз «не указан(а/о)» для языков/города/страны", () => {
        const tsxPath = join(__dirname, "VolunteerHeaderCard.tsx");
        const source = readFileSync(tsxPath, "utf-8");

        expect(source).not.toMatch(/Языки не были указаны/);
        expect(source).not.toMatch(/Страна не указана/);
        expect(source).not.toMatch(/Город не указан/);
        expect(source).toMatch(/renderLanguages[\s\S]*?—/);
        expect(source).toMatch(/renderLocation[\s\S]*?—/);
    });
});
