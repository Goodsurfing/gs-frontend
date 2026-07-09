import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { HeaderDonationCard } from "./HeaderDonationCard";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const baseProps = {
    donationId: "1",
    peopleSupportCount: 0,
    percentAmountCollect: 0,
    isSuccess: false,
    canEdit: false,
    canSupport: true,
    status: "active" as const,
    isVolunteer: true,
};

/**
 * Регресс-guard для row 77: сборы без указанной даты окончания (daysLeft=null
 * у API) показывали заголовок «Дней осталось» с пустым значением вместо
 * того, чтобы скрыть блок целиком.
 */
describe("HeaderDonationCard", () => {
    it("не показывает «Дней осталось», если у сбора нет даты окончания (daysLeft=null)", () => {
        renderWithProviders(
            <MemoryRouter>
                <HeaderDonationCard {...baseProps} daysLeft={null} />
            </MemoryRouter>,
        );

        expect(screen.queryByText(/Дней осталось/)).not.toBeInTheDocument();
    });

    it("показывает «Дней осталось», если дата окончания задана", () => {
        renderWithProviders(
            <MemoryRouter>
                <HeaderDonationCard {...baseProps} daysLeft={5} />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Дней осталось/)).toBeInTheDocument();
    });
});
