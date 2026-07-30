import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { renderBoldText } from "./renderBoldText";

describe("renderBoldText", () => {
    it("возвращает исходный текст без изменений, если разметки нет", () => {
        const { container } = render(<>{renderBoldText("Обычный текст без выделения")}</>);
        expect(container.textContent).toBe("Обычный текст без выделения");
        expect(container.querySelector("strong")).toBeNull();
    });

    it("оборачивает **текст** в <strong>, убирая звёздочки", () => {
        const { container } = render(<>{renderBoldText("До **важная фраза** после")}</>);

        expect(container.textContent).toBe("До важная фраза после");
        const strong = container.querySelector("strong");
        expect(strong).not.toBeNull();
        expect(strong?.textContent).toBe("важная фраза");
    });

    it("поддерживает несколько выделенных фраз в одном тексте", () => {
        const { container } = render(
            <>{renderBoldText("**Первая.** Обычный текст. **Вторая!**")}</>,
        );

        const strongs = container.querySelectorAll("strong");
        expect(strongs).toHaveLength(2);
        expect(strongs[0].textContent).toBe("Первая.");
        expect(strongs[1].textContent).toBe("Вторая!");
        expect(container.textContent).toBe("Первая. Обычный текст. Вторая!");
    });

    it("не ломается на непарной звёздочке", () => {
        const { container } = render(<>{renderBoldText("Текст с одной * звёздочкой")}</>);

        expect(container.textContent).toBe("Текст с одной * звёздочкой");
        expect(container.querySelector("strong")).toBeNull();
    });
});
