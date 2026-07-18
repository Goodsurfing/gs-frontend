import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonClose } from "./ButtonClose";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => `translated:${key}` }),
}));

/**
 * Регресс-guard (ROW 107): текст "Вернуться к карте" на /offers-map был
 * захардкожен на русском в обход i18n — не переводился на en/es. Проверяем,
 * что текст реально проходит через t(), а не выводится как литерал —
 * мокаем t() так, чтобы захардкоженный текст точно не совпал.
 */
describe("ButtonClose", () => {
    it("выводит текст через t(), а не хардкодит его напрямую", () => {
        render(<ButtonClose value onChange={() => {}} />);

        expect(screen.getByText("translated:Вернуться к карте")).toBeInTheDocument();
        expect(screen.queryByText("Вернуться к карте")).not.toBeInTheDocument();
    });
});
