import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DonationCard } from "./DonationCard";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const baseData = {
    id: "1",
    organizationName: "Организация",
    percentAmountCollect: 10,
    isSuccess: false,
};

/**
 * Регресс-guard для row 77: сборы без указанной даты окончания (daysLeft=null
 * у API) показывали заголовок «Осталось» с пустым значением вместо того,
 * чтобы скрыть блок целиком.
 */
describe("DonationCard", () => {
    it("не показывает «Осталось», если у сбора нет даты окончания (daysLeft=null)", () => {
        render(
            <MemoryRouter>
                <DonationCard data={{ ...baseData, daysLeft: null }} locale="ru" />
            </MemoryRouter>,
        );

        expect(screen.queryByText(/Осталось/)).not.toBeInTheDocument();
    });

    it("показывает «Осталось», если дата окончания задана", () => {
        render(
            <MemoryRouter>
                <DonationCard data={{ ...baseData, daysLeft: 5 }} locale="ru" />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Осталось/)).toBeInTheDocument();
    });
});
