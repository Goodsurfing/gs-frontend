"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

export interface CabinetMenuItem {
    text: string;
    /** Адрес раздела (с языковым префиксом) */
    href: string;
    /** Имя иконки в /web/icons/navbar */
    icon: string;
    /** Подразделы (меню организатора: вакансии, заявки…) */
    children?: { text: string; href: string }[];
}

const mask = (icon: string) => ({
    maskImage: `url(/web/icons/navbar/${icon}.svg)`,
    WebkitMaskImage: `url(/web/icons/navbar/${icon}.svg)`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
});

/**
 * Меню кабинета (widgets/Sidebar старого фронта): слева узкая полоса с
 * иконками, раскрывается до подписей кнопкой-стрелкой (по умолчанию
 * раскрыта); активный раздел — тёмный и подчёркнут. Уже 992 px — ряд
 * «таблеток» с прокруткой. Вместе с меню — колонка содержимого, её отступ
 * следует за шириной меню.
 */
export function CabinetFrame({ items, labels, children }: { items: CabinetMenuItem[]; labels: { toggle: string }; children: ReactNode }) {
    const pathname = usePathname() ?? "";
    const [open, setOpen] = useState(true);
    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <>
            <nav aria-label={labels.toggle} className={`fixed left-0 z-[5] h-[91vh] overflow-y-visible bg-white text-ink-tertiary shadow-[3px_0_8px_rgb(0_0_0/3%)] transition-all duration-[600ms] down-lg:hidden ${open ? "w-[20.625rem]" : "w-[6.25rem]"}`}>
                <ul className="m-0 flex h-full flex-col items-center overflow-x-hidden overflow-y-auto p-[30px] pb-20 text-[18px]">
                    {items.map((item) => {
                        const active = isActive(item.href) || (item.children ?? []).some((child) => isActive(child.href));
                        return (
                            <li key={item.href} className="w-full list-none">
                                <a href={item.href} className={`group flex min-h-[3.75rem] cursor-pointer items-center font-bold no-underline transition-all duration-300 ${active ? "text-ink-tertiary" : "text-caption hover:text-ink-tertiary"}`}>
                                    <span aria-hidden className={`block h-10 min-w-10 bg-current ${open ? "mx-3.5" : ""}`} style={mask(item.icon)} />
                                    {open && (
                                        <span className={`relative mr-auto ml-6 min-w-0 text-left [overflow-wrap:anywhere] whitespace-normal after:absolute after:top-full after:left-0 after:h-0.5 after:w-full after:bg-ink-tertiary after:transition-opacity after:duration-300 ${active ? "after:opacity-100" : "after:opacity-0 group-hover:after:opacity-100"}`}>
                                            {item.text}
                                        </span>
                                    )}
                                </a>
                                {open && item.children && (
                                    <div className="mx-3.5 flex max-h-48 w-full overflow-y-auto">
                                        <div className="sticky top-0 mx-5 w-px bg-[#82949F]" />
                                        <div className="relative flex flex-col">
                                            {item.children.map((child) => (
                                                <a key={child.href} href={child.href} className={`my-[0.55rem] ml-9 text-[18px] font-bold no-underline transition-all duration-300 hover:text-ink-tertiary ${isActive(child.href) ? "text-ink-tertiary" : "text-caption"}`}>
                                                    {child.text}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
                <button
                    type="button"
                    aria-label={labels.toggle}
                    aria-expanded={open}
                    onClick={() => setOpen(!open)}
                    className="absolute top-2.5 -right-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] border border-[#82949F] bg-white transition-all duration-300 hover:bg-[#82949F]"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/icons/navbar/sidebar-arrow.svg" alt="" className={`select-none ${open ? "" : "rotate-180"}`} />
                </button>
            </nav>
            <nav className="hidden overflow-x-auto px-5 [scrollbar-width:none] down-lg:flex [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-[15px] pr-10">
                    {items.flatMap((item) => [item, ...(isActive(item.href) || (item.children ?? []).some((child) => isActive(child.href)) ? (item.children ?? []).map((child) => ({ ...child, icon: "" })) : [])]).map((item) => (
                        <a key={item.href} href={item.href} className="shrink-0 no-underline">
                            <span className={`block rounded-[20px] border border-accent-bg px-3.5 py-2 whitespace-nowrap ${isActive(item.href) ? "bg-primary text-white" : "bg-field text-ink-secondary"}`}>{item.text}</span>
                        </a>
                    ))}
                </div>
            </nav>
            {/* Содержимое сдвигается вслед за шириной меню (PageLayout старого фронта) */}
            <div className={`flex min-h-full justify-between pt-9 pr-[3.125rem] transition-all duration-300 ease-in-out down-lg:pr-5 down-lg:pl-9 ${open ? "pl-[21.875rem] down-lg:pl-5" : "pl-40"}`}>
                <div className="min-h-screen w-full pb-9">{children}</div>
            </div>
        </>
    );
}
