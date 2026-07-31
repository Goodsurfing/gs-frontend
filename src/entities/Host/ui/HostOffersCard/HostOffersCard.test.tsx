import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { HostOffersCard } from "./HostOffersCard";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const offersData = {
    data: [
        {
            id: 1,
            status: "active",
            title: "Волонтерство на Ольхоне",
            image: null,
            categories: ["other"],
            acceptedApplicationsCount: 5,
            averageRating: 4.2,
            reviewsCount: 3,
            address: "Ольхон",
        },
        {
            id: 2,
            status: "active",
            title: "Гид-экскурсовод",
            image: null,
            categories: ["other"],
            acceptedApplicationsCount: 2,
            averageRating: 5,
            reviewsCount: 1,
            address: "Байкал",
        },
    ],
    pagination: { total: 2, page: 1 },
};
const getHostOffers = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve(offersData) });

vi.mock("@/entities/Offer", async (importOriginal) => ({
    ...(await importOriginal<object>()),
    useLazyGetHostOffersByIdQuery: () => [getHostOffers, { data: offersData }],
}));

describe("HostOffersCard", () => {
    it("не выдаёт React-предупреждение об отсутствии key при рендере нескольких вакансий", async () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        renderWithProviders(
            <MemoryRouter><HostOffersCard hostId="host-1" locale="ru" /></MemoryRouter>,
        );
        await waitFor(() => expect(screen.getByText("Волонтерство на Ольхоне")).toBeInTheDocument());
        expect(screen.getByText("Гид-экскурсовод")).toBeInTheDocument();
        const hasKeyWarning = consoleErrorSpy.mock.calls.some(
            (call) => typeof call[0] === "string" && call[0].includes("unique \"key\" prop"),
        );
        expect(hasKeyWarning).toBe(false);
        consoleErrorSpy.mockRestore();
    });

    it("показывает пустое состояние, когда у организации нет активных вакансий", async () => {
        getHostOffers.mockReturnValueOnce({
            unwrap: () => Promise.resolve({ data: [], pagination: { total: 0, page: 1 } }),
        });
        renderWithProviders(
            <MemoryRouter><HostOffersCard hostId="host-2" locale="ru" /></MemoryRouter>,
        );
        await waitFor(() => expect(
            screen.getByText("personalHost.У организации пока нет вакансий"),
        ).toBeInTheDocument());
    });
});
