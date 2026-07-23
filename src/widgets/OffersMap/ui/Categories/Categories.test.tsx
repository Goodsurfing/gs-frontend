import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { renderWithProviders } from "@/test-utils";
import { server } from "@/mocks/server";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import { Categories } from "./Categories";

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

const mockCategories = () => server.use(
    rest.get(`*${API_BASE_URL_V3}category/list`, (req, res, ctx) => res(ctx.status(200), ctx.json([
        { id: 10, name: "Археология", color: "#fff" },
        { id: 8, name: "Спорт", color: "#fff" },
    ]))),
);

describe("Categories", () => {
    it("выбирает первое направление, не сбрасывая остальные (не exclusive)", async () => {
        mockCategories();

        const onChange = vi.fn();
        renderWithProviders(
            <Categories value={[]} onChange={onChange} onClick={vi.fn()} isOpen />,
        );

        await waitFor(() => expect(screen.getByText("Археология")).toBeInTheDocument());
        await userEvent.click(screen.getByText("Археология"));

        expect(onChange).toHaveBeenLastCalledWith([10]);
    });

    it("добавляет второе направление к уже выбранному, а не заменяет его", async () => {
        mockCategories();

        const onChange = vi.fn();
        renderWithProviders(
            <Categories value={[10]} onChange={onChange} onClick={vi.fn()} isOpen />,
        );

        await waitFor(() => expect(screen.getByText("Спорт")).toBeInTheDocument());
        await userEvent.click(screen.getByText("Спорт"));

        expect(onChange).toHaveBeenLastCalledWith(expect.arrayContaining([10, 8]));
        expect(onChange.mock.calls.at(-1)?.[0]).toHaveLength(2);
    });
});
