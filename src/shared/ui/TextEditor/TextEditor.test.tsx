import {
    describe, it, expect, vi, afterEach,
} from "vitest";
import { render } from "@testing-library/react";
import { TextEditor } from "./TextEditor";

/**
 * После перехода на tiptap 3: StarterKit сам включает ссылки, подчёркивание и
 * списки. Если не отключить их там, расширения регистрируются дважды (tiptap
 * предупреждает «Duplicate extension names») и разметка может теряться.
 */
describe("TextEditor", () => {
    afterEach(() => vi.restoreAllMocks());

    it("сохраняет подчёркивание, ссылки, списки и выравнивание", () => {
        const html = "<p style=\"text-align: center\"><u>подчёркнуто</u> и "
            + "<a href=\"https://goodsurfing.org\">ссылка</a></p>"
            + "<ul><li><p>пункт</p></li></ul><ol><li><p>первый</p></li></ol>";
        const { container } = render(
            <TextEditor value={html} onChange={() => {}} onErrorUploadImage={() => {}} />,
        );

        const content = container.querySelector(".ProseMirror");
        expect(content?.querySelector("u")?.textContent).toBe("подчёркнуто");
        expect(content?.querySelector("a")?.getAttribute("href")).toBe("https://goodsurfing.org");
        expect(content?.querySelector("ul li")?.textContent).toBe("пункт");
        expect(content?.querySelector("ol li")?.textContent).toBe("первый");
        expect(content?.querySelector("p")?.getAttribute("style")).toContain("text-align: center");
    });

    it("не регистрирует расширения дважды", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(<TextEditor value="<p>текст</p>" onChange={() => {}} onErrorUploadImage={() => {}} />);

        const duplicates = warn.mock.calls.filter((args) => String(args[0]).includes("Duplicate extension"));
        expect(duplicates).toEqual([]);
    });
});
