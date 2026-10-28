import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuotaDiagram } from "./QuotaDiagram";

/** GS-188: счётчик лимита круговой диаграммой. */
describe("QuotaDiagram", () => {
    it("показывает остаток из лимита и подпись", () => {
        render(<QuotaDiagram remaining={2} limit={3} label="Откликов осталось" />);
        expect(screen.getByTestId("quota-value").textContent).toBe("2/3");
        expect(screen.getByText("Откликов осталось")).toBeTruthy();
    });

    it("без ограничений — знак бесконечности и полное кольцо", () => {
        const { container } = render(<QuotaDiagram remaining={null} limit={3} label="Без ограничений" />);
        expect(screen.getByTestId("quota-value").textContent).toBe("∞");
        expect(container.querySelectorAll("circle")).toHaveLength(2);
    });

    it("при нуле не рисует закрашенную часть и не уходит в минус", () => {
        const { container } = render(<QuotaDiagram remaining={-1} limit={3} label="Откликов осталось" />);
        expect(screen.getByTestId("quota-value").textContent).toBe("0/3");
        expect(container.querySelectorAll("circle")).toHaveLength(1);
    });
});
