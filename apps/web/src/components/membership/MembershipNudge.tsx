"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MemberBanner } from "@/components/content/MemberBanner";
import { activeMembership, useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/i18n/config";

/** Через сколько после входа на сайт показать предложение (как в старом SPA, GS-174) */
export const NUDGE_DELAY_MS = 2 * 60 * 1000;
/** Когда визит начался (мс) и что окно уже показали — в sessionStorage: переходы по ссылкам перезагружают страницу */
const STARTED_KEY = "membershipNudgeStartedAt";
const SHOWN_KEY = "membershipTimedPopupShown";

/** Сколько ещё ждать до показа: 2 минуты от начала визита, но не меньше нуля */
export const nudgeWaitMs = (startedAt: number, now: number): number => Math.max(0, startedAt + NUDGE_DELAY_MS - now);
/** Где не показываем: страницы членства и оплаты, вход, админка */
const SKIP = /^\/(?:(?:en|es|ru)\/)?(?:membership|payment|signin|signup|admin)(?:\/|$)/;

export const nudgeAllowedOn = (pathname: string): boolean => !SKIP.test(pathname);

/**
 * Предложение членства через 2 минуты от начала визита — один раз за визит (вкладку), только
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

    useEffect(() => {
        // Без защиты от повторного запуска: адрес меняется при гидратации (/ru/… → /…), эффект
        // перезапускается и снимает таймер — ставим заново, остаток считается от начала визита
        if (session.status !== "user" || !nudgeAllowedOn(pathname)) return;
        const storage = window.sessionStorage;
        if (storage.getItem(SHOWN_KEY)) return;
        // Отсчёт — от начала визита, а не от загрузки страницы: иначе каждый переход сбрасывал бы 2 минуты
        const startedAt = Number(storage.getItem(STARTED_KEY)) || Date.now();
        storage.setItem(STARTED_KEY, String(startedAt));
        const timer = window.setTimeout(() => {
            // Членство подгружается после профиля — проверяем на момент показа
            const now = latest.current;
            if (now.status !== "user" || storage.getItem(SHOWN_KEY)) return;
            if (activeMembership(now.memberships, "REGULAR") || activeMembership(now.memberships, "INTERNATIONAL")) return;
            if (!nudgeAllowedOn(window.location.pathname)) return;
            storage.setItem(SHOWN_KEY, "1");
            setOpen(true);
        }, nudgeWaitMs(startedAt, Date.now()));
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
