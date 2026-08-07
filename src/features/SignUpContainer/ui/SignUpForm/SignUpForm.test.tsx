import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import SignUpForm from "./SignUpForm";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
    initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

/**
 * Row: живая жалоба на проде — регистрация с email, который на самом деле
 * принадлежит "призрачному" аккаунту, перенесённому со старого сайта
 * миграцией (91к из 96к пользователей на проде — такие), падает с
 * "Данный пользователь уже существует" без единой подсказки, что делать.
 * Добавили ссылки на вход/сброс пароля рядом с этой конкретной ошибкой.
 */
describe("SignUpForm", () => {
    const fillAndSubmit = async () => {
        await userEvent.type(
            screen.getByRole("textbox"),
            "duplicate@test.com",
        );
        const passwordInput = document.querySelector("input[type='password']")!;
        await userEvent.type(passwordInput, "password123");
        await userEvent.click(screen.getByRole("button", { name: /login.Зарегистрироваться/i }));
    };

    it("показывает ссылки на вход/сброс пароля при ошибке 422 (дубликат email)", async () => {
        server.use(
            rest.post("*/api/v1/users", (req, res, ctx) => res(ctx.status(422), ctx.json({ message: "Данный пользователь уже существует" }))),
        );

        renderWithProviders(<MemoryRouter><SignUpForm /></MemoryRouter>);
        await fillAndSubmit();

        await waitFor(() => {
            expect(screen.getByRole("link", { name: "login.Войти" })).toBeInTheDocument();
        });
        expect(screen.getByRole("link", { name: "login.Забыли пароль?" })).toBeInTheDocument();
        expect(screen.getByText((_, element) => element?.className === "duplicateEmailHint")).toBeInTheDocument();
    });

    it("не показывает ссылки на вход при других ошибках регистрации", async () => {
        server.use(
            rest.post("*/api/v1/users", (req, res, ctx) => res(ctx.status(400), ctx.json({ message: "Некорректно введены данные" }))),
        );

        renderWithProviders(<MemoryRouter><SignUpForm /></MemoryRouter>);
        await fillAndSubmit();

        await waitFor(() => {
            expect(screen.getByText("login.Некорректно введены данные")).toBeInTheDocument();
        });
        expect(screen.queryByText("login.Возможно, вы уже регистрировались.")).not.toBeInTheDocument();
    });
});
