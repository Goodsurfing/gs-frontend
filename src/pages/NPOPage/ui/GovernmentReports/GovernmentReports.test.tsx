import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GovernmentReports } from "./GovernmentReports";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, fallbackOrOptions?: string | Record<string, unknown>) => {
            if (typeof fallbackOrOptions === "string") return fallbackOrOptions;
            if (fallbackOrOptions && typeof fallbackOrOptions === "object") {
                return key.replace(/\{\{(\w+)\}\}/g, (_, token) => String(fallbackOrOptions[token] ?? ""));
            }
            return key;
        },
    }),
}));

/**
 * Регресс-guard (ROW 93): отчёты Минюст и о деятельности «пропали» —
 * PDF физически лежат в public/assets/docs/npo, но ни один компонент
 * страницы /npo на них не ссылался. GovernmentReports возвращает обе
 * секции со ссылками на существующие файлы.
 */
describe("GovernmentReports", () => {
    it("рендерит обе секции отчётов", () => {
        render(<MemoryRouter><GovernmentReports /></MemoryRouter>);
        expect(screen.getByText("Отчёты Минюст")).toBeInTheDocument();
        expect(screen.getByText("Отчёты о деятельности")).toBeInTheDocument();
    });

    it("ссылки ведут на существующие PDF в /assets/docs/npo (с URL-кодированием)", () => {
        render(<MemoryRouter><GovernmentReports /></MemoryRouter>);
        const links = screen.getAllByRole("link");
        // 6 отчётов Минюст (2018–2023) + 7 о деятельности (2019–2025) = 13
        expect(links).toHaveLength(13);
        links.forEach((link) => {
            const href = link.getAttribute("href") ?? "";
            expect(href).toMatch(/^\/assets\/docs\/npo\/.+\.pdf$/i);
            // кириллица/пробелы должны быть закодированы (нет сырых пробелов)
            expect(href).not.toContain(" ");
        });
    });
});
