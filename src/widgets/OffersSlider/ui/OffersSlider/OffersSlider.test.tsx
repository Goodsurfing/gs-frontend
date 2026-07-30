import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { render, waitFor } from "@testing-library/react";
import { OffersSlider } from "./OffersSlider";

/**
 * GS-90: волонтёр с выбранными на дашборде избранными категориями должен
 * видеть на главной персональные вакансии вместо admin-подборки
 * (isFeatured) — приоритет и фолбэки покрыты через мок useLazyGetOffersQuery,
 * без реального Redux/API.
 */

let mockIsAuth: unknown;
let mockProfileData: { favoriteCategories: number[] } | undefined;
let mockProfileLoading: boolean;
const getOffersData = vi.fn();

vi.mock("@/shared/hooks/redux", () => ({
    useAppSelector: () => mockIsAuth,
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/entities/Profile", () => ({
    useGetProfileInfoQuery: () => ({ data: mockProfileData, isLoading: mockProfileLoading }),
}));

vi.mock("@/entities/Offer", async () => {
    const actual = await vi.importActual<typeof import("@/entities/Offer")>("@/entities/Offer");
    return {
        ...actual,
        useLazyGetOffersQuery: () => [getOffersData, false],
    };
});

vi.mock("../Offer/Offer", () => ({
    default: () => null,
}));

const okResult = (ids: number[]) => ({
    unwrap: () => Promise.resolve({ data: ids.map((id) => ({ id })) }),
});

describe("OffersSlider", () => {
    beforeEach(() => {
        mockIsAuth = undefined;
        mockProfileData = undefined;
        mockProfileLoading = false;
        getOffersData.mockReset();
        getOffersData.mockReturnValue(okResult([1]));
    });

    it("для анонимного пользователя сразу берёт admin isFeatured, не запрашивая категории", async () => {
        render(<OffersSlider />);

        await waitFor(() => expect(getOffersData).toHaveBeenCalledWith({ isFeatured: true }));
        expect(getOffersData).not.toHaveBeenCalledWith(
            expect.objectContaining({ categoryIds: expect.anything() }),
        );
    });

    it("для волонтёра с избранными категориями запрашивает персональные вакансии вместо admin-подборки", async () => {
        mockIsAuth = "token";
        mockProfileData = { favoriteCategories: [3, 7] };

        render(<OffersSlider />);

        await waitFor(() => expect(getOffersData).toHaveBeenCalledWith({
            categoryIds: [3, 7],
            sort: "recommendation",
        }));
        expect(getOffersData).not.toHaveBeenCalledWith({ isFeatured: true });
    });

    it("если по избранным категориям ничего не найдено, падает обратно на admin isFeatured", async () => {
        mockIsAuth = "token";
        mockProfileData = { favoriteCategories: [3] };
        getOffersData
            .mockReturnValueOnce(okResult([]))
            .mockReturnValueOnce(okResult([9]));

        render(<OffersSlider />);

        await waitFor(() => expect(getOffersData).toHaveBeenCalledWith({ isFeatured: true }));
    });

    it("ждёт загрузку профиля прежде чем решать, какие вакансии запрашивать", async () => {
        mockIsAuth = "token";
        mockProfileLoading = true;

        render(<OffersSlider />);

        await new Promise((resolve) => { setTimeout(resolve, 0); });
        expect(getOffersData).not.toHaveBeenCalled();
    });
});
