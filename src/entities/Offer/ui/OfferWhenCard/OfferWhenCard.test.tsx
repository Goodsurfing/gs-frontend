import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { OfferWhenCard } from "./OfferWhenCard";
import { OfferWhen } from "../../model/types/offerWhen";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const baseOfferWhen: OfferWhen = {
    periods: [],
    isFullYearAcceptable: false,
    isApplicableAtTheEnd: false,
    durationMinDays: 0,
    durationMaxDays: 0,
    applicationEndDate: null,
};

/**
 * Регресс-guard: durationMinDays/durationMaxDays = 0 у вакансии обычно
 * означает "не указано" (не заполнено при создании/переносе), а не то,
 * что минимальный/максимальный срок участия — буквально ноль дней.
 * Раньше карточка молча выводила "0", что выглядело как баг.
 */
describe("OfferWhenCard", () => {
    it("показывает 'не указано' вместо 0 для минимума/максимума дней", () => {
        renderWithProviders(
            <OfferWhenCard offerWhen={baseOfferWhen} />,
        );

        expect(screen.getAllByText("personalOffer.notSpecified")).toHaveLength(2);
        expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("показывает реальные значения дней, если они больше нуля", () => {
        renderWithProviders(
            <OfferWhenCard
                offerWhen={{ ...baseOfferWhen, durationMinDays: 7, durationMaxDays: 30 }}
            />,
        );

        expect(screen.getByText("7")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();
        expect(screen.queryByText("personalOffer.notSpecified")).not.toBeInTheDocument();
    });
});
