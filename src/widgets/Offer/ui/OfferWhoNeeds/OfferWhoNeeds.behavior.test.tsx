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
import { OfferWhoNeeds } from "./OfferWhoNeeds";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/features/OfferWhoNeedsForm", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/features/OfferWhoNeedsForm")>();
    return {
        ...actual,
        WhoNeedsForm: ({ isLoadingGetData, isLoadingUpdateData, onComplete }: any) => (
            <button
                type="button"
                disabled={isLoadingGetData || isLoadingUpdateData}
                onClick={() => onComplete({
                    age: { minAge: 18, maxAge: 65 },
                    gender: ["male", "female"],
                    languages: ["ru"],
                    receptionPlace: "airport",
                    volunteerPlaces: 5,
                    additionalInfo: "",
                    needAllLanguages: false,
                })}
            >
                submit-who-needs
            </button>
        ),
    };
});

const renderWidget = (offerId = "42") => renderWithProviders(
    <MemoryRouter>
        <OfferWhoNeeds offerId={offerId} />
    </MemoryRouter>,
);

describe("OfferWhoNeeds", () => {
    it("сохраняет требования к волонтёрам и показывает тост об успехе", async () => {
        let patchedBody: unknown;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, howNeed: null }))),
            rest.patch("*/vacancies/42", async (req, res, ctx) => {
                patchedBody = await req.json();
                return res(ctx.status(200), ctx.json({ id: 42 }));
            }),
        );

        renderWidget();

        const button = await screen.findByText("submit-who-needs");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText("Данные успешно сохранены")).toBeInTheDocument();
        expect(patchedBody).toMatchObject({
            howNeeds: { ageMin: 18, ageMax: 65, volunteerPlaceCount: 5 },
        });
    });

    it("показывает текст ошибки бэка при неудачном сохранении", async () => {
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, howNeed: null }))),
            rest.patch("*/vacancies/42", (req, res, ctx) => res(
                ctx.status(400),
                ctx.json({ detail: "howNeeds.ageMin: должно быть меньше ageMax" }),
            )),
        );

        renderWidget();

        const button = await screen.findByText("submit-who-needs");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText(/ageMin: должно быть меньше/i)).toBeInTheDocument();
    });
});
