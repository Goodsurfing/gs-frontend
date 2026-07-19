import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { PersonalCard } from "./PersonalCard";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const baseProps = {
    offerId: "42",
    title: "Работа в Закане",
    canEdit: false,
    canParticipate: true,
    textParticipate: null,
    status: "active" as const,
    isVolunteer: true,
};

const renderCard = (reviewsCount: number, rating: number) => renderWithProviders(
    <MemoryRouter>
        <PersonalCard {...baseProps} reviewsCount={reviewsCount} rating={rating} />
    </MemoryRouter>,
);

describe("PersonalCard — рейтинг без отзывов", () => {
    it("с отзывами показывает счётчик и звёздный рейтинг", () => {
        renderCard(5, 4.8);

        expect(screen.getByText(
            (_, element) => element?.textContent === "Кол-во отзывов: 5",
        )).toBeInTheDocument();
        expect(screen.getByText("4.8")).toBeInTheDocument();
    });

    it("без отзывов показывает «Пока нет отзывов» вместо «0 ⭐» — не выглядит как плохой рейтинг", () => {
        renderCard(0, 0);

        expect(screen.getByText("Пока нет отзывов")).toBeInTheDocument();
        expect(screen.queryByText("Кол-во отзывов:")).not.toBeInTheDocument();
        // Числа "0" из рейтинга/счётчика в DOM быть не должно вообще
        expect(screen.queryByText("0")).not.toBeInTheDocument();
    });
});
