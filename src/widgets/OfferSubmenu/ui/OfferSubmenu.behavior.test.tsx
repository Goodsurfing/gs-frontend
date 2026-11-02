import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { mockedOffersData } from "@/entities/Offer/model/data/mockedOfferData";
import { OfferSubmenu } from "./OfferSubmenu";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const baseOffer = mockedOffersData[0];

const renderSubmenu = (requiresMembershipToParticipate: boolean) => renderWithProviders(
    <MemoryRouter>
        <OfferSubmenu
            offerData={{
                ...baseOffer,
                canParticipate: !requiresMembershipToParticipate,
                requiresMembershipToParticipate,
            }}
            isVolunteer
        />
    </MemoryRouter>,
);

/**
 * GS-169: кнопка «Участвовать» раньше не давала понять, что заявку всё равно
 * отклонят из-за исчерпанного бесплатного лимита, — отправлять приходилось
 * вслепую. Теперь при requiresMembershipToParticipate=true должна появляться
 * предложение членства с ценой и кнопкой на /membership.
 */
describe("OfferSubmenu — подсказка про исчерпанный лимит заявок", () => {
    it("показывает текст и ссылку на /membership, когда лимит исчерпан", () => {
        renderSubmenu(true);

        const upsell = screen.getByRole("note", { name: "personalOffer.Бесплатные отклики на этот год закончились" });
        // Цена — из тарифов, пока они не загрузились — 990 ₽
        expect(upsell).toHaveTextContent("personalOffer.Членство — {{price}} ₽ на год: отклики без ограничений");
        const link = within(upsell).getByRole("link", { name: "personalOffer.Оформить членство" });
        expect(link).toHaveAttribute("href", expect.stringContaining("/membership"));
    });

    it("не показывает подсказку, когда участие доступно", () => {
        renderSubmenu(false);

        expect(screen.queryByRole("note", { name: "personalOffer.Бесплатные отклики на этот год закончились" })).not.toBeInTheDocument();
    });
});
