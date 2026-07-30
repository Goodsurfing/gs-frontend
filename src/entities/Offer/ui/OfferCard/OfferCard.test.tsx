import {
    describe, it, expect, vi,
} from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ComponentProps } from "react";
import { renderWithProviders } from "@/test-utils";
import { OfferCard } from "./OfferCard";

const baseProps = {
    offerId: 1,
    isFavorite: false,
    locale: "ru" as const,
};

const renderCard = (props: Partial<ComponentProps<typeof OfferCard>>) => renderWithProviders(
    <MemoryRouter>
        <OfferCard {...baseProps} {...props} />
    </MemoryRouter>,
);

describe("OfferCard", () => {
    it("скрывает «Отзывов»/«Отправились», если их 0", () => {
        renderCard({ reviews: 0, went: 0 });

        expect(screen.queryByText(/Отзывов/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Отправились/)).not.toBeInTheDocument();
    });

    it("показывает только непустой счётчик", () => {
        renderCard({ reviews: 3, went: 0 });

        expect(screen.getByText(/Отзывов/)).toBeInTheDocument();
        expect(screen.queryByText(/Отправились/)).not.toBeInTheDocument();
    });

    it("показывает оба счётчика, если оба ненулевые", () => {
        renderCard({ reviews: 3, went: 5 });

        expect(screen.getByText(/Отзывов/)).toBeInTheDocument();
        expect(screen.getByText(/Отправились/)).toBeInTheDocument();
    });

    it("клик по карточке вызывает onSelect, а не переход по ссылке", () => {
        const onSelect = vi.fn();
        renderCard({ onSelect });

        fireEvent.click(screen.getByRole("button"));

        expect(onSelect).toHaveBeenCalledWith(1);
    });

    it("клик по «Подробнее» тоже вызывает onSelect (id должен попасть в URL до перехода)", () => {
        const onSelect = vi.fn();
        renderCard({ onSelect, link: "/ru/offer-personal/1" });

        fireEvent.click(screen.getByText("Подробнее"));

        expect(onSelect).toHaveBeenCalledWith(1);
    });

    it("клик по карточке без onSelect (списки в профиле/кабинете) ведёт на страницу вакансии", () => {
        renderWithProviders(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route
                        path="/"
                        element={<OfferCard {...baseProps} link="/ru/offers/1" />}
                    />
                    <Route path="/ru/offers/1" element={<div>Страница вакансии</div>} />
                </Routes>
            </MemoryRouter>,
        );

        fireEvent.click(screen.getByRole("button"));

        expect(screen.getByText("Страница вакансии")).toBeInTheDocument();
    });

    it("подсвечивает карточку, если isSelected=true", () => {
        const { container } = renderCard({ isSelected: true });

        expect(container.querySelector("[role=\"button\"]")?.className).toMatch(/selected/);
    });

    it("показывает бейдж «нет на карте», если hasLocation=false", () => {
        renderCard({ hasLocation: false });

        expect(screen.getByText("нет на карте")).toBeInTheDocument();
    });

    it("не показывает бейдж, если hasLocation не false (неизвестно/есть локация)", () => {
        renderCard({ hasLocation: true });
        expect(screen.queryByText("нет на карте")).not.toBeInTheDocument();

        renderCard({});
        expect(screen.queryByText("нет на карте")).not.toBeInTheDocument();
    });
});
