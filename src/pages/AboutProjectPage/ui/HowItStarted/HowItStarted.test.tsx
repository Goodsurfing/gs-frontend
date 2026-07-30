import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItStarted } from "./HowItStarted";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

/**
 * GS-85: как и Mission, текст "Как всё началось" — plain-текст из админки,
 * **bold** синтаксис даёт админу управлять выделением (см. renderBoldText.test.tsx).
 */
describe("HowItStarted", () => {
    it("выделяет жирным фразы в **...** и оставляет остальной текст как есть", () => {
        render(<HowItStarted description="Обычный текст. **Важная фраза.** Ещё текст." />);

        const strong = screen.getByText("Важная фраза.");
        expect(strong.tagName).toBe("STRONG");
        expect(screen.getByText(/Обычный текст\./)).toBeInTheDocument();
    });
});
