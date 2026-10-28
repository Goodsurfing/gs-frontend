"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LOCALES, type Locale, withLocale } from "@/i18n/config";

const LANGUAGES: Record<Locale, { name: string; icon: string }> = {
    ru: { name: "Русский", icon: "/icons/langs/ru.svg" },
    en: { name: "English", icon: "/icons/langs/uk.svg" },
    es: { name: "Español", icon: "/icons/langs/spain.svg" },
};

/** Треугольная стрелка старого фронта (shared/ui/Arrow). */
function Arrow({ open }: { open: boolean }) {
    return (
        <span
            aria-hidden
            className={`block h-0 w-0 border-solid ${open
                ? "border-x-[3px] border-t-0 border-b-[3px] border-x-transparent border-b-[#007BFF]"
                : "border-x-[3px] border-t-[3px] border-b-0 border-x-transparent border-t-[#007BFF]"}`}
        />
    );
}

/**
 * Переключатель языка. Внешне как в старом фронте (флаг и стрелка, выпадающий
 * список), но доступный: кнопка с подписью, пункты — ссылки на ту же страницу
 * на другом языке (поисковики видят переходы, работает с клавиатуры).
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
    const pathname = usePathname() ?? `/${locale}`;
    const [open, setOpen] = useState(false);
    const current = LANGUAGES[locale];

    return (
        <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
            <DropdownMenu.Trigger
                aria-label={`${label}: ${current.name}`}
                className="mr-[10%] flex cursor-pointer items-center gap-[5px] border-0 bg-transparent p-0"
            >
                {/* eslint-disable-next-line @next/next/no-img-element -- флаг-иконка */}
                <img src={current.icon} alt="" aria-hidden />
                <Arrow open={open} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="start"
                    alignOffset={-20}
                    sideOffset={8}
                    className="z-[1002] border border-accent-bg bg-white shadow-[0_2px_5px_rgb(0_0_0/5%)]"
                >
                    {LOCALES.map((code) => (
                        <DropdownMenu.Item key={code} asChild>
                            <a
                                href={withLocale(pathname, code)}
                                hrefLang={code}
                                lang={code}
                                className="flex items-center p-[9px] outline-none transition-colors hover:bg-accent-bg focus:bg-accent-bg"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element -- флаг-иконка */}
                                <img src={LANGUAGES[code].icon} alt="" aria-hidden />
                                <span className="ml-2.5 text-[14px] font-bold text-primary">{LANGUAGES[code].name}</span>
                            </a>
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
