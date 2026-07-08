import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 58: крестик удаления языка/навыка был слишком
 * мелким и малоконтрастным (14px, text-secondary-2) — фикс увеличил его
 * до 18px, сменил цвет на text-primary-2 и добавил hover-подсветку
 * (error-color). PR gs-frontend#331.
 */
describe("VolunteerLanguage delete icon (SCSS regрess-guard)", () => {
    it("крестик удаления остаётся крупным (18px) и не откатывается на старый цвет", () => {
        const scssPath = join(__dirname, "VolunteerLanguage.module.scss");
        const scss = readFileSync(scssPath, "utf-8");
        const deleteIconBlock = scss.split(".deleteIcon")[1]?.split("}")[0] ?? "";

        expect(deleteIconBlock).toMatch(/width:\s*18px/);
        expect(deleteIconBlock).toMatch(/height:\s*18px/);
        expect(deleteIconBlock).toMatch(/fill:\s*var\(--text-primary-2\)/);
        expect(deleteIconBlock).toMatch(/&:hover/);
    });
});
