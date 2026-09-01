import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { GoodsurfingStats } from "./GoodsurfingStats";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseGetAbouProjectPageInfoQuery = vi.fn();
vi.mock("@/entities/Admin", () => ({
    useGetAbouProjectPageInfoQuery: () => mockUseGetAbouProjectPageInfoQuery(),
}));

/**
 * Чек-лист правок: на главной не было реальных цифр из БД (волонтёры,
 * страны, вакансии, отзывы) — только на /about-project. Виджет
 * переиспользует тот же today-эндпоинт.
 */
describe("GoodsurfingStats", () => {
    it("показывает реальные цифры из today", () => {
        mockUseGetAbouProjectPageInfoQuery.mockReturnValue({
            data: {
                today: {
                    volunteerCount: 1234,
                    vacancyCountryCount: 42,
                    vacancyCount: 567,
                    reviewCount: 89,
                },
            },
            isLoading: false,
            isError: false,
        });

        render(<GoodsurfingStats />);

        expect(screen.getByText("1234")).toBeInTheDocument();
        expect(screen.getByText("42")).toBeInTheDocument();
        expect(screen.getByText("567")).toBeInTheDocument();
        expect(screen.getByText("89")).toBeInTheDocument();
    });

    it("ничего не рендерит во время загрузки", () => {
        mockUseGetAbouProjectPageInfoQuery.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        const { container } = render(<GoodsurfingStats />);

        expect(container).toBeEmptyDOMElement();
    });

    it("ничего не рендерит при ошибке запроса, не показывает нули", () => {
        mockUseGetAbouProjectPageInfoQuery.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        const { container } = render(<GoodsurfingStats />);

        expect(container).toBeEmptyDOMElement();
    });
});
