import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import HostTeamPage from "./HostTeamPage";

const capturedProps: { current: Record<string, unknown> | null } = { current: null };

vi.mock("@/features/TeamForm", () => ({
    TeamForm: (props: Record<string, unknown>) => {
        capturedProps.current = props;
        return <div>team-form</div>;
    },
}));

describe("HostTeamPage", () => {
    it("ничего не рендерит, пока данные организации не загружены", () => {
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(ctx.delay("infinite"))),
        );

        renderWithProviders(<HostTeamPage />);

        expect(screen.queryByText("team-form")).not.toBeInTheDocument();
    });

    it("передаёт hostId и email владельца в TeamForm после загрузки", async () => {
        server.use(
            rest.get("*/personal/organization", (req, res, ctx) => res(ctx.status(200), ctx.json({
                id: "h1",
                owner: { email: "owner@test.ru" },
            }))),
        );

        renderWithProviders(<HostTeamPage />);

        await screen.findByText("team-form");

        expect(capturedProps.current).toMatchObject({
            hostId: "h1",
            hostEmail: "owner@test.ru",
        });
    });
});
