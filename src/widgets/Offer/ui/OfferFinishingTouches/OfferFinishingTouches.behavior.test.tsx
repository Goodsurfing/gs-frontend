import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { OfferFinishingTouches } from "./OfferFinishingTouches";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/features/OfferFinishingTouches", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/features/OfferFinishingTouches")>();
    return {
        ...actual,
        OfferFinishingTouchesForm: ({ isLoadingGetData, isLoadingUpdateData, onComplete }: any) => (
            <>
                <button
                    type="button"
                    disabled={isLoadingGetData || isLoadingUpdateData}
                    onClick={() => onComplete({ title: "Вакансия" }, "draft")}
                >
                    save-draft
                </button>
                <button
                    type="button"
                    disabled={isLoadingGetData || isLoadingUpdateData}
                    onClick={() => onComplete({ title: "Вакансия" }, "active")}
                >
                    publish
                </button>
            </>
        ),
    };
});

const renderWidget = (offerId = "42") => renderWithProviders(
    <MemoryRouter initialEntries={["/ru/offer/finishing-touches/42"]}>
        <Routes>
            <Route path="/ru/offer/finishing-touches/:id" element={<OfferFinishingTouches offerId={offerId} />} />
            <Route path="/ru/host/my-offers" element={<div>Мои вакансии</div>} />
        </Routes>
    </MemoryRouter>,
);

describe("OfferFinishingTouches", () => {
    it("черновик сохраняется сразу, без модалки подтверждения публикации", async () => {
        let statusCalled = false;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ id: 42, status: "draft", finishingTouche: null }),
            )),
            rest.patch("*/vacancies/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42 }))),
            rest.patch("*/vacancy/toggle-status/42", (req, res, ctx) => {
                statusCalled = true;
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderWidget();

        const button = await screen.findByText("save-draft");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        // После успешного сохранения виджет сразу же делает navigate() —
        // тост от setToast() не успевает отрендериться до размонтирования,
        // поэтому наблюдаем именно факт перехода на список вакансий.
        expect(await screen.findByText("Мои вакансии")).toBeInTheDocument();
        expect(statusCalled).toBe(false);
    });

    it("публикация черновика требует подтверждения в модалке", async () => {
        let statusBody: unknown;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ id: 42, status: "draft", finishingTouche: null }),
            )),
            rest.patch("*/vacancies/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42 }))),
            rest.patch("*/vacancy/toggle-status/42", async (req, res, ctx) => {
                statusBody = await req.json();
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderWidget();

        const button = await screen.findByText("publish");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        // Модалка подтверждения открылась, мутация ещё не должна была уйти
        expect(await screen.findByText(
            "Вы уверены, что хотите опубликовать это предложение? После публикации его увидят другие пользователи.",
        )).toBeInTheDocument();
        expect(statusBody).toBeUndefined();

        await userEvent.click(screen.getByText("Опубликовать"));

        expect(await screen.findByText("Мои вакансии")).toBeInTheDocument();
        expect(statusBody).toEqual({ status: "active" });
    });

    it("отмена в модалке не публикует вакансию", async () => {
        let statusCalled = false;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ id: 42, status: "draft", finishingTouche: null }),
            )),
            rest.patch("*/vacancies/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42 }))),
            rest.patch("*/vacancy/toggle-status/42", (req, res, ctx) => {
                statusCalled = true;
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderWidget();

        const button = await screen.findByText("publish");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        await screen.findByText(
            "Вы уверены, что хотите опубликовать это предложение? После публикации его увидят другие пользователи.",
        );
        await userEvent.click(screen.getByText("Отмена"));

        expect(statusCalled).toBe(false);
    });

    it("для уже опубликованной вакансии повторная публикация не требует модалки", async () => {
        let statusCalled = false;
        server.use(
            rest.get("*/vacancy/42", (req, res, ctx) => res(
                ctx.status(200),
                ctx.json({ id: 42, status: "active", finishingTouche: null }),
            )),
            rest.patch("*/vacancies/42", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: 42 }))),
            rest.patch("*/vacancy/toggle-status/42", (req, res, ctx) => {
                statusCalled = true;
                return res(ctx.status(200), ctx.json({}));
            }),
        );

        renderWidget();

        const button = await screen.findByText("publish");
        await waitFor(() => expect(button).not.toBeDisabled());
        await userEvent.click(button);

        expect(await screen.findByText("Мои вакансии")).toBeInTheDocument();
        // currentStatus уже active, повторный toggle-status не требуется
        expect(statusCalled).toBe(false);
    });
});
