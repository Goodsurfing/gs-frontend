import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { OfferWhoNeedsCard } from "./OfferWhoNeedsCard";
import { OfferWhoNeeds } from "../../model/types/offerWhoNeeds";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, params?: Record<string, unknown>) => (params
            ? key.replace(/{{(\w+)}}/g, (_, name) => String(params[name]))
            : key),
    }),
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

    it("показывает возраст словами «от X до Y», когда есть верхняя граница", () => {
        renderWithProviders(
            <OfferWhoNeedsCard whoNeeds={{ ...baseWhoNeeds, ageMin: 18, ageMax: 55 }} />,
        );

        expect(screen.getByText("whoNeeds.от 18 до 55")).toBeInTheDocument();
    });

    it("показывает «от X» без верхней границы, когда ageMax достиг потолка (нет реального лимита)", () => {
        renderWithProviders(
            <OfferWhoNeedsCard whoNeeds={{ ...baseWhoNeeds, ageMin: 18, ageMax: 100 }} />,
        );

        expect(screen.getByText("whoNeeds.от 18")).toBeInTheDocument();
        expect(screen.queryByText(/до 100/)).not.toBeInTheDocument();
    });
});
