import {
    describe, it, expect, vi,
} from "vitest";
import { renderHook } from "@testing-library/react";
import { useNextRoutes } from "./useNextRoutes";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

/**
 * Регресс-guard: PaymentPage теперь редиректит неавторизованных юзеров
 * через next=payment&nextId=<tariffCode>, а AuthByEmail.onSuccess
 * резолвит его через getNextRoute — без этого маппинга юзера после
 * логина уносило бы на дефолтную страницу профиля вместо оплаты.
 */
describe("useNextRoutes", () => {
    it("payment резолвится в страницу оплаты с сохранённым tariffCode", () => {
        const { result } = renderHook(() => useNextRoutes());

        expect(result.current.getNextRoute("payment", "host_4990")).toBe(
            "/ru/payment?tariff=host_4990",
        );
    });
});
