import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextContent } from "./TextContent";

describe("TextContent", () => {
    it("показывает логотипы платёжных систем", () => {
        render(<TextContent />);

        expect(screen.getByAltText("Visa")).toBeInTheDocument();
        expect(screen.getByAltText("MasterCard")).toBeInTheDocument();
        expect(screen.getByAltText("МИР")).toBeInTheDocument();
    });

    it("называет платёжным сервисом ЮKassa и ведёт на yookassa.ru", () => {
        render(<TextContent />);

        const links = screen.getAllByRole("link", { name: "ЮKassa" });
        expect(links).toHaveLength(4);
        links.forEach((link) => {
            expect(link).toHaveAttribute("href", "https://yookassa.ru/");
            expect(link).toHaveAttribute("target", "_blank");
        });
    });

    it("не упоминает Best2Pay — с ним больше не работаем", () => {
        const { container } = render(<TextContent />);

        expect(container.textContent).not.toMatch(/best2pay/i);
        expect(container.innerHTML).not.toMatch(/best2pay/i);
    });
});
