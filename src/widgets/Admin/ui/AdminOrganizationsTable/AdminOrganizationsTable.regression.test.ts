import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 111: список организаций в админке сортировался по
 * умолчанию по id:asc (старые сверху). Дефолт сменён на created:desc,
 * который на бэке проксируется через id (UUIDv7 — монотонно по времени),
 * т.к. Organization не хранит отдельного поля даты регистрации.
 *
 * Компонент слишком тяжёлый для полного рендер-теста — проверяем исходник.
 */
describe("AdminOrganizationsTable default sort (regress-guard)", () => {
    it("сортировка по умолчанию — CreatedDesc (новые сверху), а не IdAsc", () => {
        const source = readFileSync(join(__dirname, "AdminOrganizationsTable.tsx"), "utf-8");

        expect(source).not.toMatch(/sort:\s*AdminSort\.IdAsc/);
        expect(source.match(/AdminSort\.CreatedDesc/g)?.length).toBeGreaterThanOrEqual(2);
    });

    it("есть фильтр по статусу членства и колонка «Членство» (rows 112/113/115)", () => {
        const source = readFileSync(join(__dirname, "AdminOrganizationsTable.tsx"), "utf-8");

        expect(source).toMatch(/membershipStatus/);
        expect(source).toMatch(/field:\s*"isMembership"/);
        expect(source).toMatch(/field:\s*"endMembership"/);
    });
});
