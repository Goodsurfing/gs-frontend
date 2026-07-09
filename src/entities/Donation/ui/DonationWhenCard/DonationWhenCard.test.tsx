import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { DonationWhenCard } from "./DonationWhenCard";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const fmt = new Intl.NumberFormat("ru-RU");

const getProgressTextNode = () => screen.getByText(
    (content, node) => node?.className === "text" && content.includes("₽"),
);

/**
 * Регресс-guard для row 46: на странице сбора не отображалось, сколько
 * средств уже собрано. Причина: GetDonation не содержал collectedAmount
 * — сумма вычислялась из amount*percent, а при amount=null (цель не
 * задана) прогресс не показывался вообще. Фикс: collectedAmount берётся
 * напрямую из API, прогресс показывается при collectedAmount > 0 даже
 * без целевой суммы.
 */
describe("DonationWhenCard", () => {
    it("показывает собранную сумму, даже если целевая сумма (amount) не задана", () => {
        renderWithProviders(
            <DonationWhenCard
                dateStart="2026-01-01"
                daysLeft={10}
                percentAmountCollect={null}
                collectedAmount={5000}
                amount={null}
                isSuccess={false}
            />,
        );

        expect(getProgressTextNode().textContent).toBe(`${fmt.format(5000)} ₽`);
    });

    it("показывает прогресс «собрано / цель (%)», когда целевая сумма задана", () => {
        renderWithProviders(
            <DonationWhenCard
                dateStart="2026-01-01"
                daysLeft={10}
                percentAmountCollect={50}
                collectedAmount={7500}
                amount={10000}
                isSuccess={false}
            />,
        );

        expect(getProgressTextNode().textContent).toBe(
            `${fmt.format(7500)} ₽ / ${fmt.format(10000)} ₽ (50%)`,
        );
    });

    it("не показывает блок прогресса, если ничего не собрано и цель не задана", () => {
        renderWithProviders(
            <DonationWhenCard
                dateStart="2026-01-01"
                daysLeft={10}
                percentAmountCollect={null}
                collectedAmount={0}
                amount={null}
                isSuccess={false}
            />,
        );

        expect(screen.queryByText("donationPersonal.Средств собрано")).not.toBeInTheDocument();
    });
});
