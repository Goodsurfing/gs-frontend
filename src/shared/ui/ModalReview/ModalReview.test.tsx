import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { ModalReview } from "./ModalReview";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, fallback?: string) => fallback ?? key,
    }),
}));

/**
 * Регресс-guard для row 60: было неочевидно, что отзыв сохраняется
 * только при выставленных звёздах — кнопка «Оставить отзыв» просто не
 * реагировала на клик без объяснения причины. Фикс: подсказка
 * «Поставьте оценку, чтобы оставить отзыв» под текстовым полем, пока
 * звёзды не выставлены. PR gs-frontend#331.
 */
describe("ModalReview", () => {
    it("показывает подсказку про оценку, пока звёзды не выставлены", () => {
        renderWithProviders(
            <ModalReview
                isOpen
                onClose={() => {}}
                titleText="Отзыв"
                sendReview={() => {}}
                value={{ stars: undefined, text: "" }}
                onChange={() => {}}
            />,
        );

        expect(screen.getByText("Поставьте оценку, чтобы оставить отзыв")).toBeInTheDocument();
    });

    it("не показывает подсказку, когда звёзды уже выставлены", () => {
        renderWithProviders(
            <ModalReview
                isOpen
                onClose={() => {}}
                titleText="Отзыв"
                sendReview={() => {}}
                value={{ stars: 5, text: "" }}
                onChange={() => {}}
            />,
        );

        expect(
            screen.queryByText("Поставьте оценку, чтобы оставить отзыв"),
        ).not.toBeInTheDocument();
    });
});
