import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { OfferWhoNeedsCard } from "./OfferWhoNeedsCard";
import { OfferWhoNeeds } from "../../model/types/offerWhoNeeds";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

const baseWhoNeeds: OfferWhoNeeds = {
    genders: [],
    ageMax: 99,
    ageMin: 18,
    needAllLanguages: false,
    languages: [],
    volunteerPlaceCount: 1,
    receptionPlace: "any",
    additionalInfo: "",
};

/**
 * Регресс-guard для row 70: бейдж «только иностранцев» / «только из моей
 * страны» (whoNeeds.receptionPlace) раньше не выводился на публичной
 * странице вакансии волонтёру. Фикс: PR gs-frontend#349 (v0.1.26).
 */
describe("OfferWhoNeedsCard", () => {
    it("показывает бейдж «Только иностранцев» при receptionPlace=foreigners", () => {
        renderWithProviders(
            <OfferWhoNeedsCard
                whoNeeds={{ ...baseWhoNeeds, receptionPlace: "foreigners" }}
            />,
        );

        expect(screen.getByText("whoNeeds.Только иностранцев")).toBeInTheDocument();
    });

    it("показывает бейдж «Только из моей страны» при receptionPlace=compatriot", () => {
        renderWithProviders(
            <OfferWhoNeedsCard
                whoNeeds={{ ...baseWhoNeeds, receptionPlace: "compatriot" }}
            />,
        );

        expect(screen.getByText("whoNeeds.Только из моей страны")).toBeInTheDocument();
    });

    it("не показывает бейдж при receptionPlace=any", () => {
        renderWithProviders(
            <OfferWhoNeedsCard whoNeeds={baseWhoNeeds} />,
        );

        expect(screen.queryByText(/whoNeeds\.Только/)).not.toBeInTheDocument();
    });
});
