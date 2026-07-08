import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-тест для PR gs-frontend#348 (v0.1.25): фиксированная шапка меню
 * наезжала на sticky-подменю при скролле на нескольких страницах.
 * offer/host/volunteer-personal починили раньше (c2ce9312, 23.06), здесь
 * докатили ещё 2 пропущенные страницы — HostPersonalPage (top 91px → 6.5rem)
 * и DonationPersonalPage (content padding-top 36px → 92px).
 */
describe("Наложение шапки при скролле — sticky-офсеты", () => {
    it("HostPersonalPage: .navMenu top = 6.5rem, а не старые 91px", () => {
        const scss = readFileSync(
            join(__dirname, "HostPersonalPage.module.scss"),
            "utf-8",
        );

        const navMenuBlock = scss.match(/\.navMenu\s*{[^}]*}/)?.[0] ?? "";
        expect(navMenuBlock).toMatch(/top:\s*6\.5rem/);
        expect(navMenuBlock).not.toMatch(/top:\s*91px/);
    });

    it("DonationPersonalPage: .content padding-top = 92px, а не старые 36px", () => {
        const scss = readFileSync(
            join(
                __dirname,
                "../../../DonationPersonalPage/ui/DonationPersonalPage/DonationPersonalPage.module.scss",
            ),
            "utf-8",
        );

        const contentBlock = scss.match(/\.content\s*{[^}]*}/)?.[0] ?? "";
        expect(contentBlock).toMatch(/padding:\s*92px/);
        expect(contentBlock).not.toMatch(/padding:\s*36px/);
    });
});
