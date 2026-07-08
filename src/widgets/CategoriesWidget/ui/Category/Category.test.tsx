import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { readFileSync } from "fs";
import { join } from "path";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { Category } from "./Category";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

/**
 * Регресс-тест для PR gs-frontend#348 (v0.1.25): на /categories заголовки
 * категорий переносились некорректно (были кракозябры вместо "не-" → "нес-")
 * — в Category.module.scss был активен hyphens: auto без указания lang на
 * элементе, из-за чего браузер не мог выбрать словарь переноса. Та же
 * ошибка чинилась раньше в CategoryCard (PR #319), но здесь была пропущена.
 */
describe("Category", () => {
    it("заголовок категории получает lang для корректного переноса", () => {
        renderWithProviders(
            <MemoryRouter>
                <Category
                    title="Заповедники и нац. парки"
                    vacancyNumber={5}
                    link="/offers-map?category=2"
                    locale="ru"
                />
            </MemoryRouter>,
        );

        const title = screen.getByText("Заповедники и нац. парки");
        expect(title).toHaveAttribute("lang", "ru");
    });

    it("SCSS больше не использует hyphens: auto без lang (регресс-ловушка)", () => {
        const scssPath = join(__dirname, "Category.module.scss");
        const scss = readFileSync(scssPath, "utf-8");

        expect(scss).not.toMatch(/hyphens:\s*auto/);
        expect(scss).toMatch(/word-break:\s*break-word/);
    });
});
