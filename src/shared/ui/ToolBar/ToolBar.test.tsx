import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { TextEditor } from "../TextEditor/TextEditor";

/**
 * Регресс-guard (row 63): кнопки выравнивания в тулбаре не отражали
 * реальное состояние курсора — при открытии уже выровненного текста
 * ни одна кнопка не подсвечивалась активной, из-за чего казалось,
 * что выравнивание (особенно justify) "не работает".
 */
describe("ToolBar align buttons", () => {
    it("подсвечивает justify активной для уже выровненного текста", () => {
        const html = "<p style=\"text-align: justify\">Уже выровненный текст</p>";
        const { container } = render(
            <TextEditor value={html} onChange={() => {}} onErrorUploadImage={() => {}} />,
        );

        const justifyBtn = container.querySelector("[value=\"justify\"]");
        const leftBtn = container.querySelector("[value=\"left\"]");

        expect(justifyBtn?.getAttribute("aria-pressed")).toBe("true");
        expect(leftBtn?.getAttribute("aria-pressed")).toBe("false");
    });

    it("подсвечивает left активной по умолчанию для невыровненного текста", () => {
        const html = "<p>Обычный текст без выравнивания</p>";
        const { container } = render(
            <TextEditor value={html} onChange={() => {}} onErrorUploadImage={() => {}} />,
        );

        const leftBtn = container.querySelector("[value=\"left\"]");
        const justifyBtn = container.querySelector("[value=\"justify\"]");

        expect(leftBtn?.getAttribute("aria-pressed")).toBe("true");
        expect(justifyBtn?.getAttribute("aria-pressed")).toBe("false");
    });
});
