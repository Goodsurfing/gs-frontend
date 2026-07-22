import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { OfferApplication } from "./OfferApplication";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const OFFER_DATA = {
    id: 7205,
    title: "Тестовая вакансия",
    shortDescription: "Кратко",
    address: "Где-то",
    status: "active" as const,
    acceptedApplicationsCount: 0,
    averageRating: 0,
    reviewsCount: 0,
    imagePath: "",
    categoryName: "",
};

const renderOfferApplication = (isClosed: boolean) => renderWithProviders(
    <MemoryRouter>
        <OfferApplication
            offerData={OFFER_DATA}
            isHost={false}
            username="Иван Иванов"
            isClosed={isClosed}
            terms={{ start: undefined, end: undefined }}
            onChange={() => {}}
        />
    </MemoryRouter>,
);

/**
 * До фикса заголовок «Вы подали заявку на данную вакансию» показывался
 * всегда, даже пока даты ещё не выбраны и заявка реально не отправлена —
 * это путало пользователей (row: "почему кнопка неактивна, если я подал
 * заявку" — а заявка на самом деле ещё не была подана).
 */
describe("OfferApplication — заголовок соответствует реальному статусу заявки", () => {
    it("даты не выбраны — заголовок просит их указать, а не утверждает, что заявка уже подана", () => {
        renderOfferApplication(false);

        expect(screen.getByText("Укажите даты, чтобы отправить заявку")).toBeInTheDocument();
        expect(screen.queryByText("Вы подали заявку на данную вакансию")).not.toBeInTheDocument();
    });

    it("заявка подтверждена (isClosed) — заголовок отражает, что заявка отправлена", () => {
        renderOfferApplication(true);

        expect(screen.getByText((_, el) => el?.textContent === "Иван Иванов подал заявку на вакансию")).toBeInTheDocument();
        expect(screen.queryByText("Укажите даты, чтобы отправить заявку")).not.toBeInTheDocument();
    });
});
