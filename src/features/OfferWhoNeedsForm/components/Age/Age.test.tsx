import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { AgeComponent } from "./Age";

describe("AgeComponent", () => {
    it("показывает поле «до» и не показывает переключатель включённым, когда есть верхняя граница", () => {
        renderWithProviders(
            <AgeComponent value={{ minAge: 18, maxAge: 55 }} onChange={vi.fn()} />,
        );

        expect(screen.getByPlaceholderText("до")).toBeInTheDocument();
        expect(screen.queryByText("и старше")).not.toBeInTheDocument();
        expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    it("скрывает поле «до» и показывает «и старше», когда достигнут потолок (без ограничения)", () => {
        renderWithProviders(
            <AgeComponent value={{ minAge: 18, maxAge: 100 }} onChange={vi.fn()} />,
        );

        expect(screen.queryByPlaceholderText("до")).not.toBeInTheDocument();
        expect(screen.getByText("whoNeeds.и старше")).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("включение переключателя «без ограничения» ставит maxAge в потолок", async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <AgeComponent value={{ minAge: 18, maxAge: 55 }} onChange={onChange} />,
        );

        await userEvent.click(screen.getByRole("checkbox"));

        expect(onChange).toHaveBeenCalledWith({ minAge: 18, maxAge: 100 });
    });

    it("выключение переключателя возвращает maxAge к minAge, чтобы поле «до» снова можно было задать", async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <AgeComponent value={{ minAge: 18, maxAge: 100 }} onChange={onChange} />,
        );

        await userEvent.click(screen.getByRole("checkbox"));

        expect(onChange).toHaveBeenCalledWith({ minAge: 18, maxAge: 18 });
    });
});
