import React from "react";
import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AdminOrganizationSettings } from "./AdminOrganizationSettings";

const toggle = vi.fn();
const remove = vi.fn();
const activate = vi.fn();
const navigate = vi.fn();
const ok = () => ({ unwrap: () => Promise.resolve() });

vi.mock("react-router-dom", () => ({ useNavigate: () => navigate }));
vi.mock("@/app/providers/LocaleProvider", () => ({ useLocale: () => ({ locale: "ru" }) }));
const mutation = (spy: (...args: unknown[]) => unknown) => [
    (...args: unknown[]) => { spy(...args); return ok(); },
    { isLoading: false },
];

vi.mock("@/entities/Admin", () => ({
    useToggleAdminOrganizationActiveMutation: () => mutation(toggle),
    useDeleteOrganizationMutation: () => mutation(remove),
    useActivateOrganizationMembershipMutation: () => mutation(activate),
}));
vi.mock("@/shared/ui/ConfirmActionModal/ConfirmActionModal", () => ({
    ConfirmActionModal: (
        { isModalOpen, onConfirm }: { isModalOpen: boolean; onConfirm: () => void },
    ) => (isModalOpen ? <button type="button" onClick={onConfirm}>Подтвердить</button> : null),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = { isActive: true, isHostMembership: false } as any;

/** Кнопки в карточке организации в админке раньше ничего не отправляли. */
describe("AdminOrganizationSettings", () => {
    beforeEach(() => { vi.clearAllMocks(); });

    it("«Выдать членство» вызывает API выдачи членства организации (GS-199)", async () => {
        render(<AdminOrganizationSettings organizationId="org-1" data={data} />);
        fireEvent.click(screen.getByText("Выдать членство"));
        fireEvent.click(screen.getByText("Подтвердить"));
        await vi.waitFor(() => expect(activate).toHaveBeenCalledWith("org-1"));
    });

    it("«Заблокировать» и «Удалить» вызывают API, а не только показывают уведомление", async () => {
        render(<AdminOrganizationSettings organizationId="org-1" data={data} />);
        fireEvent.click(screen.getByText("Заблокировать организацию"));
        fireEvent.click(screen.getByText("Подтвердить"));
        await vi.waitFor(() => expect(toggle).toHaveBeenCalledWith("org-1"));

        fireEvent.click(screen.getByText("Удалить организацию"));
        fireEvent.click(screen.getByText("Подтвердить"));
        await vi.waitFor(() => expect(remove).toHaveBeenCalledWith("org-1"));
        await vi.waitFor(() => expect(navigate).toHaveBeenCalled());
    });

    it("если членство уже есть — кнопка выдачи неактивна", () => {
        render(<AdminOrganizationSettings organizationId="org-1" data={{ ...data, isHostMembership: true }} />);
        expect((screen.getByText("Членство уже есть").closest("button") as HTMLButtonElement).disabled).toBe(true);
    });
});
