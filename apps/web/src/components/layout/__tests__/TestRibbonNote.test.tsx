import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/membership" }));

import { TEST_CARD } from "@/lib/testBanner";

import { TestRibbonNote } from "../TestRibbonNote";

describe("полоса «Тестовая версия»: тестовая карта", () => {
    it("«Мир» 2200 0000 0000 0004 — и на компьютере, и на телефоне; старой 5555… нет", () => {
        const html = renderToString(<TestRibbonNote bot="gs_bot" />);
        expect(TEST_CARD).toBe("2200 0000 0000 0004");
        // три надписи: полная (широкий экран), короче (планшет) и короткая (телефон)
        expect(html.split(TEST_CARD)).toHaveLength(4);
        expect(html).toContain("3-D Secure");
        expect(html).not.toContain("5555");
        expect(html).toContain("Сообщить о проблеме");
    });
});
