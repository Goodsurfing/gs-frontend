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
        expect(screen.getByAltText("Best2Pay")).toBeInTheDocument();
    });

    it("ссылается на best2pay.net при каждом упоминании Best2Pay в тексте", () => {
        render(<TextContent />);

        const links = screen.getAllByRole("link", { name: "Best2Pay" });
        expect(links).toHaveLength(3);
        links.forEach((link) => {
            expect(link).toHaveAttribute("href", "https://best2pay.net/");
            expect(link).toHaveAttribute("target", "_blank");
        });
    });

    it("сохраняет ссылку на страницу платёжного агрегатора", () => {
        render(<TextContent />);

        const link = screen.getByRole("link", { name: "https://best2pay.net/support/raschetnyy-bank/" });
        expect(link).toHaveAttribute("href", "https://best2pay.net/support/raschetnyy-bank/");
    });
});
