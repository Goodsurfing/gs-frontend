import { afterEach, describe, expect, it, vi } from "vitest";

import { adminMenu, isClubAdminPath } from "../menu";

const clubLinks = (clubEnabled: boolean) =>
    adminMenu(clubEnabled).flatMap((group) => [group.title, ...group.items.map((item) => item.href)]).filter((value) => /club|Клуб тестировщиков/.test(value));

describe("меню админки: «Клуб тестировщиков» только на стейдже", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetModules();
    });

    it("раздел выключен — ни группы, ни ссылок /admin/club", () => {
        expect(clubLinks(false)).toEqual([]);
        expect(adminMenu(false).some((group) => group.title === "Система")).toBe(true);
    });

    it("раздел включён — группа и все пять страниц", () => {
        expect(clubLinks(true)).toEqual([
            "Клуб тестировщиков",
            "/admin/club",
            "/admin/club/participants",
            "/admin/club/completions",
            "/admin/club/reports",
            "/admin/club/tasks",
        ]);
    });

    it("сборка без NEXT_PUBLIC_CLUB_ADMIN (прод, локально) — пункта нет", async () => {
        vi.stubEnv("NEXT_PUBLIC_CLUB_ADMIN", "");
        vi.resetModules();
        const menu = await import("../menu");
        expect(menu.CLUB_ADMIN_ENABLED).toBe(false);
        expect(menu.adminMenu().some((group) => group.title === "Клуб тестировщиков")).toBe(false);
    });

    it("сборка стейджа с NEXT_PUBLIC_CLUB_ADMIN=1 — пункт есть", async () => {
        vi.stubEnv("NEXT_PUBLIC_CLUB_ADMIN", "1");
        vi.resetModules();
        const menu = await import("../menu");
        expect(menu.CLUB_ADMIN_ENABLED).toBe(true);
        expect(menu.adminMenu().some((group) => group.title === "Клуб тестировщиков")).toBe(true);
    });

    it("адреса раздела клуба (их proxy.ts закрывает 404 без раздела)", () => {
        for (const path of ["/admin/club", "/admin/club/", "/admin/club/participants", "/en/admin/club/tasks", "/ru/admin/club"]) {
            expect(isClubAdminPath(path)).toBe(true);
        }
        for (const path of ["/admin", "/admin/clubs", "/admin/users", "/club", "/membership"]) {
            expect(isClubAdminPath(path)).toBe(false);
        }
    });
});
