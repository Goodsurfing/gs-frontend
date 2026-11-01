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

/** GS-203: согласие на рассылку и его журнал в карточке пользователя. */
describe("UserInfoTable — согласие на рассылку", () => {
    it("без ответа — «Не давал», без истории", () => {
        render(<UserInfoTable userId="u1" data={base as unknown as AdminUser} />);

        expect(screen.getByText("Не давал")).toBeTruthy();
    });

    it("показывает текущее состояние и журнал с текстом галочки", () => {
        render(
            <UserInfoTable
                userId="u1"
                data={{
                    ...base,
                    marketingConsent: {
                        consent: false,
                        at: "2026-10-29T09:00:00+00:00",
                        source: "profile",
                        history: [
                            {
                                consent: false, source: "profile", at: "2026-10-29T09:00:00+00:00", ip: "10.0.0.1", wording: null,
                            },
                            {
                                consent: true, source: "registration", at: "2026-10-28T09:00:00+00:00", ip: null, wording: "Хочу получать письма",
                            },
                        ],
                    },
                } as unknown as AdminUser}
            />,
        );

        expect(screen.getByText("Отозвано — 29.10.2026, 12:00, профиль")).toBeTruthy();
        expect(screen.getByText("Дал согласие")).toBeTruthy();
        expect(screen.getByText("«Хочу получать письма»")).toBeTruthy();
        expect(screen.getByText(/IP 10\.0\.0\.1/)).toBeTruthy();
    });
});
