import {
    describe, it, expect, vi,
} from "vitest";
import { renderHook } from "@testing-library/react";
import { getFullName, useGetFullName } from "./getFullName";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

/**
 * Регресс-guard для row 103: getFullName() (для не-React adapter'ов) и
 * getFullName() из useGetFullName() (для компонентов) раньше отдавали ФИО в
 * противоположном порядке — «Фамилия Имя» vs «Имя Фамилия» — из-за чего
 * одинаковые данные выглядели по-разному на разных страницах (блог/видео/
 * новости/админ-таблицы vs отзывы/чат/команда).
 */
describe("getFullName — порядок Имя/Фамилия", () => {
    it("стандалон-функция отдаёт «Имя Фамилия»", () => {
        expect(getFullName("Иван", "Иванов")).toBe("Иван Иванов");
    });

    it("хук отдаёт «Имя Фамилия»", () => {
        const { result } = renderHook(() => useGetFullName());
        expect(result.current.getFullName("Иван", "Иванов")).toBe("Иван Иванов");
    });

    it("стандалон-функция и хук согласованы для одних и тех же данных", () => {
        const { result } = renderHook(() => useGetFullName());

        expect(getFullName("Пётр", "Петров")).toBe(result.current.getFullName("Пётр", "Петров"));
    });
});
