import React from "react";
import {
    describe, it, expect, vi,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AdminOfferWhatToDo } from "./AdminOfferWhatToDo";

vi.mock("@/shared/lib/getErrorText", () => ({
    getErrorText: () => "error",
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@/entities/Admin", async () => {
    const actual = await vi.importActual<typeof import("@/entities/Admin")>("@/entities/Admin");
    return {
        ...actual,
        useGetAdminVacancyWhatToDoQuery: () => ({ data: undefined, isLoading: false }),
        useUpdateAdminVacancyWhatToDoMutation: () => [vi.fn(), { isLoading: false }],
        useGetPublicSkillsQuery: () => ({ data: [], isLoading: false }),
    };
});

/**
 * GS-165: "Дальше" уводил из мастера редактирования вакансии в админке на
 * глобальный /admin/conditions-vacancies вместо следующего шага мастера
 * /admin/vacancy/conditions/{id} — перепутанная функция построения URL
 * (getAdminConditionsVacanciesPageUrl вместо getAdminVacancyConditionsPageUrl).
 */
describe("AdminOfferWhatToDo — переход «Дальше»", () => {
    it("ведёт на шаг «Условия» этой же вакансии, а не на общий список условий", () => {
        render(
            <MemoryRouter>
                <AdminOfferWhatToDo offerId="7241" />
            </MemoryRouter>,
        );

        const nextLink = screen.getByRole("link", { name: "Дальше" });
        expect(nextLink).toHaveAttribute("href", "/ru/admin/vacancy/conditions/7241");
    });
});
