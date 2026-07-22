import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { TermsApplication } from "./TermsApplication";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

/**
 * Row: "явно можно подаваться... на даты в прошлом" — поле «Прибытие»
 * не получало min ни от вызывающего OfferApplication, ни от самого
 * TermsApplication, поэтому прошлые даты были доступны для выбора.
 */
describe("TermsApplication — дата прибытия не может быть в прошлом по умолчанию", () => {
    it("вчерашний день недоступен для выбора, если min не передан явно", () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

        const { container } = renderWithProviders(
            <MemoryRouter>
                <TermsApplication
                    locale="ru"
                    terms={{ start: dayAfterTomorrow, end: undefined }}
                    isSuccess={false}
                    onChange={() => {}}
                />
            </MemoryRouter>,
        );

        const yesterdayLabel = yesterday.toLocaleDateString("ru-RU", {
            month: "long", day: "numeric", year: "numeric",
        });
        const yesterdayAbbr = container.querySelector(`abbr[aria-label="${yesterdayLabel}"]`);
        expect(yesterdayAbbr).toBeTruthy();
        expect(yesterdayAbbr?.closest("button")).toBeDisabled();
    });
});
