import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import {
    render, screen, fireEvent, waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MembershipVerifiedBadge } from "./MembershipVerifiedBadge";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const renderBadge = () => render(
    <MemoryRouter>
        <MembershipVerifiedBadge />
    </MemoryRouter>,
);

/**
 * GS-150: раньше тултип открывался только на hover (недоступно на
 * мобильных) и называл единственную роль «гудсёрфер», хотя значок стоит
 * и у организаторов. Фикс — ролевой-нейтральный текст + клик/тап для
 * открытия/закрытия подсказки.
 */
describe("MembershipVerifiedBadge", () => {
    it("открывает подсказку по клику на иконку", () => {
        renderBadge();

        expect(screen.queryByText(/Верифицированный пользователь/)).not.toBeInTheDocument();

        fireEvent.click(screen.getByAltText("member"));

        expect(screen.getByText(/Верифицированный пользователь/)).toBeInTheDocument();
        const link = screen.getByRole("link", { name: "personal.Как это сделать?" });
        expect(link).toHaveAttribute("href", expect.stringContaining("/membership"));
    });

    it("повторный клик закрывает подсказку", async () => {
        renderBadge();

        const icon = screen.getByAltText("member");
        fireEvent.click(icon);
        expect(screen.getByText(/Верифицированный пользователь/)).toBeInTheDocument();

        fireEvent.click(icon);
        await waitFor(() => {
            expect(screen.queryByText(/Верифицированный пользователь/)).not.toBeInTheDocument();
        });
    });

    it("не называет конкретную роль («гудсёрфер») — текст общий для волонтёра и хоста", () => {
        renderBadge();

        fireEvent.click(screen.getByAltText("member"));

        expect(screen.queryByText(/гудсёрфер/i)).not.toBeInTheDocument();
    });
});
