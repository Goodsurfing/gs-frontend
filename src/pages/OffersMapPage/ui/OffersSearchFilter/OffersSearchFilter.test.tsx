import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    MemoryRouter, Routes, Route, useNavigate,
} from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { OffersSearchFilter } from "./OffersSearchFilter";

const latestOffersMapProps: { current: Record<string, unknown> } = { current: {} };
const latestOffersListProps: { current: Record<string, unknown> } = { current: {} };

vi.mock("@/widgets/OffersMap", () => ({
    OffersList: (props: Record<string, unknown>) => {
        latestOffersListProps.current = props;
        return <div />;
    },
    OffersMap: (props: Record<string, unknown>) => {
        latestOffersMapProps.current = props;
        return <div />;
    },
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

const renderPage = () => renderWithProviders(
    <MemoryRouter initialEntries={["/ru/offers-map"]}>
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

    it("подмешивает границы viewport карты в запрос маркеров после onBoundsChange", async () => {
        const requestedForMapUrls: string[] = [];
        server.use(
            rest.get("*/vacancy/list", (req, res, ctx) => res(ctx.status(200), ctx.json({ data: [], pagination: { total: 0 } }))),
            rest.get("*/vacancy/for-map/list", (req, res, ctx) => {
                requestedForMapUrls.push(req.url.toString());
                return res(ctx.status(200), ctx.json([]));
            }),
            rest.get("*/category/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
        );

        renderPage();

        await waitFor(() => expect(typeof latestOffersMapProps.current.onBoundsChange).toBe("function"));
        const requestsBeforeBoundsChange = requestedForMapUrls.length;

        act(() => {
            (latestOffersMapProps.current.onBoundsChange as (bounds: unknown) => void)({
                boundsSwLat: 54, boundsSwLng: 36, boundsNeLat: 57, boundsNeLng: 39,
            });
        });

        await waitFor(() => expect(requestedForMapUrls.length)
            .toBeGreaterThan(requestsBeforeBoundsChange));
        const last = requestedForMapUrls.at(-1)!;
        expect(last).toContain("boundsSwLat=54");
        expect(last).toContain("boundsNeLng=39");
    });

    it("запрашивает координаты для offer id именно текущей страницы списка", async () => {
        const requestedIdsUrls: string[] = [];
        server.use(
            rest.get("*/vacancy/list", (req, res, ctx) => res(ctx.status(200), ctx.json({
                data: [{
                    id: 42,
                    title: "Test",
                    shortDescription: "",
                    image: null,
                    categories: [],
                    address: "",
                    acceptedApplicationsCount: 0,
                    averageRating: 0,
                    reviewsCount: 0,
                    status: "active",
                }],
                pagination: { total: 1 },
            }))),
            rest.get("*/vacancy/for-map/list", (req, res, ctx) => {
                // qs.stringify(..., { arrayFormat: "brackets" }) отдаёт
                // ids[]=42 (URL-энкодится в ids%5B%5D=42), а не ids=42.
                if (req.url.search.toLowerCase().includes("ids")) {
                    requestedIdsUrls.push(req.url.toString());
                }
                return res(ctx.status(200), ctx.json([]));
            }),
            rest.get("*/category/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
        );

        renderPage();

        await waitFor(() => expect(requestedIdsUrls.length).toBeGreaterThan(0));
        expect(requestedIdsUrls.at(-1)).toContain("42");
    });

    it("сбрасывает выбранную вакансию при смене страницы списка", async () => {
        server.use(
            rest.get("*/vacancy/list", (req, res, ctx) => res(ctx.status(200), ctx.json({
                data: [{
                    id: 7,
                    title: "Test",
                    shortDescription: "",
                    image: null,
                    categories: [],
                    address: "",
                    acceptedApplicationsCount: 0,
                    averageRating: 0,
                    reviewsCount: 0,
                    status: "active",
                }],
                pagination: { total: 40 },
            }))),
            rest.get("*/vacancy/for-map/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
            rest.get("*/category/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
        );

        renderPage();

        await waitFor(() => expect(typeof latestOffersListProps.current.onSelectOffer).toBe("function"));

        act(() => {
            (latestOffersListProps.current.onSelectOffer as (id: number) => void)(7);
        });
        await waitFor(() => expect(latestOffersMapProps.current.selectedOfferId).toBe(7));

        act(() => {
            (latestOffersListProps.current.onChangePage as (page: number) => void)(2);
        });
        await waitFor(() => expect(latestOffersMapProps.current.selectedOfferId).toBeUndefined());
    });
});
