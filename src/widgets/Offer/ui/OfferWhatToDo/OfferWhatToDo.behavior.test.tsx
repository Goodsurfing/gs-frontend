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
import { OfferWhatToDo } from "./OfferWhatToDo";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/features/OfferWhatToDo", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/features/OfferWhatToDo")>();
    return {
        ...actual,
        OfferWhatToDoForm: ({ isLoadingGetData, isLoadingUpdateData, onComplete }: any) => (
            <button
                type="button"
                disabled={isLoadingGetData || isLoadingUpdateData}
                onClick={() => onComplete({
                    skills: ["s1"],
                    additionalSkills: [],
                    workingHours: { hours: 6, dayOff: 2, timeType: "week" },
                    extraInfo: "",
                })}
            >
                submit-what-to-do
            </button>
        ),
    };
});

const renderWidget = (offerId = "42") => renderWithProviders(
    <MemoryRouter>
        <OfferWhatToDo offerId={offerId} />
    </MemoryRouter>,
);

describe("OfferWhatToDo", () => {
    it("сохраняет чем предстоит заниматься и показывает тост об успехе", async () => {
        let patchedBody: unknown;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, whatToDo: null }))),
            rest.patch("*/vacancy/what-to-do/42", async (req, res, ctx) => {
                patchedBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderWidget();

        const button = await screen.findByText("submit-what-to-do");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText("Данные успешно сохранены")).toBeInTheDocument();
        expect(patchedBody).toMatchObject({
            skillIds: ["s1"], hours: 6, dayOff: 2, timeType: "week",
        });
    });

    it("показывает текст ошибки бэка при неудачном сохранении", async () => {
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, whatToDo: null }))),
            rest.patch("*/vacancy/what-to-do/42", (req, res, ctx) => res(
                ctx.status(400),
                ctx.json({ detail: "skillIds: должно быть заполнено" }),
            )),
        );

        renderWidget();

        const button = await screen.findByText("submit-what-to-do");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText(/skillIds: должно быть заполнено/i)).toBeInTheDocument();
    });
});
