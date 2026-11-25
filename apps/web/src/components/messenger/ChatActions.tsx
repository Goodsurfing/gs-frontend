"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

/**
 * Меню «Ещё» в шапке переписки (GS-282): «Пожаловаться», «Заблокировать» / «Разблокировать».
 * blocked = null — ещё не знаем, заблокирован ли собеседник: пункта блокировки нет.
 */
export function ChatActions({ blocked, onReport, onBlock, labels }: {
    blocked: boolean | null;
    onReport: () => void;
    onBlock: () => void;
    labels: { menu: string; report: string; block: string; unblock: string };
}) {
    const item = "flex w-full cursor-pointer items-center rounded-[8px] px-3 py-2 text-[14px] text-ink-secondary outline-none transition-colors hover:bg-field data-[highlighted]:bg-field";
    return (
        <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger aria-label={labels.menu} className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-caption transition-colors hover:bg-field data-[state=open]:bg-field">
                <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                {/* Выше открытой переписки на телефоне (она — fixed, z-60) */}
                <DropdownMenu.Content align="end" sideOffset={6} className="z-[70] flex min-w-[200px] animate-fade-in flex-col rounded-[12px] border border-accent-bg bg-white p-1.5 shadow-[0_12px_32px_rgba(14,29,39,0.16)]">
                    <DropdownMenu.Item className={item} onSelect={onReport}>{labels.report}</DropdownMenu.Item>
                    {blocked !== null && (
                        <DropdownMenu.Item className={`${item} ${blocked ? "" : "text-error"}`} onSelect={onBlock}>{blocked ? labels.unblock : labels.block}</DropdownMenu.Item>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
