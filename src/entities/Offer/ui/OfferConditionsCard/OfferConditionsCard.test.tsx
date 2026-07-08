import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { OfferConditionsCard } from "./OfferConditionsCard";
import { OfferFinishingTouches } from "../../model/types/offerFinishingTouches";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/features/OfferFinishingTouches/model/data/extraConditionsData", () => ({
    useExtraConditionsData: () => ({ extraConditionsData: [] }),
}));

const baseFinishingTouches: OfferFinishingTouches = {
    additionalConditions: [],
    helloText: "",
    roles: "",
    questionnaireUrl: "",
    questions: [],
    onlyVerified: false,
};

/**
 * Регресс-guard для row 69: бейдж «Принимать заявки только от проверенных
 * участников» (finishingTouches.onlyVerified) раньше не выводился на
 * публичной странице вакансии — блок скрывался целиком, если
 * additionalConditions был пуст, даже при onlyVerified=true.
 * Фикс: PR gs-frontend#349 (v0.1.26).
 */
describe("OfferConditionsCard", () => {
    it("показывает бейдж onlyVerified, даже если additionalConditions пуст", () => {
        renderWithProviders(
            <OfferConditionsCard
                finishingTouches={{ ...baseFinishingTouches, onlyVerified: true }}
            />,
        );

        expect(
            screen.getByText("finishingTouches.Принимать заявки только от проверенных участников"),
        ).toBeInTheDocument();
    });

    it("не рендерит карточку, если additionalConditions пуст и onlyVerified=false", () => {
        const { container } = renderWithProviders(
            <OfferConditionsCard finishingTouches={baseFinishingTouches} />,
        );

        expect(container).toBeEmptyDOMElement();
    });
});
