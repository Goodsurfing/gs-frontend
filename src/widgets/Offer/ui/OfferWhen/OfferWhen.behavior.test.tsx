import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { OfferWhen } from "./OfferWhen";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

// OfferWhenForm — составная форма (слайдер периодов/дат/настроек) без
// самостоятельной ценности для теста виджета — стабим, проверяем логику
// OfferWhen: загрузка/адаптация данных вакансии, сохранение, тост.
vi.mock("@/features/Offer", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/features/Offer")>();
    return {
        ...actual,
        OfferWhenForm: ({ isLoadingGetWhenData, isLoadingUpdateWhenData, onComplete }: any) => (
            <button
                type="button"
                disabled={isLoadingGetWhenData || isLoadingUpdateWhenData}
                onClick={() => onComplete({
                    periods: [],
                    participationPeriod: [3, 14],
                    endSettings: { applicationEndDate: null },
                    timeSettings: { isFullYearAcceptable: true, isApplicableAtTheEnd: false },
                })}
            >
                submit-when
            </button>
        ),
    };
});

const renderWidget = (offerId = "42") => renderWithProviders(
    <MemoryRouter>
        <OfferWhen offerId={offerId} />
    </MemoryRouter>,
);

describe("OfferWhen", () => {
    it("сохраняет период вакансии и показывает тост об успехе", async () => {
        let patchedBody: unknown;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, when: null }))),
            rest.patch("*/vacancies/42", async (req, res, ctx) => {
                patchedBody = await req.json();
                return res(ctx.status(200), ctx.json({ id: 42 }));
            }),
        );

        renderWidget();

        const button = await screen.findByText("submit-when");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText("Данные успешно сохранены")).toBeInTheDocument();
        expect(patchedBody).toMatchObject({
            when: { durationMinDays: 3, durationMaxDays: 14, isFullYearAcceptable: true },
        });
    });

    it("показывает текст ошибки бэка при неудачном сохранении", async () => {
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, when: null }))),
            rest.patch("*/vacancies/42", (req, res, ctx) => res(
                ctx.status(400),
                ctx.json({ detail: "when.durationMinDays: должно быть меньше durationMaxDays" }),
            )),
        );

        renderWidget();

        const button = await screen.findByText("submit-when");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText(/durationMinDays: должно быть меньше/i)).toBeInTheDocument();
    });
});
