import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, it } from "vitest";

import { SignInForm } from "../SignInForm";
import { expectSafeBeforeHydration } from "./beforeHydration";

const labels = {
    password: "Пароль",
    submit: "Войти",
    remember: "Запомнить меня",
    forgot: "Забыли пароль?",
    notRegistered: "Не зарегистрированы?",
    signUp: "Присоединиться",
    deleted: "Удалён",
    errors: {},
};

describe("SignInForm до гидратации", () => {
    it("кнопка выключена, method=post, почта и пароль неконтролируемые и без name", () => {
        // Разметка с сервера — то, что видит человек до загрузки скриптов
        const html = renderToString(createElement(SignInForm, {
            locale: "ru", resetHref: "/reset-password", signUpHref: "/signup", profileHref: "/start", labels, admin: true,
        }));
        expectSafeBeforeHydration(html, 2);
    });
});
