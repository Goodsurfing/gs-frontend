import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-guard для row 111: список пользователей в админке сортировался
 * по умолчанию по id:asc — так как id это UUIDv7 (монотонно по времени),
 * это технически не «рандомно», но и не то, чего ожидает админ («последние
 * регистрации вверху»). Дефолт сортировки сменён на created:desc.
 *
 * Компонент слишком тяжёлый для полного рендер-теста (RTK Query, DataGrid,
 * несколько модалок) — проверяем исходник.
 */
describe("AdminUsersTable default sort (regress-guard)", () => {
    it("сортировка по умолчанию — CreatedDesc (новые сверху), а не IdAsc", () => {
        const source = readFileSync(join(__dirname, "AdminUsersTable.tsx"), "utf-8");

        expect(source).not.toMatch(/sort:\s*AdminSort\.IdAsc/);
        expect(source.match(/AdminSort\.CreatedDesc/g)?.length).toBeGreaterThanOrEqual(2);
    });

    it("есть фильтр по статусу членства (membershipStatus)", () => {
        const source = readFileSync(join(__dirname, "AdminUsersTable.tsx"), "utf-8");

        expect(source).toMatch(/membershipStatus/);
    });
});
