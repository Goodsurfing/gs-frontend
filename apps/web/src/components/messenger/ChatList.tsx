"use client";

import { useMemo, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import type { Locale } from "@/i18n/config";
import { mediaUrl } from "@/lib/media";
import { type Chat, CHAT_TABS, chatInTab, type ChatTab, formatDateRange, formatListTime, readByOthers, statusChip } from "@/lib/messenger";

import { ReadMark } from "./ReadMark";
import { type StatusLabels, StatusBadge } from "./StatusBadge";

export interface ChatListLabels {
    search: string;
    tabs: Record<ChatTab, string>;
    statuses: StatusLabels;
    you: string;
    attachment: string;
    application: string;
    noDate: string;
    noName: string;
    empty: string;
    emptyTab: string;
    loadError: string;
    retry: string;
    read: string;
}

const STEP = 30;

/**
 * Список переписок (как входящие в Worldpackers): поиск, вкладки «Все»,
 * «Непрочитанные», «Ждут ответа», «Принятые»; в строке — собеседник, время,
 * вакансия с датами и статусом заявки, последнее сообщение («Вы: …» со
 * значком прочтения) и число непрочитанных. Строки дорисовываются при
 * прокрутке по 30, чтобы длинный список не тормозил слабые телефоны.
 */
export function ChatList({ locale, chats, loaded, failed, onRetry, myId, viewerIsVolunteer, selectedId, chatHref, onOpen, search, onSearch, labels, className = "" }: {
    locale: Locale;
    chats: Chat[];
    loaded: boolean;
    failed: boolean;
    onRetry: () => void;
    myId: string | undefined;
    viewerIsVolunteer: (chat: Chat) => boolean;
    selectedId?: string;
    chatHref: (id: number) => string;
    onOpen: (id: number) => void;
    search: string;
    onSearch: (value: string) => void;
    labels: ChatListLabels;
    className?: string;
}) {
    const [tab, setTab] = useState<ChatTab>("all");
    const [visible, setVisible] = useState(STEP);
    const counts = useMemo(() => Object.fromEntries(CHAT_TABS.map((value) => [value, chats.filter((chat) => chatInTab(chat, value, myId)).length])) as Record<ChatTab, number>, [chats, myId]);
    const filtered = useMemo(() => chats.filter((chat) => chatInTab(chat, tab, myId)), [chats, tab, myId]);
    const shown = filtered.slice(0, visible);

    return (
        <div className={`flex h-full w-full max-w-[400px] min-w-[300px] flex-col border-r border-accent-bg bg-white ${className}`}>
            <div className="flex flex-col gap-2 border-b border-accent-bg px-4 pt-4">
                <input
                    type="search"
                    value={search}
                    aria-label={labels.search}
                    placeholder={labels.search}
                    onChange={(event) => onSearch(event.target.value)}
                    className="h-10 w-full rounded-full border border-accent-bg bg-field px-4 text-[14px] outline-none placeholder:text-caption focus:border-primary focus:bg-white"
                />
                <div role="tablist" aria-label={labels.search} className="-mx-4 flex overflow-x-auto px-2 [scrollbar-width:none]">
                    {CHAT_TABS.map((value) => {
                        const active = tab === value;
                        const count = value === "unread" || value === "awaiting" ? counts[value] : 0;
                        return (
                            <button
                                key={value}
                                type="button"
                                role="tab"
                                aria-selected={active}
                                onClick={() => {
                                    setTab(value);
                                    setVisible(STEP);
                                }}
                                className={`-mb-px flex h-10 shrink-0 cursor-pointer items-center gap-1 border-0 border-b-2 bg-transparent px-2 text-[13px] font-medium whitespace-nowrap transition-colors ${active ? "border-primary text-primary" : "border-transparent text-caption hover:text-ink-secondary"}`}
                            >
                                {labels.tabs[value]}
                                {count > 0 && <span className={`rounded-full px-1.5 text-[11px] leading-[18px] ${active ? "bg-primary text-white" : "bg-field text-caption"}`}>{count}</span>}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div
                className="relative flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto"
                onScroll={(event) => {
                    const box = event.currentTarget;
                    if (box.scrollTop + box.clientHeight >= box.scrollHeight * 0.7 && visible < filtered.length) setVisible((value) => value + STEP);
                }}
            >
                {!loaded && <ListSkeleton />}
                {loaded && failed && chats.length === 0 && (
                    <div className="flex flex-col items-center gap-3 px-6 py-10 text-center text-[14px] text-caption">
                        {labels.loadError}
                        <button type="button" onClick={onRetry} className="cursor-pointer rounded-full border border-primary bg-white px-4 py-1.5 text-[14px] text-primary">{labels.retry}</button>
                    </div>
                )}
                {loaded && !failed && filtered.length === 0 && (
                    <p className="px-6 py-10 text-center text-[14px] text-caption">{chats.length === 0 && !search ? labels.empty : labels.emptyTab}</p>
                )}
                {shown.map((chat) => (
                    <ChatRow
                        key={chat.id}
                        locale={locale}
                        chat={chat}
                        myId={myId}
                        viewerIsVolunteer={viewerIsVolunteer(chat)}
                        active={selectedId === String(chat.id)}
                        href={chatHref(chat.id ?? 0)}
                        onOpen={onOpen}
                        labels={labels}
                    />
                ))}
            </div>
        </div>
    );
}

function ChatRow({ locale, chat, myId, viewerIsVolunteer, active, href, onOpen, labels }: {
    locale: Locale;
    chat: Chat;
    myId: string | undefined;
    viewerIsVolunteer: boolean;
    active: boolean;
    href: string;
    onOpen: (id: number) => void;
    labels: ChatListLabels;
}) {
    const id = chat.id ?? 0;
    const companion = chat.otherParticipants?.[0];
    const name = [companion?.firstName, companion?.lastName].filter(Boolean).join(" ") || labels.noName;
    const unread = chat.countUnreadMessages ?? 0;
    const last = chat.lastMessage;
    const mine = !!last && !!myId && last.author?.id === myId;
    const text = last?.attachments?.length && !last.text ? labels.attachment : (last?.text ?? labels.application);
    const application = chat.application;
    const chip = statusChip(application?.status, viewerIsVolunteer);
    const dates = formatDateRange(locale, application?.startDate, application?.endDate);
    const context = [application?.vacancyTitle, dates].filter(Boolean).join(" · ");

    return (
        <a
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={(event) => {
                if (event.metaKey || event.ctrlKey) return;
                event.preventDefault();
                onOpen(id);
            }}
            className={`relative flex w-full gap-3 border-b border-field px-4 py-3 text-inherit no-underline transition-colors ${active ? "bg-field" : "hover:bg-surface-2"}`}
        >
            {active && <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-primary" />}
            <Avatar src={mediaUrl(companion?.image, "small")} name={name} size={48} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline gap-2">
                    <span className={`min-w-0 flex-1 truncate text-[15px] ${unread ? "font-bold text-ink" : "font-medium text-ink-secondary"}`}>{name}</span>
                    <span className={`shrink-0 text-[12px] ${unread ? "font-semibold text-primary" : "text-caption"}`}>{formatListTime(locale, last?.createdAt)}</span>
                </div>
                {(chip || context) && (
                    <div className="flex min-w-0 items-center gap-2">
                        {chip && <StatusBadge chip={chip} labels={labels.statuses} />}
                        {context && <span className="min-w-0 truncate text-[12px] text-caption">{context}</span>}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <span className={`min-w-0 flex-1 truncate text-[13px] ${unread ? "font-medium text-ink-secondary" : "text-caption"}`}>
                        {mine && <ReadMark read={readByOthers(last, myId)} label={labels.read} />}
                        {mine && `${labels.you} `}
                        {text}
                    </span>
                    {unread > 0 && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
                            {unread > 99 ? "99+" : unread}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}

/** Заглушка списка, пока грузится: место под строки зарезервировано */
function ListSkeleton() {
    return (
        <div aria-hidden className="flex flex-col">
            {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="flex gap-3 border-b border-field px-4 py-3">
                    <span className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-field" />
                    <div className="flex flex-1 flex-col gap-2 pt-1">
                        <span className="h-3.5 w-1/2 animate-pulse rounded bg-field" />
                        <span className="h-3 w-3/4 animate-pulse rounded bg-field" />
                        <span className="h-3 w-2/3 animate-pulse rounded bg-field" />
                    </div>
                </div>
            ))}
        </div>
    );
}
