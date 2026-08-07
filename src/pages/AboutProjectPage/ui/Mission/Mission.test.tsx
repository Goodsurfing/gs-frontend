import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { Mission } from "./Mission";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

/**
 * GS-85: текст миссии — plain-текст из админки без HTML, **bold** синтаксис
 * даёт админу управлять выделением конкретных фраз (см. renderBoldText.test.tsx).
 */
describe("Mission", () => {
    it("выделяет жирным фразы в **...** и оставляет остальной текст как есть", () => {
        render(<Mission description="Обычный текст. **Важная фраза.** Ещё текст." />);

        const strong = screen.getByText("Важная фраза.");
        expect(strong.tagName).toBe("STRONG");
        expect(screen.getByText(/Обычный текст\./)).toBeInTheDocument();
    });
});
