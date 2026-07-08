import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhyMembership } from "./WhyMembership";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (_key: string, fallback?: string) => fallback ?? _key }),
}));

/**
 * Регресс-тест: WhyMembership ссылался на несуществующий публичный путь
 * /images/membership/community.jpg (404 на странице членства). Картинка
 * должна подключаться бандл-импортом (резолвится сборщиком в реальный
 * хэшированный ассет), а не хардкодиться строкой на public-путь.
 */
describe("WhyMembership", () => {
    it("рендерит картинку с валидным резолвнутым src (не пустым и не старым битым путём)", () => {
        render(<WhyMembership />);

        const image = screen.getByAltText("Волонтёры Гудсёрфинга");
        const src = image.getAttribute("src");

        expect(src).toBeTruthy();
        expect(src).not.toBe("/images/membership/community.jpg");
    });
});
