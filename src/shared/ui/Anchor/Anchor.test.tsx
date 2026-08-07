import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Anchor } from "./Anchor";

/**
 * GS-84: Submenu/Anchor — единственный механизм навигации по вкладкам
 * личного кабинета/профиля (О себе, Умения, Вакансии, ...). Клик ищет
 * элемент по id через document.getElementById и скроллит к нему
 * (offsetTop - topGap). Дублирующийся/отсутствующий id на одной из
 * секций страницы (см. submenuData.test.ts) означает, что этот клик
 * либо ведёт не туда, либо не делает вообще ничего — оба случая должны
 * быть покрыты здесь на уровне самого компонента.
 */
describe("Anchor", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        window.scrollTo = vi.fn();
    });

    it("клик по якорю скроллит к элементу с совпадающим id", () => {
        const target = document.createElement("div");
        target.id = "target-section";
        Object.defineProperty(target, "offsetTop", { value: 800, configurable: true });
        document.body.appendChild(target);

        render(<Anchor id="target-section" title="Раздел" topGap={100} />);
        fireEvent.click(screen.getByText("Раздел"));

        expect(window.scrollTo).toHaveBeenCalledWith({ top: 700, behavior: "smooth" });
    });

    it("клик по якорю без соответствующего элемента на странице ничего не скроллит", () => {
        render(<Anchor id="missing-section" title="Раздел" />);
        fireEvent.click(screen.getByText("Раздел"));

        expect(window.scrollTo).not.toHaveBeenCalled();
    });

    it("вызывает onClick независимо от того, найден ли элемент", () => {
        const onClick = vi.fn();
        render(<Anchor id="missing-section" title="Раздел" onClick={onClick} />);
        fireEvent.click(screen.getByText("Раздел"));

        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
