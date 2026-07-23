import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";
import { WorkingHoursField } from "./WorkingHoursField";

describe("WorkingHoursField", () => {
    it("не даёт ввести больше 24 часов, если период — день", async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <WorkingHoursField value={{ hours: 6, dayOff: 0, timeType: "day" }} onChange={onChange} />,
        );

        const input = screen.getByRole("spinbutton");
        await userEvent.clear(input);
        await userEvent.type(input, "42");

        expect(onChange).not.toHaveBeenCalledWith(expect.objectContaining({ hours: 42 }));
    });

    it("разрешает ввод в пределах суточного максимума", async () => {
        const onChange = vi.fn();
        renderWithProviders(
            <WorkingHoursField value={{ hours: 6, dayOff: 0, timeType: "day" }} onChange={onChange} />,
        );

        const input = screen.getByRole("spinbutton");
        await userEvent.clear(input);
        await userEvent.type(input, "20");

        expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hours: 20 }));
    });
});
