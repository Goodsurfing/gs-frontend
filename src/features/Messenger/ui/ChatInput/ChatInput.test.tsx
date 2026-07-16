import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChatInput } from "./ChatInput";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

/**
 * Регресс-guard: на странице заявки на вакансию (/messenger/create/{offerId})
 * поле ввода намеренно disabled — отправка сообщения тут ещё не поддерживается
 * (сначала нужно отправить даты через TermsApplication). Кнопка отправки
 * disabled корректно блокировала клик, но Enter в textarea не проверял
 * disabled и всё равно вызывал onSendMessage — запрос уходил на chatId
 * "create" и падал с ошибкой (красная плашка), как только пользователь
 * пытался написать что-то и нажать Enter.
 */
describe("ChatInput — disabled", () => {
    it("не отправляет сообщение по Enter, если инпут disabled", () => {
        const onSendMessage = vi.fn();
        render(<ChatInput disabled onSendMessage={onSendMessage} onError={vi.fn()} />);

        const input = screen.getByPlaceholderText("Написать сообщение");
        fireEvent.change(input, { target: { value: "Привет" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(onSendMessage).not.toHaveBeenCalled();
    });

    it("отправляет сообщение по Enter, если инпут не disabled", () => {
        const onSendMessage = vi.fn();
        render(<ChatInput onSendMessage={onSendMessage} onError={vi.fn()} />);

        const input = screen.getByPlaceholderText("Написать сообщение");
        fireEvent.change(input, { target: { value: "Привет" } });
        fireEvent.keyDown(input, { key: "Enter" });

        expect(onSendMessage).toHaveBeenCalledWith({ text: "Привет", attachments: [] });
    });
});
