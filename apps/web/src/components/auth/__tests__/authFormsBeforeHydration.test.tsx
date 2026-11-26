import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ResetPasswordConfirm, ResetPasswordRequest } from "../ResetPasswordForms";
import { SignUpForm } from "../SignUpForm";
import { VerifyEmailSend } from "../VerifyEmailSend";
import { expectSafeBeforeHydration } from "./beforeHydration";

vi.mock("@/components/session/SessionProvider", () => ({
    useSession: () => ({ status: "loading", token: null }),
}));

const signUpLabels = {
    password: "Пароль", submit: "Присоединиться", required: "Обязательно", weakPassword: "Слабый", duplicate: "Занято",
    invalid: "Ошибка", maybeRegistered: "Уже есть?", signIn: "Войти", forgot: "Забыли пароль?", consent: "Хочу получать письма",
    consentHint: "Можно отписаться", acceptBefore: "Принимаю", privacyPolicy: "политику", noPosting: "Без публикаций", deleted: "Удалён",
};

/** Серверная разметка — то, что видит человек до загрузки скриптов */
describe("формы авторизации до гидратации (как вход, GS-335)", () => {
    it("регистрация: почта и пароль, галочка согласия неконтролируемая и стоит", () => {
        const html = renderToString(createElement(SignUpForm, {
            locale: "ru", signInHref: "/signin", resetHref: "/reset-password", privacyHref: "/privacy", confirmHref: "/confirm",
            profileHref: "/start", labels: signUpLabels,
        }));
        expectSafeBeforeHydration(html, 2);
        const checkbox = html.match(/<input[^>]*type="checkbox"[^>]*>/)?.[0] ?? "";
        expect(checkbox).toContain('checked=""');
    });

    it("сброс пароля: почта", () => {
        const html = renderToString(createElement(ResetPasswordRequest, {
            labels: { send: "Отправить", sentBefore: "", sentAfter: "", spam: "", error: "Ошибка" },
        }));
        expectSafeBeforeHydration(html, 1);
    });

    it("новый пароль: пароль и повтор", () => {
        const html = renderToString(createElement(ResetPasswordConfirm, {
            token: "t", mainHref: "/", labels: { password: "Пароль", repeat: "Повтор", mismatch: "Не совпадают", send: "Сохранить", error: "Ошибка" },
        }));
        expectSafeBeforeHydration(html, 2);
    });

    it("подтверждение почты: почта", () => {
        const html = renderToString(createElement(VerifyEmailSend, {
            mainHref: "/", labels: { submit: "Отправить", note: "", sent: "", resend: "", resendIn: "", error: "Ошибка" },
        }));
        expectSafeBeforeHydration(html, 1);
    });
});
