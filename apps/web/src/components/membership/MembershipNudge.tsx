"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MENU_OPEN_ATTR } from "@/components/layout/header/menuState";
import { activeMembership, useSession } from "@/components/session/SessionProvider";
import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";
import { storageGet, storageSet } from "@/lib/safeStorage";

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

/** Сколько после последнего касания или прокрутки ждать, чтобы не открыть окно посреди жеста */
export const NUDGE_QUIET_MS = 1500;
/** Как часто перепроверять, можно ли уже показать */
export const NUDGE_RETRY_MS = 1000;

/**
 * Чем окно сейчас помешало бы (null — можно показывать). Клуб тестеров, 27.11.2026: на iPhone окно
 * открывалось под открытым мобильным меню (у меню свой слой выше) — Radix уже блокировал прокрутку,
 * а окна видно не было, страница «висела». Поэтому ждём: меню закрыто, других окон и плашек
 * («Установить на iPhone», «Включите уведомления») нет, вкладка на экране, человек не листает.
 */
export const nudgeBlocker = (doc: Document, lastGestureAt: number, now: number): string | null => {
    if (doc.visibilityState !== "visible") return "hidden";
    if (doc.documentElement.hasAttribute(MENU_OPEN_ATTR)) return "menu";
    if (doc.querySelector('[role="dialog"], [role="alertdialog"], [data-nudge-blocker]')) return "other";
    if (now - lastGestureAt < NUDGE_QUIET_MS) return "gesture";
    return null;
};

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
        // Автоматическим браузерам (сквозные тесты, боты) не показываем: окно перекрыло бы кнопки посреди теста
        if (window.navigator.webdriver) return;
        if (storageGet(SHOWN_KEY, "session")) return;
        // Отсчёт — от начала визита, а не от загрузки страницы: иначе каждый переход сбрасывал бы 2 минуты
        const startedAt = Number(storageGet(STARTED_KEY, "session")) || Date.now();
        storageSet(STARTED_KEY, String(startedAt), "session");
        let lastGestureAt = 0;
        const gesture = () => { lastGestureAt = Date.now(); };
        const events = ["touchstart", "touchmove", "scroll", "wheel"] as const;
        for (const name of events) window.addEventListener(name, gesture, { passive: true, capture: true });
        let retry = 0;
        const tryShow = () => {
            // Членство подгружается после профиля — проверяем на момент показа
            const now = latest.current;
            if (now.status !== "user" || storageGet(SHOWN_KEY, "session")) return;
            if (activeMembership(now.memberships, "REGULAR") || activeMembership(now.memberships, "INTERNATIONAL")) return;
            if (!nudgeAllowedOn(window.location.pathname)) return;
            if (nudgeBlocker(document, lastGestureAt, Date.now())) {
                retry = window.setTimeout(tryShow, NUDGE_RETRY_MS);
                return;
            }
            storageSet(SHOWN_KEY, "1", "session");
            setOpen(true);
        };
        const timer = window.setTimeout(tryShow, nudgeWaitMs(startedAt, Date.now()));
        return () => {
            window.clearTimeout(timer);
            window.clearTimeout(retry);
            for (const name of events) window.removeEventListener(name, gesture, { capture: true });
        };
    }, [session.status, pathname]);

    if (!open) return null;
    const profile = session.profile as { hostId?: string | null; volunteer?: unknown } | null;
    const host = !!profile?.hostId && !profile?.volunteer;

    const title = host ? labels.hostTitle : labels.volunteerTitle;

    // Без анимации появления: окно видно сразу, как только Radix заблокировал прокрутку.
    // Карточка непрозрачная и белая — на затемнённом фоне не теряется (клуб тестеров, 27.11.2026).
    return (
        <Dialog.Root open onOpenChange={(value) => !value && setOpen(false)}>
            <Dialog.Portal>
                <Dialog.Overlay data-testid="membership-nudge-overlay" className="fixed inset-0 z-[1100] bg-black/60" />
                <Dialog.Content
                    aria-describedby={undefined}
                    data-testid="membership-nudge"
                    className="fixed top-1/2 left-1/2 z-[1101] flex max-h-[calc(100dvh-40px)] w-[calc(100%-40px)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-[16px] bg-white shadow-[0_12px_40px_rgb(0_0_0/35%)]"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element -- декоративная картинка, уже на сайте */}
                    <img src="/web/images/member-banner.webp" alt="" width={420} height={120} className="block h-[120px] w-full shrink-0 bg-field object-cover" />
                    <Dialog.Close
                        aria-label={labels.close}
                        className="absolute top-2.5 right-2.5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-[26px] leading-none text-ink shadow-[0_2px_8px_rgb(0_0_0/30%)]"
                    >
                        ×
                    </Dialog.Close>
                    <div className="flex flex-col items-center gap-5 px-6 pt-5 pb-6">
                        <Dialog.Title className="text-center text-[18px] leading-[130%] font-semibold text-ink">{title}</Dialog.Title>
                        <a
                            href={`${routes.membership(locale)}${host ? "#host" : ""}`}
                            className="flex min-h-12 w-full items-center justify-center rounded-[10px] bg-cta px-5 text-center text-[17px] font-semibold text-white no-underline hover:bg-cta-hover"
                        >
                            {labels.button}
                        </a>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
