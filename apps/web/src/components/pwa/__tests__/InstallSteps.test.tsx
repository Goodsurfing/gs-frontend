import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { InstallSteps } from "../InstallSteps";

describe("инструкция «Установить на iPhone»", () => {
    it("четыре шага по порядку, значки — встроенные SVG без подписей для экранного диктора", () => {
        const html = renderToString(<InstallSteps labels={{ share: "Поделиться", addToHome: "На экран Домой", add: "Добавить", open: "Открыть" }} />);
        const order = ["Поделиться", "На экран Домой", "Добавить", "Открыть"].map((text) => html.indexOf(text));
        expect(order.every((position, index) => position > 0 && (index === 0 || position > order[index - 1]!))).toBe(true);
        expect(html.match(/<li/g)).toHaveLength(4);
        expect(html).toContain('aria-hidden="true"');
    });
});
