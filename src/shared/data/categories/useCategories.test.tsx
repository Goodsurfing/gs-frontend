import {
    describe, it, expect, vi,
} from "vitest";
import { renderHook } from "@testing-library/react";
import { useCategories } from "./index";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key.replace("category-offer.", "") }),
}));

/**
 * Регресс-тест для PR gs-frontend#350 (v0.1.27): в мёртвом коде-ловушке
 * (массив tags) лейбл категории "Заповедники и нац. парки" был указан
 * неверно как "Заповедники и парки" — расходился с реальным API. Живые
 * страницы (/categories, /offers-map, карточки) уже показывали верный текст,
 * но ловушка могла всплыть при будущем использовании tags/getTranslation.
 */
describe("useCategories", () => {
    it("tags содержит правильный лейбл \"Заповедники и нац. парки\"", () => {
        const { result } = renderHook(() => useCategories());

        const reservesTag = result.current.tags.find((tag) => tag.value === "reserves_and_parks");
        expect(reservesTag?.text).toBe("Заповедники и нац. парки");
    });

    it("getTranslation резолвит актуальный (API) лейбл категории верно", () => {
        const { result } = renderHook(() => useCategories());

        expect(result.current.getTranslation("Заповедники и нац. парки")).toBe("Заповедники и нац. парки");
    });

    it("getColorByCategory находит цвет по value, а не по устаревшему тексту", () => {
        const { result } = renderHook(() => useCategories());

        expect(result.current.getColorByCategory("reserves_and_parks")).toBe("#C3A3E9");
    });
});
