import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialRibbon } from "./SocialRibbon";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

/** GS-187: плашка со ссылками на соцсети на главной. */
describe("SocialRibbon", () => {
    it("показывает призыв и ссылки на Telegram, MAX и VK в новой вкладке", () => {
        render(<SocialRibbon />);

        expect(screen.getByText("Подписывайтесь на наши соцсети")).toBeTruthy();
        const links = screen.getAllByRole("link");
        expect(links.map((a) => a.getAttribute("href"))).toEqual([
            "https://t.me/goodsurfing",
            "https://max.ru/goodsurfing",
            "https://vk.com/goodsurfing",
        ]);
        links.forEach((a) => {
            expect(a.getAttribute("target")).toBe("_blank");
            expect(a.getAttribute("rel")).toContain("noreferrer");
        });
        expect(screen.getByLabelText("Telegram")).toBeTruthy();
    });
});
