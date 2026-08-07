import {
    describe, it, expect, vi,
} from "vitest";
import { renderHook } from "@testing-library/react";
import { useSubmenuItems } from "./submenuData";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string, fallback?: string) => fallback ?? key }),
}));

/**
 * Симметричный регресс-guard к submenuData.test.ts на волонтёрской
 * странице (GS-84) — та же навигация по id-якорям, тот же класс бага
 * возможен, если кто-то скопирует пункт меню и забудет поменять id.
 */
describe("useSubmenuItems (host)", () => {
    it("у всех пунктов меню разные id (иначе клик ведёт не туда)", () => {
        const { result } = renderHook(() => useSubmenuItems());

        const ids = result.current.submenuItems.map((item) => item.id);
        const uniqueIds = new Set(ids);

        expect(uniqueIds.size).toBe(ids.length);
    });

    it("у каждого пункта есть непустой id и текст", () => {
        const { result } = renderHook(() => useSubmenuItems());

        result.current.submenuItems.forEach((item) => {
            expect(item.id).toBeTruthy();
            expect(item.text).toBeTruthy();
        });
    });
});
