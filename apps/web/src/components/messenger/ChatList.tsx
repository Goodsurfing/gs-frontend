"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import type { Locale } from "@/i18n/config";
import { mediaUrl } from "@/lib/media";
import { type ApplicationStatus, type Chat, formatMessageDate, STATUS_COLORS } from "@/lib/messenger";

export interface ChatListLabels {
    search: string;
    filter: string;
    statuses: Record<ApplicationStatus, string>;
    attachment: string;
    application: string;
    noDate: string;
    noName: string;
}

const STEP = 20;

/**
 * Список чатов (MessengerList старого фронта): поиск, фильтр по статусу
 * заявки (повторный выбор снимает фильтр), карточки с последним
 * сообщением, датой, числом непрочитанных и цветной точкой статуса; по 20,
 * дальше — при прокрутке.
 */
export function ChatList({ locale, chats, selectedId, chatHref, onOpen, search, onSearch, status, onStatus, labels, className = "" }: {
    locale: Locale;
    chats: Chat[];
    selectedId?: string;
    chatHref: (id: number) => string;
    onOpen: (id: number) => void;
    search: string;
    onSearch: (value: string) => void;
    status: ApplicationStatus | null;
    onStatus: (value: ApplicationStatus | null) => void;
    labels: ChatListLabels;
    className?: string;
}) {
    const [visible, setVisible] = useState(STEP);
    const shown = chats.slice(0, visible);

    return (
        <div className={`flex h-auto w-full max-w-[450px] min-w-[200px] flex-col border-r border-accent-bg ${className}`}>
            <div className="flex items-center gap-2 border-b border-accent-bg px-2 py-[11px]">
                <input
                    type="search"
                    value={search}
                    aria-label={labels.search}
                    placeholder={labels.search}
                    onChange={(event) => onSearch(event.target.value)}
                    className="h-10 w-full rounded-[10px] border border-accent-bg bg-white px-3 text-[14px] outline-none placeholder:text-caption focus:border-primary"
                />
                <Menu.Root>
                    <Menu.Trigger aria-label={labels.filter} className="flex h-[25px] w-[25px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0">
                        {/* eslint-disable-next-line @next/next/no-img-element -- значок меню */}
                        <img src="/web/icons/messenger/three-dots.svg" alt="" width={20} height={4} />
                    </Menu.Trigger>
                    <Menu.Portal>
                        <Menu.Content align="end" className="z-30 flex flex-col border border-accent-bg bg-white">
                            {(Object.keys(STATUS_COLORS) as ApplicationStatus[]).map((value) => (
                                <Menu.CheckboxItem
                                    key={value}
                                    checked={status === value}
                                    onCheckedChange={() => onStatus(status === value ? null : value)}
                                    className={`flex cursor-pointer items-center gap-2.5 p-3.5 text-[14px] font-medium outline-none data-[highlighted]:bg-accent-bg/60 ${status === value ? "bg-accent-bg" : ""}`}
                                >
                                    <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: STATUS_COLORS[value] }} />
                                    {labels.statuses[value]}
                                </Menu.CheckboxItem>
                            ))}
                        </Menu.Content>
                    </Menu.Portal>
                </Menu.Root>
            </div>
            <div
                className="relative flex h-full w-full flex-col overflow-x-hidden overflow-y-auto"
                onScroll={(event) => {
                    const box = event.currentTarget;
                    if (box.scrollTop + box.clientHeight >= box.scrollHeight * 0.7 && visible < chats.length) setVisible((value) => value + STEP);
                }}
            >
                {shown.map((chat) => {
                    const id = chat.id ?? 0;
                    const companion = chat.otherParticipants?.[0];
                    const name = [companion?.firstName, companion?.lastName].filter(Boolean).join(" ") || labels.noName;
                    const active = selectedId === String(id);
                    const unread = chat.countUnreadMessages ?? 0;
                    const last = chat.lastMessage;
                    const preview = last?.attachments?.length ? labels.attachment : (last?.text ?? labels.application);
                    return (
                        <a
                            key={id}
                            href={chatHref(id)}
                            aria-current={active ? "page" : undefined}
                            onClick={(event) => {
                                if (event.metaKey || event.ctrlKey) return;
                                event.preventDefault();
                                onOpen(id);
                            }}
                            className={`relative flex w-full gap-2 border-b border-accent-bg py-2 pr-3.5 pl-6 text-inherit no-underline ${active ? "bg-primary text-white" : unread ? "bg-field" : ""}`}
                        >
                            <span aria-hidden className="absolute top-2 left-3.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[chat.applicationStatus ?? "new"] }} />
                            <Avatar src={mediaUrl(companion?.image, "small")} name={name} size={40} />
                            <div className="flex w-full min-w-0 flex-col gap-2">
                                <div className="grid grid-cols-[1fr_auto] gap-2.5 overflow-hidden whitespace-nowrap">
                                    <span className="overflow-hidden text-[0.875rem] text-ellipsis">{name}</span>
                                    <span className={`text-[0.75rem] ${active ? "text-white" : "text-caption"}`}>{formatMessageDate(locale, last?.createdAt, labels.noDate)}</span>
                                </div>
                                <div className="grid grid-cols-[1fr_auto] gap-2.5 overflow-hidden whitespace-nowrap">
                                    <span className={`overflow-hidden text-[0.75rem] text-ellipsis ${active ? "text-white" : "text-caption"}`}>{preview}</span>
                                    {unread > 0 && (
                                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-error text-[0.625rem] font-extrabold text-white">
                                            {unread > 9 ? "9+" : unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
