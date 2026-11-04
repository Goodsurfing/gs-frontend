"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import { Spinner } from "@/components/ui/Spinner";
import { AdminApiError, useAdminApi } from "@/lib/admin/api";
import { ADMIN_MENU, isMenuItemActive } from "@/lib/admin/menu";

type Access = "checking" | "allowed" | "error";

/**
 * Каркас админки: шапка, меню разделов, содержимое. Гость — на /admin/sign-in
 * (после входа — на главную админки).
 * Роли в профиле нет, поэтому права проверяются пробным запросом к API админки:
 * 403 — не администратор (сам API всё равно проверяет роль на каждом запросе).
 */
export function AdminShell({ children }: { children: ReactNode }) {
    const session = useSession();
    const api = useAdminApi();
    const pathname = usePathname();
    const [access, setAccess] = useState<Access>("checking");
    // Меню на телефоне открыто только на той странице, где его открыли: переход по пункту его закрывает
    const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
    const menuOpen = menuOpenAt === pathname;

    useEffect(() => {
        if (session.status === "guest") {
            window.location.replace("/admin/sign-in");
            return;
        }
        if (session.status !== "user") return;
        let cancelled = false;
        api.get("user", { page: 1, limit: 1 })
            .then(() => !cancelled && setAccess("allowed"))
            .catch((e: unknown) => {
                if (cancelled) return;
                // Не администратор — на вход в админку с пояснением (так же уводила старая админка)
                if (e instanceof AdminApiError && (e.status === 403 || e.status === 401)) window.location.replace("/admin/sign-in?denied=1");
                else setAccess("error");
            });
        return () => {
            cancelled = true;
        };
    }, [session.status, api]);

    if (access !== "allowed") {
        return (
            <div className="flex min-h-screen items-center justify-center p-6 text-center">
                {access === "checking" && <Spinner />}
                {access === "error" && (
                    <div>
                        <p className="mb-4 text-[18px] font-semibold">Не удалось связаться с сервером</p>
                        <button type="button" className="cursor-pointer rounded-[8px] bg-primary px-5 py-2.5 text-white" onClick={() => window.location.reload()}>Обновить страницу</button>
                    </div>
                )}
            </div>
        );
    }

    const profile = session.profile as { firstName?: string | null; lastName?: string | null; email?: string | null } | null;
    const name = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || profile?.email || "";

    return (
        <div className="flex min-h-screen flex-col bg-page text-[14px]">
            <header className="sticky top-0 z-30 flex h-[56px] items-center gap-4 bg-primary px-5 text-white">
                <button type="button" className="hidden cursor-pointer text-[22px] down-lg:block" aria-label="Меню разделов" aria-expanded={menuOpen} onClick={() => setMenuOpenAt(menuOpen ? null : pathname)}>☰</button>
                <Link href="/admin" className="text-[16px] font-bold">Гудсёрфинг · Админка</Link>
                <span className="ml-auto truncate opacity-90 down-sm:hidden">{name}</span>
                <Link href="/" className="rounded-[6px] border border-white/60 px-3 py-1 hover:bg-white/10">На сайт</Link>
                <button type="button" className="cursor-pointer rounded-[6px] border border-white/60 px-3 py-1 hover:bg-white/10" onClick={() => void session.logout().then(() => window.location.replace("/admin/sign-in"))}>Выйти</button>
            </header>
            <div className="flex flex-1">
                <nav aria-label="Разделы админки" className={`w-[250px] shrink-0 overflow-y-auto border-r border-accent-bg bg-white p-3 down-lg:fixed down-lg:inset-y-[56px] down-lg:left-0 down-lg:z-20 down-lg:shadow-lg ${menuOpen ? "" : "down-lg:hidden"}`}>
                    {ADMIN_MENU.map((group) => (
                        <div key={group.title} className="mb-3">
                            <p className="px-2 pb-1 text-[11px] font-semibold tracking-wide text-muted uppercase">{group.title}</p>
                            {group.items.map((item) => {
                                const active = isMenuItemActive(item.href, pathname);
                                return (
                                    <Link key={item.href} href={item.href} prefetch={false} aria-current={active ? "page" : undefined} className={`block rounded-[6px] px-2 py-1.5 ${active ? "bg-primary/10 font-semibold text-primary" : "hover:bg-field"}`}>
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>
                <main className="min-w-0 flex-1 p-6 down-sm:p-3">{children}</main>
            </div>
        </div>
    );
}
