"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

import { currentDisplayEnv, INSTALL_HINT_DISMISSED_KEY, INSTALL_HINT_SESSION_KEY, INSTALL_HINT_SHOWN_KEY, parseTimestamp, shouldShowInstallHint } from "@/lib/pwa";
import { storageGet, storageSet } from "@/lib/safeStorage";

import { AddToHomeIcon, InstallSteps, type InstallStepsLabels } from "./InstallSteps";

export interface IosInstallHintLabels {
    text: string;
    how: string;
    later: string;
    title: string;
    note: string;
    more: string;
    close: string;
    steps: InstallStepsLabels;
}

/**
 * Ненавязчивая плашка «Установите Гудсёрфинг на iPhone» — в кабинете и в
 * сообщениях, где нужны уведомления: на iPhone веб-пуши приходят только сайту,
 * добавленному на экран «Домой». Только Safari на iPhone и только если сайт
 * открыт не с экрана «Домой»; не чаще раза в 7 дней (в одном визите — на всех
 * страницах), «Позже» прячет на 14 дней. «Как установить» —
 * окно с пошаговой инструкцией. Пока браузер не проверил условия — ничего
 * (на сервере и у остальных посетителей плашки нет, вёрстка не прыгает).
 */
export function IosInstallHint({ appHref, labels, className = "" }: { appHref: string; labels: IosInstallHintLabels; className?: string }) {
    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const now = Date.now();
        const show = shouldShowInstallHint(currentDisplayEnv(), {
            dismissedAt: parseTimestamp(storageGet(INSTALL_HINT_DISMISSED_KEY)),
            shownAt: parseTimestamp(storageGet(INSTALL_HINT_SHOWN_KEY)),
            shownThisSession: storageGet(INSTALL_HINT_SESSION_KEY, "session") !== null,
        }, now);
        if (show && storageGet(INSTALL_HINT_SESSION_KEY, "session") === null) {
            storageSet(INSTALL_HINT_SHOWN_KEY, String(now));
            storageSet(INSTALL_HINT_SESSION_KEY, "1", "session");
        }
        // Определяется только в браузере, после загрузки
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(show);
    }, []);

    if (!visible) return null;

    const later = () => {
        storageSet(INSTALL_HINT_DISMISSED_KEY, String(Date.now()));
        setVisible(false);
        setOpen(false);
    };

    return (
        <div role="region" aria-label={labels.title} data-testid="ios-install-hint" data-nudge-blocker className={`flex flex-col gap-2 rounded-[10px] border border-accent-bg bg-status-new/10 px-4 py-3 text-[13px] text-ink-secondary ${className}`}>
            <span className="flex gap-2">
                <AddToHomeIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {labels.text}
            </span>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={later} className="h-8 cursor-pointer rounded-full border border-accent-bg bg-white px-3 text-[13px] text-ink-tertiary hover:border-primary">{labels.later}</button>
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger asChild>
                        <button type="button" className="h-8 cursor-pointer rounded-full border-0 bg-primary px-4 text-[13px] font-semibold text-white hover:bg-primary-hover">{labels.how}</button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in items-end justify-center bg-black/50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center">
                            <Dialog.Content aria-describedby={undefined} className="flex max-h-full w-full max-w-[440px] flex-col gap-4 overflow-y-auto rounded-[16px] bg-white px-5 py-5">
                                <Dialog.Title className="text-[18px] font-semibold text-ink">{labels.title}</Dialog.Title>
                                <InstallSteps labels={labels.steps} />
                                <p className="text-[13px] leading-[140%] text-caption">{labels.note}</p>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <a href={appHref} className="text-[14px] text-primary underline">{labels.more}</a>
                                    <Dialog.Close asChild>
                                        <button type="button" className="h-9 cursor-pointer rounded-full border-0 bg-primary px-5 text-[14px] font-semibold text-white hover:bg-primary-hover">{labels.close}</button>
                                    </Dialog.Close>
                                </div>
                            </Dialog.Content>
                        </Dialog.Overlay>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </div>
    );
}
