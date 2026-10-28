import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UserInfoTable } from "./UserInfoTable";
import { adminUsersAdapter } from "../../lib/adminAdapters";
import type { AdminUser, AdminUsers } from "../../model/types/adminSchema";

const base = {
    created: "01.06.2026",
    lastVisit: "28.10.2026",
    isVerified: true,
    isVolunteer: false,
    isOrganization: true,
    isActive: true,
    isDelete: false,
    isPayment: true,
    endPayment: "06.06.2126",
} as const;

/**
 * Привилегированные членства (бесплатные бессрочные по решению владельца,
 * gs-backend #420) в админке помечены, чтобы не выглядеть аномалией.
 */
describe("UserInfoTable — привилегированное членство", () => {
    it("показывает «Бессрочно» и отметку вместо даты 2126 года", () => {
        render(
            <UserInfoTable
                userId="u1"
                data={{ ...base, isPrivilegedMembership: true } as unknown as AdminUser}
            />,
        );

        expect(screen.getByText("Привилегированное членство")).toBeTruthy();
        expect(screen.getByText("Бессрочно")).toBeTruthy();
        expect(screen.queryByText("06.06.2126")).toBeNull();
    });

    it("обычное членство — с датой окончания", () => {
        render(
            <UserInfoTable
                userId="u1"
                data={{ ...base, endPayment: "05.06.2027", isPrivilegedMembership: false } as unknown as AdminUser}
            />,
        );

        expect(screen.getByText("05.06.2027")).toBeTruthy();
    });

    it("адаптер списка переносит признак, без поля — false", () => {
        const [privileged, regular] = adminUsersAdapter([
            { id: "1", ...base, isPrivilegedMembership: true },
            { id: "2", ...base },
        ] as unknown as AdminUsers[]);

        expect(privileged.isPrivilegedMembership).toBe(true);
        expect(regular.isPrivilegedMembership).toBe(false);
    });
});
