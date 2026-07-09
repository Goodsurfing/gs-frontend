import {
    describe, it, expect, vi,
} from "vitest";
import { renderHook } from "@testing-library/react";
import { useBenefitsData } from "./Benefits.data";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

/**
 * Регресс-guard для row 54: первый пункт «Наши преимущества» на главной
 * назывался «Бесплатно» (устаревший, вводящий в заблуждение текст —
 * членство на GoodSurfing платное). Заменён на «Прямой контакт».
 * PR gs-frontend#331.
 */
describe("useBenefitsData", () => {
    it("первый пункт называется «Прямой контакт», а не «Бесплатно»", () => {
        const { result } = renderHook(() => useBenefitsData());

        expect(result.current[0].title).toBe("Прямой контакт");
        expect(result.current.map((b) => b.title)).not.toContain("Бесплатно");
    });
});
