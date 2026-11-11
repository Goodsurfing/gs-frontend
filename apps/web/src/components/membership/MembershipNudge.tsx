"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MemberBanner } from "@/components/content/MemberBanner";
import { activeMembership, useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/i18n/config";

/** Через сколько после входа на сайт показать предложение (как в старом SPA, GS-174) */
export const NUDGE_DELAY_MS = 2 * 60 * 1000;
const SESSION_KEY = "membershipTimedPopupShown";
/** Где не показываем: страницы членства и оплаты, вход, админка */
const SKIP = /^\/(?:(?:en|es|ru)\/)?(?:membership|payment|signin|signup|admin)(?:\/|$)/;

export const nudgeAllowedOn = (pathname: string): boolean => !SKIP.test(pathname);

/**
 * Предложение членства через 2 минуты после входа на сайт — один раз за визит (вкладку), только
 * вошедшим без членства. Было в старом SPA (GS-174) и пропало при переезде 03.11.2026; без него
 * до оплаты почти перестали доходить: неделя 26.10 — 24 попытки, 09.11 — одна. Организатору
 * (есть организация, нет роли волонтёра) — предложение членства организатора.
 */
export function MembershipNudge({ locale, labels }: {
    locale: Locale;
    labels: { volunteerTitle: string; hostTitle: string; button: string; close: string };
}) {
    const session = useSession();
    const pathname = usePathname() ?? "";
    const [open, setOpen] = useState(false);
    const latest = useRef(session);
    useEffect(() => {
        latest.current = session;
    }, [session]);
    const scheduled = useRef(false);

    useEffect(() => {
        if (scheduled.current || session.status !== "user" || !nudgeAllowedOn(pathname)) return;
        if (window.sessionStorage.getItem(SESSION_KEY)) return;
        scheduled.current = true;
        window.sessionStorage.setItem(SESSION_KEY, "1");
        const timer = window.setTimeout(() => {
            // Членство подгружается после профиля — проверяем на момент показа
            const now = latest.current;
            if (now.status !== "user") return;
            if (activeMembership(now.memberships, "REGULAR") || activeMembership(now.memberships, "INTERNATIONAL")) return;
            if (!nudgeAllowedOn(window.location.pathname)) return;
            setOpen(true);
        }, NUDGE_DELAY_MS);
        return () => window.clearTimeout(timer);
    }, [session.status, pathname]);

    if (!open) return null;
    const profile = session.profile as { hostId?: string | null; volunteer?: unknown } | null;
    const host = !!profile?.hostId && !profile?.volunteer;

    return (
        <Dialog.Root open onOpenChange={(value) => !value && setOpen(false)}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in items-center justify-center bg-black/50 p-5">
                    <Dialog.Content aria-describedby={undefined} className="relative w-full max-w-[468px]">
                        <Dialog.Title className="sr-only">{host ? labels.hostTitle : labels.volunteerTitle}</Dialog.Title>
                        <Dialog.Close aria-label={labels.close} className="absolute top-2 right-2 z-[1] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/40 text-[20px] leading-none text-white">×</Dialog.Close>
                        <MemberBanner
                            locale={locale}
                            title={host ? labels.hostTitle : labels.volunteerTitle}
                            button={labels.button}
                            anchor={host ? "host" : undefined}
                            className="rounded-[10px] max-w-none"
                        />
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
