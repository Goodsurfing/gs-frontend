import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
});
