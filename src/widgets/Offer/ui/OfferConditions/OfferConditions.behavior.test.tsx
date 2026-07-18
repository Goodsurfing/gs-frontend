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
import { OfferConditions } from "./OfferConditions";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/features/OfferConditions", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/features/OfferConditions")>();
    return {
        ...actual,
        OfferConditionsForm: ({ isLoadingGetData, isLoadingUpdateData, onComplete }: any) => (
            <button
                type="button"
                disabled={isLoadingGetData || isLoadingUpdateData}
                onClick={() => onComplete({
                    housing: { switchState: true, housing: ["h1"] },
                    nutrition: { switchState: false, nutrition: [] },
                    travel: { switchState: false, travel: [] },
                    facilities: { facilities: [] },
                    extraFeatures: { extraFeatures: [] },
                    payment: { currency: "RUB", contribution: 0, reward: 0 },
                    extraConditions: "",
                })}
            >
                submit-conditions
            </button>
        ),
    };
});

const renderWidget = (offerId = "42") => renderWithProviders(
    <MemoryRouter>
        <OfferConditions offerId={offerId} />
    </MemoryRouter>,
);

describe("OfferConditions", () => {
    it("сохраняет условия вакансии и показывает тост об успехе", async () => {
        let patchedBody: unknown;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, condition: null }))),
            rest.patch("*/vacancy/condition/42", async (req, res, ctx) => {
                patchedBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderWidget();

        const button = await screen.findByText("submit-conditions");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText("Данные успешно сохранены")).toBeInTheDocument();
        expect(patchedBody).toMatchObject({ houseIds: ["h1"], currency: "RUB" });
    });

    it("показывает текст ошибки бэка при неудачном сохранении", async () => {
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, condition: null }))),
            rest.patch("*/vacancy/condition/42", (req, res, ctx) => res(
                ctx.status(400),
                ctx.json({ detail: "currency: недопустимое значение" }),
            )),
        );

        renderWidget();

        const button = await screen.findByText("submit-conditions");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText(/currency: недопустимое значение/i)).toBeInTheDocument();
    });
});
