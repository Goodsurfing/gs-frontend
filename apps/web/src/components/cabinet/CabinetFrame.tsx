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
    /**
     * Заголовок группы, а не ссылка (SidebarDropdown старого фронта: «Организация»
     * в меню организатора): иконка картинкой, подпись не подсвечивается.
     * href — куда ведёт «таблетка» в мобильном меню.
     */
    group?: boolean;
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
export function CabinetFrame({ items, labels, fitContent = false, children }: {
    items: CabinetMenuItem[];
    labels: { toggle: string };
    /** Колонка по высоте содержимого, а не экрана (кабинет организатора: HostsLayoutPage) */
    fitContent?: boolean;
    children: ReactNode;
}) {
    const pathname = usePathname() ?? "";
    const [open, setOpen] = useState(true);
    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
    const isItemActive = (item: CabinetMenuItem) => (item.group ? false : isActive(item.href)) || (item.children ?? []).some((child) => isActive(child.href));
    const subItems = items.some(isItemActive)
        ? items.flatMap((item) => (item.children ?? []).map((child) => ({ ...child, active: isActive(child.href) })))
        : [];

    return (
        <>
            <nav aria-label={labels.toggle} className={`fixed left-0 z-[5] h-[91vh] overflow-y-visible bg-white text-ink-tertiary shadow-[3px_0_8px_rgb(0_0_0/3%)] transition-all duration-[600ms] down-lg:hidden ${open ? "w-[20.625rem]" : "w-[6.25rem]"}`}>
                <ul className="m-0 flex h-full flex-col items-center overflow-x-hidden overflow-y-auto p-[30px] pb-20 text-[18px]">
                    {items.map((item) => {
                        const active = isActive(item.href) || (item.children ?? []).some((child) => isActive(child.href));
                        return (
                            <li key={item.href} className="w-full list-none">
                                {item.group ? (
                                    <div className="flex h-[3.75rem] items-center font-bold text-caption">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка группы */}
                                        <img src={`/web/icons/navbar/${item.icon}.svg`} alt={item.text} className={`min-w-10 ${open ? "mx-3.5" : ""}`} />
                                        {open && <span className="mr-auto ml-6 text-left">{item.text}</span>}
                                    </div>
                                ) : (
                                <a href={item.href} className={`group flex min-h-[3.75rem] cursor-pointer items-center font-bold no-underline transition-all duration-300 ${active ? "text-ink-tertiary" : "text-caption hover:text-ink-tertiary"}`}>
                                    <span aria-hidden className={`block h-10 min-w-10 bg-current ${open ? "mx-3.5" : ""}`} style={mask(item.icon)} />
                                    {open && (
                                        <span className={`relative mr-auto ml-6 min-w-0 text-left [overflow-wrap:anywhere] whitespace-normal after:absolute after:top-full after:left-0 after:h-0.5 after:w-full after:bg-ink-tertiary after:transition-opacity after:duration-300 ${active ? "after:opacity-100" : "after:opacity-0 group-hover:after:opacity-100"}`}>
                                            {item.text}
                                        </span>
                                    )}
                                </a>
                                )}
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
            {/*
              * Уже 992 px — ряды плиток (MobileSidebar старого фронта, Swiper): в ряду
              * видно 4 плитки, уже 662 px — 2, уже 480 px — одна на всю ширину (Swiper
              * вычитает из ширины отступы 20 px слева и справа от ряда). Второй
              * ряд — подразделы группы («Организация»), пока открыт какой-нибудь пункт.
              * Точки — как breakpoints Swiper (min-width), поэтому max-[…] (строго меньше).
              */}
            <nav className="hidden flex-col gap-y-5 overflow-x-hidden down-lg:flex">
                {[items.map((item) => ({ ...item, active: isItemActive(item) })), subItems].filter((row) => row.length).map((row, index) => (
                    <div key={index} className="overflow-x-auto pr-[60px] pl-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex gap-[15px]">
                            {row.map((item) => (
                                <a
                                    key={`${item.href}-${item.text}`}
                                    href={item.href}
                                    className="shrink-0 basis-[calc((100%-85px)/4)] text-inherit no-underline first:ml-5 last:mr-5 max-[662px]:basis-[calc((100%-55px)/2)] max-[480px]:basis-full max-[480px]:first:ml-0 max-[480px]:last:mr-0"
                                >
                                    <span className={`block rounded-[20px] border border-accent-bg px-3.5 py-2 ${item.active ? "bg-primary text-white" : "bg-field"}`}>{item.text}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
            {/* Содержимое сдвигается вслед за шириной меню (PageLayout старого фронта) */}
            <div className={`flex min-h-full justify-between pt-9 pr-[3.125rem] transition-all duration-300 ease-in-out down-lg:pr-5 ${open ? "pl-[21.875rem] down-lg:pl-5" : "pl-40 down-lg:pl-9"}`}>
                <div className={`w-full pb-9 ${fitContent ? "" : "min-h-screen"}`}>{children}</div>
            </div>
        </>
    );
}
