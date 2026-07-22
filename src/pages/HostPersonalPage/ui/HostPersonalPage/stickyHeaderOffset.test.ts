import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * Регресс-тест для PR gs-frontend#348 (v0.1.25): фиксированная шапка меню
 * наезжала на sticky-подменю при скролле на нескольких страницах.
 * offer/host/volunteer-personal починили раньше (c2ce9312, 23.06), здесь
 * докатили ещё 2 пропущенные страницы — HostPersonalPage (top 91px → 6.5rem)
 * и DonationPersonalPage (content padding-top 36px → 92px).
 *
 * PR gs-frontend#408 (18.07): статичный top: 6.5rem не учитывал появление
 * промо-баннера под шапкой (UNDER_HEADER_ALL_PAGES) — sticky-подменю снова
 * наезжало. MainHeader теперь публикует свою реальную высоту в CSS-переменную
 * --header-offset (ResizeObserver), .navMenu использует
 * top: calc(var(--header-offset, 6.5rem) + 12px) — 6.5rem остаётся
 * запасным хардкодом внутри var(), а не самостоятельным значением.
 */
describe("Наложение шапки при скролле — sticky-офсеты", () => {
    it("HostPersonalPage: .navMenu top использует динамический --header-offset с фолбэком 6.5rem", () => {
        const scss = readFileSync(
            join(__dirname, "HostPersonalPage.module.scss"),
            "utf-8",
        );

        const navMenuBlock = scss.match(/\.navMenu\s*{[^}]*}/)?.[0] ?? "";
        expect(navMenuBlock).toMatch(/top:\s*calc\(var\(--header-offset,\s*6\.5rem\)/);
        expect(navMenuBlock).not.toMatch(/top:\s*91px/);
        // Старый статичный top (без var/calc) должен остаться в прошлом —
        // именно он не учитывал появление промо-баннера (PR #408).
        expect(navMenuBlock).not.toMatch(/top:\s*6\.5rem\s*;/);
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
