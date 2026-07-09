import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 41: сообщение об ошибке удаления вакансии не
 * объясняло причину («Вакансию удалить нельзя»), и старая ошибка не
 * сбрасывалась при повторной попытке удалить другую вакансию. Фикс:
 * внятный текст «Нельзя удалить вакансию, по которой есть заявки» +
 * setDeleteOfferError(false) в начале handleDeleteClick.
 *
 * Страница слишком тяжёлая для полного рендер-теста (4 RTK Query хука,
 * пагинация, список офферов) — проверяем исходник и переводы.
 */
describe("HostOffersPage delete error (regress-guard)", () => {
    it("текст ошибки объясняет причину, а не просто 'нельзя'", () => {
        const ruHost = JSON.parse(
            readFileSync(join(__dirname, "../../../../../public/locales/ru/host.json"), "utf-8"),
        );

        expect(ruHost.hostOffers["Вакансию удалить нельзя"]).toBe(
            "Нельзя удалить вакансию, по которой есть заявки",
        );
    });

    it("handleDeleteClick сбрасывает предыдущую ошибку перед выбором новой вакансии", () => {
        const source = readFileSync(join(__dirname, "HostOffersPage.tsx"), "utf-8");
        const handler = source.split("const handleDeleteClick")[1]?.split("};")[0] ?? "";

        expect(handler).toMatch(/setDeleteOfferError\(false\)/);
    });
});
