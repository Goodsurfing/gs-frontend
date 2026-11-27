import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/session/SessionProvider", () => ({ useSession: () => ({ status: "user", token: "t" }) }));

import { CheckoutFeedbackCard } from "../CheckoutFeedbackPrompt";

const labels = {
    title: "Что помешало оплатить?",
    hint: "",
    reasons: { expensive: "Дорого", later: "Позже", payment_method: "Нет способа", unclear: "Непонятно", technical: "Ошибка", other: "Другое" },
    comment: "Комментарий",
    submit: "Отправить",
    thanks: "Спасибо",
    error: "Ошибка",
} as never;

const render = (open: boolean) =>
    renderToString(<CheckoutFeedbackCard paymentId="p1" labels={labels} intro="Оплата не завершилась" hide="Скрыть" open={open} onOpen={() => {}} onHide={() => {}} />);

describe("вопрос «Что помешало оплатить?» на странице членства (GS-333)", () => {
    it("на телефоне свёрнут в строку: кнопка видна только на телефоне, варианты скрыты только на телефоне", () => {
        const html = render(false);
        expect(html).toContain('aria-expanded="false"');
        expect(html).toMatch(/class="hidden[^"]*down-md:block[^"]*"[^>]*>Что помешало оплатить\?/);
        expect(html).toContain('class="down-md:hidden"');
        expect(html).toContain("Дорого"); // на компьютере варианты сразу на месте
    });

    it("после нажатия — варианты видны и на телефоне, строки-кнопки нет", () => {
        const html = render(true);
        expect(html).not.toContain('aria-expanded="false"');
        expect(html).not.toContain("down-md:hidden");
        expect(html).toContain("Дорого");
    });
});
