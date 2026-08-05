import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { rest } from "msw";
import { Controller, useFormContext } from "react-hook-form";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { OffersSearchFilter } from "./OffersSearchFilter";

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
            React.useImperativeHandle(ref, () => ({ clearSearch: () => {} }));
            return <div />;
        },
    ),
}));
// A minimal stand-in for the real OffersFilter that exposes just enough of the
// category Controller wiring to drive the same code path a real checkbox
// click would (field.onChange -> the watch subscriber -> setSearchParams).
vi.mock("../OffersFilter/OffersFilter", () => ({
    OffersFilter: ({ onSubmit }: { onSubmit: () => void }) => {
        const { control } = useFormContext();
        return (
            <div>
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <button type="button" onClick={() => field.onChange([])}>
                            Deselect category
                        </button>
                    )}
                />
                <button type="button" onClick={onSubmit}>Применить</button>
            </div>
        );
    },
}));

/**
 * Регресс-guard: onApplyFilters/onApplySearch/onResetFilters были
 * замемоизированы с пустым массивом зависимостей, но внутри звали
 * onChangePage — который сам меняется при каждом изменении searchParams.
 * Из-за этого они навсегда захватывали onChangePage/setSearchParams
 * момента первого рендера, и его setSearchParams(prev => ...) при вызове
 * читал prev из URL на момент загрузки страницы, а не текущий — клик
 * "Применить" после снятия категории с фильтра воскрешал старую
 * категорию из URL при загрузке (репорт техподдержки, 2026-07-29).
 */
describe("OffersSearchFilter — регресс: категория не должна воскресать после Применить", () => {
    it("не переотправляет снятую категорию при клике Применить", async () => {
        const requestedUrls: string[] = [];
        server.use(
            rest.get("*/vacancy", (req, res, ctx) => {
                requestedUrls.push(req.url.toString());
                return res(ctx.status(200), ctx.json({ data: [], pagination: { total: 0 } }));
            }),
            rest.get("*/vacancy/for-map/list", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
            rest.get("*/category", (req, res, ctx) => res(ctx.status(200), ctx.json([]))),
        );

        renderWithProviders(
            <MemoryRouter initialEntries={["/ru/offers-map?category=2"]}>
                <Routes>
                    <Route path="/ru/offers-map" element={<OffersSearchFilter />} />
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => expect(requestedUrls.some((url) => url.includes("categoryIds"))).toBe(true));

        await userEvent.click(screen.getByText("Deselect category"));
        await userEvent.click(screen.getByText("Применить"));

        await waitFor(() => expect(requestedUrls.length).toBeGreaterThan(1));
        expect(requestedUrls.at(-1)).not.toContain("categoryIds");
    });
});
