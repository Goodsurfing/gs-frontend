"use client";

import { useEffect, useId, useState } from "react";

import { activeMembership, useSession } from "@/components/session/SessionProvider";
import { Arrow } from "@/components/ui/Arrow";
import { NavAnchor } from "@/components/ui/NavAnchor";
import type { Locale } from "@/i18n/config";
import { formatDayMonthYear } from "@/lib/formatDate";

import { LanguageSwitcher } from "../LanguageSwitcher";
import type { NavLink, Navigation } from "./navigation";

// Пункты меню выглядят как кнопки MUI старого фронта: те же отступы, интерлиньяж и разрядка
const itemClass = "inline-flex w-full min-w-16 cursor-pointer items-center justify-start rounded-[4px] border-0 bg-field px-5 py-[14px] text-left text-[18px] leading-[1.75] font-semibold tracking-[0.02857em] text-primary no-underline";

interface MobileHeaderProps {
    locale: Locale;
    homeHref: string;
    navigation: Navigation;
    /** hint — «от 990 ₽/год»; activeHint — «Активно до {{date}}» для вошедшего с членством */
    membership: NavLink & { hint: string; activeHint: string };
    signIn: NavLink;
    /** Пункты для вошедшего: моя страница, сообщения, дашборды */
    account: { links: NavLink[]; exit: string };
    labels: { menu: string; language: string };
}

/**
 * Шапка на экранах до 1280 px: логотип, язык и «бургер», меню на весь экран
 * с раскрывающимися разделами.
 */
export function MobileHeader({ locale, homeHref, navigation, membership, signIn, account, labels }: MobileHeaderProps) {
    const [open, setOpen] = useState(false);
    const session = useSession();
    const regular = activeMembership(session.memberships, "REGULAR");
    const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
    const menuId = useId();
    const above = open ? "relative z-[1001]" : "";

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const toggle = (label: string) => setExpanded((prev) => {
        const next = new Set(prev);
        if (!next.delete(label)) next.add(label);
        return next;
    });

    const bar = "absolute left-1/2 h-[2.86px] w-[25px] bg-primary transition-all duration-300";

    return (
        <div className="pointer-events-auto hidden px-5 py-4 down-2xl:block">
            <header className="flex w-full items-center justify-between">
                <a href={homeHref} className={above}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- svg-логотип */}
                    <img src="/web/icons/header/logo-mobile.svg" alt="GoodSurfing" width={130} height={45} />
                </a>
                <LanguageSwitcher locale={locale} label={labels.language} className={open ? "z-[1001]" : ""} />
                <button
                    type="button"
                    aria-label={labels.menu}
                    aria-expanded={open}
                    aria-controls={menuId}
                    onClick={() => setOpen((value) => !value)}
                    className="relative z-[1001] size-[30px] cursor-pointer touch-manipulation overflow-hidden border-0 bg-transparent p-0"
                >
                    <span className={`${bar} top-1/2 [transform:translate(-50%,-50%)] ${open ? "hidden" : ""}`} />
                    <span className={`${bar} ${open ? "top-1/2 [transform:translate(-50%,0%)_rotate(45deg)]" : "top-[calc(50%-8px)] [transform:translate(-50%,-50%)]"}`} />
                    <span className={`${bar} ${open ? "top-1/2 [transform:translate(-50%,0%)_rotate(-45deg)]" : "top-[calc(50%+8px)] [transform:translate(-50%,-50%)]"}`} />
                </button>
            </header>

            <nav
                id={menuId}
                aria-label={labels.menu}
                className={`absolute top-0 left-0 z-[1000] h-screen w-full flex-col items-center gap-1 overflow-auto bg-white px-[15px] pt-[92px] pb-6 ${open ? "flex" : "hidden"}`}
            >
                <a href={navigation.offers.href} className={itemClass}>{navigation.offers.label}</a>
                {navigation.entries.map((entry) => {
                    if (entry.kind === "link") {
                        return <NavAnchor key={entry.label} href={entry.href} className={`${itemClass} aria-[current=page]:cursor-default aria-[current=page]:text-primary aria-[current=page]:hover:text-primary aria-[current=page]:focus:text-primary`}>{entry.label}</NavAnchor>;
                    }
                    const isOpen = expanded.has(entry.label);
                    const panelId = `${menuId}-${entry.label}`;
                    return (
                        <div key={entry.label} className="flex w-full flex-col">
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => toggle(entry.label)}
                                className={`${itemClass} ${isOpen ? "text-ink-secondary" : ""}`}
                            >
                                {entry.label}
                                <span className="mr-[-4px] ml-2 inline-flex">
                                    <Arrow open={isOpen} className={isOpen ? "text-ink-secondary" : ""} />
                                </span>
                            </button>
                            <div id={panelId} hidden={!isOpen} className="flex-col gap-y-2.5 bg-field p-5 [&:not([hidden])]:flex">
                                {entry.items.map((item) => (
                                    <NavAnchor
                                        key={item.href + item.label}
                                        href={item.href}
                                        className="text-[16px] font-medium text-ink-secondary no-underline hover:text-primary-hover aria-[current=page]:cursor-default aria-[current=page]:text-primary aria-[current=page]:hover:text-primary aria-[current=page]:focus:text-primary"
                                    >
                                        {item.label}
                                    </NavAnchor>
                                ))}
                            </div>
                        </div>
                    );
                })}
                <a
                    href={membership.href}
                    className="flex w-full flex-col items-start rounded-[4px] bg-cta px-5 py-2.5 text-[18px] font-semibold tracking-[0.02857em] text-white no-underline hover:bg-cta-deep"
                >
                    <span className="leading-[1.3]">{membership.label}</span>
                    <span className="text-[14px] leading-[1.3] font-medium opacity-90">
                        {regular ? membership.activeHint.replace("{{date}}", formatDayMonthYear(regular.endDate)) : membership.hint}
                    </span>
                </a>
                <div className="my-2 h-px w-full bg-accent-bg" />
                {session.status === "user" ? (
                    <>
                        {account.links.map((link) => <NavAnchor key={link.href} href={link.href} className={`${itemClass} aria-[current=page]:cursor-default aria-[current=page]:text-primary aria-[current=page]:hover:text-primary aria-[current=page]:focus:text-primary`}>{link.label}</NavAnchor>)}
                        <button
                            type="button"
                            className={itemClass}
                            onClick={() => void session.logout().then(() => window.location.reload())}
                        >
                            {account.exit}
                        </button>
                    </>
                ) : (
                    <a href={signIn.href} className={itemClass}>{signIn.label}</a>
                )}
            </nav>
        </div>
    );
}
