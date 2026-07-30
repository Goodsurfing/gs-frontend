import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { OffersSearchFilter } from "./OffersSearchFilter";

const clearSearchSpy = vi.fn();

vi.mock("@/widgets/OffersMap", () => ({
    OffersList: () => <div />,
    OffersMap: () => <div />,
}));
vi.mock("../OffersSearchFilterMobile/OffersSearchFilterMobile", () => ({
    OffersSearchFilterMobile: () => <div />,
}));
vi.mock("@/widgets/OffersMap/ui/SearchOffers/SearchOffers", () => ({
    SearchOffers: React.forwardRef(
        (_props: unknown, ref: React.Ref<{ clearSearch: () => void }>) => {
            React.useImperativeHandle(ref, () => ({ clearSearch: clearSearchSpy }));
            return <div />;
        },
    ),
}));
vi.mock("../OffersFilter/OffersFilter", () => ({
    OffersFilter: ({ onSubmit }: { onSubmit: () => void }) => (
        <button type="button" onClick={onSubmit}>Применить</button>
    ),
}));

/**
 * Регресс-guard для GS-93: клик "Применить" на фильтрах (категория/дата/итд)
 * сбрасывает активный текстовый поиск в состоянии (currentSearchRef.current
 * = ""), но раньше не чистил само поле ввода — оно продолжало показывать
 * старый запрос ("Байкал"), хотя результаты уже были отфильтрованы только по
 * категории/дате, без учёта текста в строке поиска.
 */
describe("OffersSearchFilter — очистка поля поиска при применении прочих фильтров", () => {
    it("вызывает clearSearch на SearchOffers при клике Применить", async () => {
        server.use(
            rest.get("*/vacancy/list", (req, res, ctx) => res(ctx.status(200), ctx.json({ data: [], pagination: { total: 0 } }))),
            rest.get("*/vacancy/for-map/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
            rest.get("*/category/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
        );

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/offers-map?search=Байкал"]}>
                <Routes>
                    <Route path="/ru/offers-map" element={<OffersSearchFilter />} />
                </Routes>
            </MemoryRouter>,
        );

        expect(clearSearchSpy).not.toHaveBeenCalled();

        await userEvent.click(screen.getByText("Применить"));

        await waitFor(() => expect(clearSearchSpy).toHaveBeenCalled());
    });
});
