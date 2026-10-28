import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFavoriteOffers } from "./useFavoriteOffers";

const {
    mockIds, mockAdd, mockRemove, mockAuth,
} = vi.hoisted(() => ({
    mockIds: vi.fn(),
    mockAdd: vi.fn(),
    mockRemove: vi.fn(),
    mockAuth: vi.fn(),
}));

vi.mock("../api/offerApi", () => ({
    useGetFavoriteOfferIdsQuery: mockIds,
    useAddFavoriteOfferMutation: () => [mockAdd],
    useRemoveFavoriteOfferMutation: () => [mockRemove],
}));

vi.mock("@/shared/hooks/redux", () => ({
    useAppSelector: () => mockAuth(),
}));

describe("useFavoriteOffers", () => {
    beforeEach(() => {
        [mockIds, mockAdd, mockRemove, mockAuth].forEach((m) => m.mockReset());
    });

    it("гостю выключено и запрос id не идёт", () => {
        mockAuth.mockReturnValue(undefined);
        mockIds.mockReturnValue({ data: undefined });

        const { result } = renderHook(() => useFavoriteOffers());

        expect(result.current.enabled).toBe(false);
        expect(mockIds).toHaveBeenCalledWith(undefined, { skip: true });
    });

    it("отмечает избранное и переключает: добавить / убрать", () => {
        mockAuth.mockReturnValue({ token: "t" });
        mockIds.mockReturnValue({ data: { ids: [5] } });

        const { result } = renderHook(() => useFavoriteOffers());

        expect(result.current.enabled).toBe(true);
        expect(result.current.isFavorite(5)).toBe(true);
        expect(result.current.isFavorite(6)).toBe(false);

        act(() => result.current.toggleFavorite(5));
        expect(mockRemove).toHaveBeenCalledWith(5);
        act(() => result.current.toggleFavorite(6));
        expect(mockAdd).toHaveBeenCalledWith(6);
    });
});
