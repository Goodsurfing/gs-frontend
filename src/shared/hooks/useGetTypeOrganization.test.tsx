import {
    describe, it, expect, vi,
} from "vitest";
import { renderHook } from "@testing-library/react";
import { useGetTypeOrganization } from "./useGetTypeOrganization";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

/**
 * Регресс-guard для row 66: в форме создания/редактирования организации
 * не было пункта «НКО» (union OrganizationType, список hostTypes,
 * getTranslate). PR gs-frontend#330.
 */
describe("useGetTypeOrganization", () => {
    it("список типов организации содержит «НКО»", () => {
        const { result } = renderHook(() => useGetTypeOrganization());

        expect(result.current.hostTypes.map((t) => t.value)).toContain("НКО");
    });

    it("getTranslate переводит «НКО», а не возвращает значение как есть по умолчанию", () => {
        const { result } = renderHook(() => useGetTypeOrganization());

        expect(result.current.getTranslate("НКО")).toBe("hostDescription.НКО");
    });
});
