"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useSession } from "@/components/session/SessionProvider";
import { Arrow } from "@/components/ui/Arrow";
import { Avatar } from "@/components/ui/Avatar";
import { mediaUrl } from "@/lib/media";
import { takeChars } from "@/lib/textSlice";

import type { NavLink } from "./navigation";

export interface AccountLinks {
    /** Публичная страница пользователя: в адресе {id} заменяется на id профиля */
    myPage: NavLink;
    aboutMe: NavLink;
    hostDashboard: NavLink;
    volunteerDashboard: NavLink;
    messages: NavLink;
    exit: string;
}

/** Иконка сообщений с числом непрочитанных: облачко в цвет сайта и заметный счётчик. */
export function MessagesIcon({ count }: { count: number }) {
    return (
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-field">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                    d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6A.5.5 0 0 1 5 19.2V16h0a1 1 0 0 1-1-1V5.5Z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
                />
                <path d="M8 8.5h8M8 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {count > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-error px-1 text-[10px] leading-none font-bold text-white">
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </span>
    );
}

/** Как называть человека в шапке: имя, иначе начало почты (без «@…» — раньше показывался обрезанный адрес). */
export function displayName(profile: { firstName?: string | null; email?: string | null }): string {
    const name = profile.firstName?.trim() || (profile.email ?? "").split("@")[0] || "";
    return takeChars(name, 40); // дальше режет CSS с «…» по ширине
}

/**
 * Правая часть десктопной шапки: «Вход» для гостя, для вошедшего —
 * сообщения и меню профиля (Radix: клавиатура, Esc, закрытие кликом мимо).
 */
export function AccountArea({ signIn, links }: { signIn: NavLink; links: AccountLinks }) {
    const session = useSession();
    const profile = session.profile;

    if (session.status !== "user" || !profile) {
        return (
            <a
                href={signIn.href}
                className="inline-flex h-10 items-center justify-center rounded-[10px] border border-primary px-[18px] text-center text-[14px] leading-[1.375rem] font-semibold whitespace-nowrap text-primary no-underline transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
            >
                {signIn.label}
            </a>
        );
    }

    const name = displayName(profile);
    // Без имени фамилия одна выглядит странно — тогда то же, что на кнопке (начало почты)
    const fullName = profile.firstName?.trim() ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") : name;
    const avatar = mediaUrl(profile.image, "small");
    const itemBase = "flex w-full cursor-pointer items-center rounded-[8px] px-3 py-2 text-[14px] no-underline outline-none transition-colors hover:bg-field focus-visible:bg-field data-[highlighted]:bg-field";
    const item = `${itemBase} text-ink-secondary`;

    return (
        <>
            <a href={links.messages.href} aria-label={session.unreadMessages ? `${links.messages.label} (${session.unreadMessages})` : links.messages.label} title={links.messages.label}>
                <MessagesIcon count={session.unreadMessages} />
            </a>
            <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger className="group flex h-10 cursor-pointer items-center gap-2 rounded-full border border-accent-bg bg-white py-1 pr-3 pl-1 transition-colors hover:bg-field data-[state=open]:bg-field">
                    <Avatar src={avatar} name={name} size={30} />
                    <span className="max-w-[140px] truncate text-[14px] font-semibold text-ink-secondary">{name}</span>
                    <Arrow />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="end"
                        sideOffset={8}
                        className="z-50 flex w-[260px] animate-fade-in flex-col rounded-[12px] border border-accent-bg bg-white p-2 shadow-[0_12px_32px_rgba(14,29,39,0.16)]"
                    >
                        <div className="flex items-center gap-3 px-3 pt-2 pb-3">
                            <Avatar src={avatar} name={name} size={40} />
                            <div className="min-w-0">
                                <p className="truncate text-[15px] font-semibold text-ink-secondary">{fullName}</p>
                                {profile.email && <p className="truncate text-[12px] text-caption">{profile.email}</p>}
                            </div>
                        </div>
                        <DropdownMenu.Separator className="mx-2 mb-1 h-px bg-accent-bg" />
                        {[
                            { label: links.myPage.label, href: links.myPage.href.replace("{id}", profile.id) },
                            links.aboutMe,
                            links.hostDashboard,
                            links.volunteerDashboard,
                        ].map((link) => (
                            <DropdownMenu.Item key={link.href} asChild>
                                <a href={link.href} className={item}>{link.label}</a>
                            </DropdownMenu.Item>
                        ))}
                        <DropdownMenu.Separator className="mx-2 my-1 h-px bg-accent-bg" />
                        <DropdownMenu.Item className={`${itemBase} text-error`} onSelect={() => void session.logout().then(() => window.location.reload())}>
                            {links.exit}
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </>
    );
}
