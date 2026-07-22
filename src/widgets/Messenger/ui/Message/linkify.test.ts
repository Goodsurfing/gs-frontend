import { describe, it, expect } from "vitest";
import { linkify } from "./Message";

/**
 * Хост вставил в сообщение готовый HTML-сниппет (например, код кнопки
 * "поделиться" из Яндекс.Форм) вместо простой ссылки:
 * <a target='_blank' href='https://forms.yandex.ru/u/ID/'>Ссылка на опрос</a>
 *
 * escapeHtml() превращает "'" в "&#39;" и ">" в "&gt;" — если запускать
 * URL_REGEX ПОСЛЕ экранирования (как было раньше), символьный класс
 * [^\s<>"'] перестаёт видеть эти сущности как стоп-символы, и совпадение
 * "прожирает" всё до ближайшего пробела — слово "Ссылка" утекало внутрь
 * href/текста ссылки, а остальной HTML-мусор оставался на странице как
 * видимый текст. linkify() теперь режет URL по границам ДО экранирования.
 */
describe("linkify — граница URL при вставленном HTML-сниппете", () => {
    const RAW = "<a target='_blank' href='https://forms.yandex.ru/u/692e8da3d0468812bcc04afb/'>Ссылка на опрос</a>";

    it("не проглатывает следующее слово после закрывающей кавычки в href", () => {
        const html = linkify(RAW);

        expect(html).toContain("href=\"https://forms.yandex.ru/u/692e8da3d0468812bcc04afb/\"");
        // "Ссылка" не должно оказаться внутри текста ссылки — только сам URL.
        const linkMatch = html.match(/<a href="[^"]*"[^>]*>([^<]*)<\/a>/);
        expect(linkMatch?.[1]).toBe("https://forms.yandex.ru/u/692e8da3d0468812bcc04afb/");
    });

    it("исходный HTML-тег остаётся видимым экранированным текстом, а не исполняется как разметка", () => {
        const html = linkify(RAW);

        expect(html).toContain("&lt;a target=&#39;_blank&#39;");
        expect(html).not.toContain("<a target=");
    });

    it("обычный URL без обрамляющего HTML линкуется как раньше", () => {
        const html = linkify("Смотри https://example.com/path тут");

        expect(html).toBe("Смотри <a href=\"https://example.com/path\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:inherit;text-decoration:underline;word-break:break-all;\">https://example.com/path</a> тут");
    });
});
