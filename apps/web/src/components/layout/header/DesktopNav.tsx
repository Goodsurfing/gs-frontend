"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { Arrow } from "@/components/ui/Arrow";

import type { Navigation } from "./navigation";
import { SearchIcon } from "./SearchIcon";

const itemClass = "inline-flex cursor-pointer items-center gap-x-[3px] whitespace-nowrap rounded-[10px] border-0 bg-transparent p-2 text-[13px] font-medium text-primary no-underline transition-colors duration-150 select-none hover:bg-field/70 hover:text-primary-hover";

/**
 * Меню десктопной шапки. Выпадающие списки — на Radix: открываются по клику,
 * открытым бывает только один, работают с клавиатуры и закрываются по Esc
 * (в старом фронте могли висеть открытыми все сразу).
 */
export function DesktopNav({ navigation }: { navigation: Navigation }) {
    const { offers, entries } = navigation;

    return (
        <ul className="m-0 flex min-w-0 list-none flex-nowrap items-center gap-[2px] p-0">
            <li>
                <a
                    href={offers.href}
                    className="inline-flex items-center justify-center rounded-[10px] border border-primary bg-primary px-3 py-2 text-[13px] leading-none font-medium whitespace-nowrap text-white no-underline transition-all duration-200 hover:bg-white hover:text-primary"
                >
                    {offers.label}
                    <SearchIcon className="ml-1.5 block size-[13px]" />
                </a>
            </li>
            {entries.map((entry) => (
                <li key={entry.label} className="relative flex">
                    {entry.kind === "link" ? (
                        <a href={entry.href} className={itemClass}>{entry.label}</a>
                    ) : (
                        <DropdownMenu.Root modal={false}>
                            <DropdownMenu.Trigger className={`group ${itemClass}`}>
                                {entry.label}
                                <Arrow />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    align="start"
                                    sideOffset={12}
                                    className="z-50 flex animate-fade-in flex-col gap-y-2.5 rounded-[14px] bg-field px-4 py-3.5 shadow-[0_12px_32px_rgba(14,29,39,0.16)]"
                                >
                                    {entry.items.map((item) => (
                                        <DropdownMenu.Item key={item.href + item.label} asChild>
                                            <a
                                                href={item.href}
                                                className="py-1 text-[14px] font-medium whitespace-nowrap text-ink-secondary no-underline outline-none hover:text-primary-hover focus:text-primary-hover"
                                            >
                                                {item.label}
                                            </a>
                                        </DropdownMenu.Item>
                                    ))}
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    )}
                </li>
            ))}
        </ul>
    );
}
