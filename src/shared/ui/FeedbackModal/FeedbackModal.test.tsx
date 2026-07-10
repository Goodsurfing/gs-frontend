import {
    describe, it, expect,
} from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { FeedbackModal } from "./FeedbackModal";

/**
 * Row 52: форма обратной связи — "Напишите нам" в футере раньше вело на
 * голый vk.com. Регресс-guard на клиентскую валидацию модалки: кнопка
 * "Отправить" должна оставаться заблокированной, пока не заполнены все
 * поля и email не проходит базовую проверку формата.
 */
describe("FeedbackModal", () => {
    it("кнопка отправки заблокирована, пока форма не заполнена", () => {
        renderWithProviders(<FeedbackModal isOpen onClose={() => {}} />);

        expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
    });

    it("кнопка остаётся заблокированной при некорректном email", () => {
        renderWithProviders(<FeedbackModal isOpen onClose={() => {}} />);

        fireEvent.change(screen.getByLabelText("Ваше имя"), { target: { value: "Роман" } });
        fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "not-an-email" } });
        fireEvent.change(screen.getByLabelText("Сообщение"), { target: { value: "Привет" } });

        expect(screen.getByRole("button", { name: "Отправить" })).toBeDisabled();
    });

    it("кнопка разблокируется, когда все поля заполнены корректно", () => {
        renderWithProviders(<FeedbackModal isOpen onClose={() => {}} />);

        fireEvent.change(screen.getByLabelText("Ваше имя"), { target: { value: "Роман" } });
        fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "roman@test.com" } });
        fireEvent.change(screen.getByLabelText("Сообщение"), { target: { value: "Привет" } });

        expect(screen.getByRole("button", { name: "Отправить" })).toBeEnabled();
    });
});
