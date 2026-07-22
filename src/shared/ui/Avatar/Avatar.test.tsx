import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Avatar } from "./Avatar";
import styles from "./Avatar.module.scss";

/**
 * Row: в списке чатов текст последнего сообщения наезжал на аватар вместо
 * того, чтобы идти отдельной строкой справа. Причина — .wrapper в
 * Avatar.module.scss имеет container-type: inline-size (нужен для
 * font-size: 40cqw у буквы-заглушки), но сам не имел явной ширины/высоты.
 * Containment без явного размера схлопывает инлайн-размер элемента в 0 —
 * картинка внутри рисовалась на 56px, а сам flex-item в раскладке родителя
 * занимал 0px, и соседний блок с текстом наезжал поверх неё.
 * Фикс: класс размера (SMALL/MEDIUM/...) применяется не только к
 * содержимому, но и к самой обёртке — тогда у неё есть явный width/height,
 * и containment больше не схлопывает бокс.
 */
describe("Avatar — обёртка не схлопывается в 0 при container-type: inline-size", () => {
    it("получает класс размера на себе, а не только на содержимом", () => {
        const { container } = render(<Avatar icon="/test.jpg" size="MEDIUM" />);
        const wrapper = container.firstElementChild;

        expect(wrapper?.className).toContain(styles.wrapper);
        expect(wrapper?.className).toContain(styles.MEDIUM);
    });

    it("работает и для аватара-заглушки без иконки (буква вместо фото)", () => {
        const { container } = render(<Avatar text="Иван" size="SMALL" />);
        const wrapper = container.firstElementChild;

        expect(wrapper?.className).toContain(styles.wrapper);
        expect(wrapper?.className).toContain(styles.SMALL);
    });
});
