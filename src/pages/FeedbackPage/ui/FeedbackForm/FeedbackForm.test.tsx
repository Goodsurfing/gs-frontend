import React from "react";
import {
    describe, it, expect,
} from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { FeedbackForm } from "./FeedbackForm";

/**
 * Row 52: форма обратной связи — "Напишите нам" в футере раньше вело на
 * голый vk.com. Позже форма стала плавающей модалкой поверх виджета
 * ("Напишите нам" в правом нижнем углу на каждой странице); теперь это
 * отдельный экран (`/feedback`), доступный только по ссылке в футере —
 * см. Footer.test.tsx. Регресс-guard на клиентскую валидацию сохраняется:
 * кнопка "Отправить" должна оставаться заблокированной, пока не заполнены
 * все поля и email не проходит базовую проверку формата.
 */
describe("FeedbackForm", () => {
    it("кнопка отправки заблокирована, пока форма не заполнена", () => {
        renderWithProviders(<FeedbackForm />);

        expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
    });

    it("кнопка остаётся заблокированной при некорректном email", () => {
        renderWithProviders(<FeedbackForm />);

        fireEvent.change(screen.getByLabelText("Ваше имя"), { target: { value: "Роман" } });
        fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "not-an-email" } });
        fireEvent.change(screen.getByLabelText("Сообщение"), { target: { value: "Привет" } });

        expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
    });

    it("кнопка разблокируется, когда все поля заполнены корректно", () => {
        renderWithProviders(<FeedbackForm />);

        fireEvent.change(screen.getByLabelText("Ваше имя"), { target: { value: "Роман" } });
        fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "roman@test.com" } });
        fireEvent.change(screen.getByLabelText("Сообщение"), { target: { value: "Привет" } });

        expect(screen.getByRole("button", { name: "Отправить" })).toBeEnabled();
    });
});
