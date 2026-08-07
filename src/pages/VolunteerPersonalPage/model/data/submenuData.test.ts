import {
    describe, it, expect, vi,
} from "vitest";
import { renderHook } from "@testing-library/react";
import { useSubmenuVolunteerItems } from "./submenuData";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string, fallback?: string) => fallback ?? key }),
}));

/**
 * Регресс-guard (GS-84): пункт "Умения" был заведён с тем же id="1", что
 * и "О себе" — клик по нему прокручивал не к своей секции (у которой
 * вообще не было якоря), а туда же, куда и "О себе". Submenu/Anchor
 * ищут секцию по id через document.getElementById(id), так что
 * дублирующийся id всегда означает сломанную навигацию для одного из
 * пунктов.
 */
describe("useSubmenuVolunteerItems", () => {
    it("у всех пунктов меню разные id (иначе клик ведёт не туда)", () => {
        const { result } = renderHook(() => useSubmenuVolunteerItems());

        const ids = result.current.submenuItems.map((item) => item.id);
        const uniqueIds = new Set(ids);

        expect(uniqueIds.size).toBe(ids.length);
    });

    it("у каждого пункта есть непустой id и текст", () => {
        const { result } = renderHook(() => useSubmenuVolunteerItems());

        result.current.submenuItems.forEach((item) => {
            expect(item.id).toBeTruthy();
            expect(item.text).toBeTruthy();
        });
    });
});
