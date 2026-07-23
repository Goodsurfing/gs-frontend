import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    MemoryRouter, Routes, Route, useNavigate,
} from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { OffersSearchFilter } from "./OffersSearchFilter";

vi.mock("@/widgets/OffersMap", () => ({
    OffersList: () => <div />,
    OffersMap: () => <div />,
}));
vi.mock("../OffersFilter/OffersFilter", () => ({
    OffersFilter: () => <div />,
}));
vi.mock("../OffersSearchFilterMobile/OffersSearchFilterMobile", () => ({
    OffersSearchFilterMobile: () => <div />,
}));
vi.mock("@/widgets/OffersMap/ui/SearchOffers/SearchOffers", () => ({
    SearchOffers: React.forwardRef(
        (_props: unknown, ref: React.Ref<HTMLDivElement>) => <div ref={ref} />,
    ),
}));

const NavigateToCleanOffersMap = () => {
    const navigate = useNavigate();
    return (
        <button type="button" onClick={() => navigate("/ru/offers-map")}>
            Все вакансии
        </button>
    );
};

describe("OffersSearchFilter", () => {
    it("сбрасывает выбранную категорию при внешней навигации на чистый урл (\"Все вакансии\")", async () => {
        const requestedUrls: string[] = [];
        server.use(
            rest.get("*/vacancy/list", (req, res, ctx) => {
                requestedUrls.push(req.url.toString());
                return res(ctx.status(200), ctx.json({ data: [], pagination: { total: 0 } }));
            }),
            rest.get("*/vacancy/for-map/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
            rest.get("*/category/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
        );

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/offers-map?category=8"]}>
                <Routes>
                    <Route
                        path="/ru/offers-map"
                        element={(
                            <>
                                <OffersSearchFilter />
                                <NavigateToCleanOffersMap />
                            </>
                        )}
                    />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => expect(requestedUrls.some((url) => url.includes("categoryIds"))).toBe(true));

        await userEvent.click(screen.getByText("Все вакансии"));

        await waitFor(() => {
            const last = requestedUrls.at(-1);
            expect(last).toBeDefined();
            expect(last).not.toContain("categoryIds");
        });
    });
});
