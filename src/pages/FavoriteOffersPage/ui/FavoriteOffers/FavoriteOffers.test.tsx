import React from "react";
import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { FavoriteOffers } from "./FavoriteOffers";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const { mockFavorites, mockToggle } = vi.hoisted(() => ({
    mockFavorites: vi.fn(),
    mockToggle: vi.fn(),
}));

vi.mock("@/entities/Offer", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/entities/Offer")>();
    return {
        ...actual,
        useGetFavoriteOffersQuery: mockFavorites,
        useFavoriteOffers: () => ({
            enabled: true,
            isFavorite: () => true,
            toggleFavorite: mockToggle,
        }),
    };
});

const offer = {
    id: 7219,
    status: "active",
    title: "Работа на теплоходе",
    shortDescription: "Коротко",
    image: null,
    categories: [{ id: 1, name: "farm" }],
    address: "Россия, Пермь",
    acceptedApplicationsCount: 3,
    averageRating: 5,
    reviewsCount: 2,
};

const renderPage = () => renderWithProviders(
    <MemoryRouter>
        <FavoriteOffers />
    </MemoryRouter>,
);

/**
 * Страница «Избранное» до gs-backend #407 была заглушкой: всегда показывала
 * «Вы пока не добавили…», даже если что-то было отмечено.
 */
describe("FavoriteOffers", () => {
    beforeEach(() => {
        mockFavorites.mockReset();
        mockToggle.mockReset();
    });

    it("показывает избранные вакансии с отмеченным сердечком", () => {
        mockFavorites.mockReturnValue({
            data: { data: [offer], pagination: { page: 1, limit: 100, total: 1 } },
            isLoading: false,
        });

        const { container } = renderPage();

        expect(screen.getByText("Работа на теплоходе")).toBeTruthy();
        expect(screen.queryByText(/Вы пока не добавили/)).toBeNull();
        const heart = container.querySelector("[class*=favorite]");
        expect(heart).toBeTruthy();
        fireEvent.click(heart!);
        expect(mockToggle).toHaveBeenCalledWith(7219);
    });

    it("пустое избранное — приглашение посмотреть вакансии", () => {
        mockFavorites.mockReturnValue({
            data: { data: [], pagination: { page: 1, limit: 100, total: 0 } },
            isLoading: false,
        });

        renderPage();

        expect(screen.getByText(/Вы пока не добавили/)).toBeTruthy();
    });
});
