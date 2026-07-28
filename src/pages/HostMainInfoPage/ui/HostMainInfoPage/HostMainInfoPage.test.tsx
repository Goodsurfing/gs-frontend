import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import HostMainInfoPage from "./HostMainInfoPage";

const capturedProps: { current: Record<string, unknown> | null } = { current: null };
const translationsReady = { current: true };

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key, ready: translationsReady.current }),
}));

vi.mock("@/features/HostDescription", () => ({
    HostDescriptionForm: (props: Record<string, unknown>) => {
        capturedProps.current = props;
        return <div>host-description-form</div>;
    },
}));

describe("HostMainInfoPage", () => {
    it("передаёт hostId и данные профиля в HostDescriptionForm после загрузки", async () => {
        server.use(
            rest.get("*/profile", (req, res, ctx) => res(ctx.status(200), ctx.json({
                id: "u1",
                email: "host@test.ru",
                hostId: "h1",
                firstName: null,
                lastName: null,
            }))),
        );

        renderWithProviders(<HostMainInfoPage />);

        await waitFor(() => expect(capturedProps.current).toMatchObject({
            host: "h1",
            isLoading: false,
            isError: false,
        }));

        expect(screen.getByText("hostDescription.Основная информация")).toBeInTheDocument();
        expect((capturedProps.current?.myProfile as { id: string })?.id).toBe("u1");
    });

    it("isError=true при ошибке загрузки профиля", async () => {
        server.use(
            rest.get("*/profile", (req, res, ctx) => res(ctx.status(500))),
        );

        renderWithProviders(<HostMainInfoPage />);

        await waitFor(() => expect(capturedProps.current).toMatchObject({ isError: true }));
    });

    it("показывает лоадер вместо формы, пока переводы не готовы", () => {
        server.use(
            rest.get("*/profile", (req, res, ctx) => res(ctx.status(200), ctx.json({ id: "u1", hostId: "h1" }))),
        );
        translationsReady.current = false;
        try {
            renderWithProviders(<HostMainInfoPage />);

            expect(screen.queryByText("hostDescription.Основная информация")).not.toBeInTheDocument();
            expect(screen.queryByText("host-description-form")).not.toBeInTheDocument();
        } finally {
            translationsReady.current = true;
        }
    });
});
