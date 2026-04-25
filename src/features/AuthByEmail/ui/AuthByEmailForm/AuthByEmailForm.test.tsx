import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { AuthByEmailForm } from "./AuthByEmailForm";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
    initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/features/AuthByEmail/ui/AuthByEmailHelp/AuthByEmailHelp", () => ({
    AuthByEmailHelp: () => null,
}));

describe("AuthByEmailForm", () => {
    it("рендерит поля email и пароль", () => {
        const { container } = renderWithProviders(<AuthByEmailForm />);
        expect(container.querySelector("input[type='email']")).toBeInTheDocument();
        expect(container.querySelector("input[type='password']")).toBeInTheDocument();
    });

    it("кнопка входа присутствует и активна", () => {
        renderWithProviders(<AuthByEmailForm />);
        expect(screen.getByRole("button", { name: /войти/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /войти/i })).not.toBeDisabled();
    });

    it("вызывает onSuccess после успешного логина", async () => {
        const onSuccess = vi.fn();
        const { container } = renderWithProviders(<AuthByEmailForm onSuccess={onSuccess} />);

        await userEvent.type(
            container.querySelector("input[type='email']")!,
            "user@test.com",
        );
        await userEvent.type(
            container.querySelector("input[type='password']")!,
            "password123",
        );
        await userEvent.click(screen.getByRole("button", { name: /войти/i }));

        await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
    });

    it("вызывает onError при ошибке 401 от сервера", async () => {
        server.use(
            rest.post("*/api/v1/token", (req, res, ctx) =>
                res(ctx.status(401), ctx.json({ message: "Неверный email или пароль" })),
            ),
        );

        const onError = vi.fn();
        const { container } = renderWithProviders(<AuthByEmailForm onError={onError} />);

        await userEvent.type(
            container.querySelector("input[type='email']")!,
            "wrong@test.com",
        );
        await userEvent.type(
            container.querySelector("input[type='password']")!,
            "wrongpass",
        );
        await userEvent.click(screen.getByRole("button", { name: /войти/i }));

        await waitFor(() => expect(onError).toHaveBeenCalled());
    });
});
