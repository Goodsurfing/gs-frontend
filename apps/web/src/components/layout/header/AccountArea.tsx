"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useSession } from "@/components/session/SessionProvider";
import { Arrow } from "@/components/ui/Arrow";
import { Avatar } from "@/components/ui/Avatar";
import { mediaUrl } from "@/lib/media";

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

/** Иконка сообщений с числом непрочитанных (shared/ui/MessageIcon старого фронта). */
export function MessagesIcon({ count }: { count: number }) {
    return (
        <span className="relative block">
            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
            <img src="/web/icons/header/messages.svg" alt="" width={31} height={22} className="block" />
            {count > 0 && (
                <span className="absolute -top-[5px] right-0 flex items-center justify-center rounded-full border-2 border-white bg-error px-[3px] py-[2px] text-center text-[6px] leading-none font-extrabold text-white">
                    {count > 9 ? "9+" : count}
                </span>
            )}
        </span>
    );
}

/** Сокращение имени как в старой шапке: до 13 символов. */
const short = (value: string) => (value.length > 13 ? value.slice(0, 13) : value);

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

    const name = short(profile.firstName || profile.email || "");
    const item = "relative w-full cursor-pointer border-0 bg-transparent p-0 text-left text-[14px] text-ink-secondary no-underline outline-none before:absolute before:top-[110%] before:h-[2px] before:w-0 before:bg-ink-secondary before:transition-all before:duration-300 hover:before:w-full focus-visible:before:w-full";

    return (
        <>
            <div className="flex items-center gap-3">
                <a href={links.messages.href} aria-label={session.unreadMessages ? `${links.messages.label} (${session.unreadMessages})` : links.messages.label}>
                    <MessagesIcon count={session.unreadMessages} />
                </a>
            </div>
            <DropdownMenu.Root modal={false}>
                <DropdownMenu.Trigger className="group flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0 text-[16px] text-ink">
                    <span>{name}</span>
                    <Avatar src={mediaUrl(profile.image, "small")} name={profile.firstName} className="mx-2.5" />
                    <Arrow />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="start"
                        sideOffset={10}
                        className="z-50 flex min-w-[190px] animate-fade-in flex-col items-center gap-4 rounded-[10px] bg-field p-[17px] pt-[23px]"
                    >
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
                        <DropdownMenu.Item className={item} onSelect={() => void session.logout().then(() => window.location.reload())}>
                            {links.exit}
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </>
    );
}
