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
import { OfferWhere } from "./OfferWhere";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

// Реальная OfferWhereForm рендерит карту (MapWithAddress), которая делает
// геокодирование через внешний Yandex API — не имеет смысла гонять это в
// unit-тесте виджета. Стабим форму, чтобы проверить именно логику
// OfferWhere: загрузка данных вакансии, сохранение, тост об ошибке/успехе.
vi.mock("@/features/Offer", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/features/Offer")>();
    return {
        ...actual,
        OfferWhereForm: ({ isLoadingGetData, isLoadingUpdateData, onComplete }: any) => (
            <button
                type="button"
                disabled={isLoadingGetData || isLoadingUpdateData}
                onClick={() => onComplete({
                    address: {
                        address: "Санкт-Петербург",
                        geoObject: { name: "Санкт-Петербург", description: "", Point: { pos: "30.3 59.9" } },
                    },
                })}
            >
                submit-where
            </button>
        ),
    };
});

const renderWidget = (offerId = "42") => renderWithProviders(
    <MemoryRouter>
        <OfferWhere offerId={offerId} />
    </MemoryRouter>,
);

describe("OfferWhere", () => {
    it("сохраняет адрес вакансии и показывает тост об успехе", async () => {
        let patchedBody: unknown;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, where: null }))),
            rest.patch("*/vacancies/42", async (req, res, ctx) => {
                patchedBody = await req.json();
                return res(ctx.status(200), ctx.json({ id: 42 }));
            }),
        );

        renderWidget();

        const button = await screen.findByText("submit-where");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText("Адрес успешно изменён")).toBeInTheDocument();
        expect(patchedBody).toMatchObject({
            where: { address: "Санкт-Петербург", longitude: 30.3, latitude: 59.9 },
        });
    });

    it("показывает текст ошибки, если сохранение адреса упало", async () => {
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42, where: null }))),
            rest.patch("*/vacancies/42", (req, res, ctx) => res(
                ctx.status(400),
                ctx.json({ detail: "where.address: обязательное поле" }),
            )),
        );

        renderWidget();

        const button = await screen.findByText("submit-where");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText(/where\.address: обязательное поле/i)).toBeInTheDocument();
    });
});
