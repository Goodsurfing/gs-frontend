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
import { NotesHostForm } from "./NotesHostForm";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

// NotesContainer — канбан-колонка с drag&drop (react-beautiful-dnd), не
// имеет смысла гонять DnD в юнит-тесте — стабим кнопками accept/cancel по
// первой заявке колонки, проверяем реальную логику NotesHostForm: смена
// статуса заявки хостом и обработка ошибки.
vi.mock("@/widgets/NotesWidget", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@/widgets/NotesWidget")>();
    return {
        ...actual,
        NotesContainer: ({
            status, total, notes, onAcceptClick, onCancelClick,
        }: any) => (
            <div>
                <span>{`column:${status}:${total}`}</span>
                {notes.map((note: any) => (
                    <div key={note.id}>
                        <button type="button" onClick={() => onAcceptClick(note.id)}>
                            {`accept-${note.id}`}
                        </button>
                        <button type="button" onClick={() => onCancelClick(note.id)}>
                            {`cancel-${note.id}`}
                        </button>
                    </div>
                ))}
            </div>
        ),
    };
});

const APPLICATIONS_URL = "*/application/list-of-organization";

const mockApplicationsHandler = (status: string, notes: unknown[]) => rest.get(
    APPLICATIONS_URL,
    (req, res, ctx) => {
        if (req.url.searchParams.get("status") !== status) {
            return res(ctx.status(200), ctx.json({ data: [], pagination: { total: 0 } }));
        }
        return res(ctx.status(200), ctx.json({ data: notes, pagination: { total: notes.length } }));
    },
);

const renderForm = () => renderWithProviders(
    <MemoryRouter>
        <NotesHostForm />
    </MemoryRouter>,
);

describe("NotesHostForm", () => {
    it("принимает заявку волонтёра", async () => {
        let statusBody: unknown;
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: "h1" }))),
            rest.get("*/vacancy/list/h1", (req, res, ctx) => res(ctx.status(200), ctx.json({ data: [] }))),
            mockApplicationsHandler("new", [{ id: 101, status: "new" }]),
            rest.patch("*/application_forms/101/status", async (req, res, ctx) => {
                statusBody = await req.json();
                return res(ctx.status(200), ctx.json({ id: 101, status: "accepted" }));
            }),
        );

        renderForm();

        await userEvent.click(await screen.findByText("accept-101"));

        await waitFor(() => expect(statusBody).toEqual({ status: "accepted" }));
    });

    it("отклоняет заявку волонтёра", async () => {
        let statusBody: unknown;
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: "h1" }))),
            rest.get("*/vacancy/list/h1", (req, res, ctx) => res(ctx.status(200), ctx.json({ data: [] }))),
            mockApplicationsHandler("new", [{ id: 202, status: "new" }]),
            rest.patch("*/application_forms/202/status", async (req, res, ctx) => {
                statusBody = await req.json();
                return res(ctx.status(200), ctx.json({ id: 202, status: "canceled" }));
            }),
        );

        renderForm();

        await userEvent.click(await screen.findByText("cancel-202"));

        await waitFor(() => expect(statusBody).toEqual({ status: "canceled" }));
    });

    it("показывает тост, если смена статуса заявки упала", async () => {
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: "h1" }))),
            rest.get("*/vacancy/list/h1", (req, res, ctx) => res(ctx.status(200), ctx.json({ data: [] }))),
            mockApplicationsHandler("new", [{ id: 303, status: "new" }]),
            rest.patch("*/application_forms/303/status", (req, res, ctx) => res(ctx.status(500))),
        );

        renderForm();

        await userEvent.click(await screen.findByText("accept-303"));

        expect(await screen.findByText("Не удалось изменить статус заявки")).toBeInTheDocument();
    });

    it("каждая колонка получает свой total с бэкенда (row 101 regression)", async () => {
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: "h1" }))),
            rest.get("*/vacancy/list/h1", (req, res, ctx) => res(ctx.status(200), ctx.json({ data: [] }))),
            rest.get(APPLICATIONS_URL, (req, res, ctx) => {
                const status = req.url.searchParams.get("status");
                const totals: Record<string, number> = { new: 3, accepted: 7, canceled: 1 };
                return res(ctx.status(200), ctx.json({
                    data: [],
                    pagination: { total: totals[status ?? ""] ?? 0 },
                }));
            }),
        );

        renderForm();

        expect(await screen.findByText("column:new:3")).toBeInTheDocument();
        expect(screen.getByText("column:accepted:7")).toBeInTheDocument();
        expect(screen.getByText("column:canceled:1")).toBeInTheDocument();
    });
});
