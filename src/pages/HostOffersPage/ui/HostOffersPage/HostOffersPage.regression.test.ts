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

/**
 * GS-172: до фикса превышение бесплатного лимита вакансий при повторной
 * публикации/открытии на /host/my-offers падало полностью без обратной
 * связи — catch-блок обрабатывал только selectedBtnOffer === "delete",
 * ошибку toggle-status молча проглатывал. Фикс: показывать попап со
 * ссылкой на /membership, см. isVacancyLimitExceededError в getErrorText.tsx.
 */
describe("HostOffersPage vacancy limit popup (regress-guard)", () => {
    it("handleConfirmClick открывает попап членства при vacancy_limit_exceeded", () => {
        const source = readFileSync(join(__dirname, "HostOffersPage.tsx"), "utf-8");
        const handler = source.split("const handleConfirmClick")[1]?.split("};")[0] ?? "";

        expect(handler).toMatch(/isVacancyLimitExceededError\(err\)/);
        expect(handler).toMatch(/setIsVacancyLimitModalOpen\(true\)/);
    });

    it("попап рендерит MemberBanner со ссылкой на /membership", () => {
        const source = readFileSync(join(__dirname, "HostOffersPage.tsx"), "utf-8");

        expect(source).toMatch(/isVacancyLimitModalOpen && \(/);
        expect(source).toMatch(/<MemberBanner/);
    });
});
