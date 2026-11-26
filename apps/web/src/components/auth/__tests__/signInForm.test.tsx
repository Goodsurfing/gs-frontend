import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SignInForm } from "../SignInForm";

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

/** Разметка с сервера — то, что видит человек до загрузки скриптов */
const serverHtml = () => renderToString(createElement(SignInForm, {
    locale: "ru", resetHref: "/reset-password", signUpHref: "/signup", signInHref: "/signin", profileHref: "/start", labels, admin: true,
}));

describe("SignInForm до гидратации", () => {
    it("кнопка «Войти» выключена: браузер не отправит форму GET на /signin?", () => {
        const html = serverHtml();
        expect(html).toMatch(/<button type="submit" disabled=""/);
        expect(html).toMatch(/<form[^>]*method="post"/);
    });

    it("поля неконтролируемые и без name: гидратация не перезапишет введённое, в адрес ничего не попадёт", () => {
        const inputs = serverHtml().match(/<input[^>]*type="(email|password)"[^>]*>/g) ?? [];
        expect(inputs).toHaveLength(2);
        for (const input of inputs) {
            expect(input).not.toMatch(/\svalue=/);
            expect(input).not.toMatch(/\sname=/);
            expect(input).toContain('placeholder=" "');
        }
    });
});
