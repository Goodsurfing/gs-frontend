"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import { browserApi } from "@/lib/browserApi";
import { GEOCODER_LANG, type GeoPlace, parseGeocode, placeLabel } from "@/lib/offerWizard";

export interface AddressValue {
    /** Текст в поле */
    address: string;
    /** Точка из подсказок или с карты; null — адрес не выбран */
    place: GeoPlace | null;
}

/** Подсказки геокодера /api/v1/geocode (бэкенд проксирует геокодер Яндекса) */
export async function geocode(query: string, locale: Locale): Promise<GeoPlace[]> {
    // Параметры геокодера в OpenAPI не описаны — запрос собирается вручную
    const result = await browserApi()
        .GET("/api/v1/geocode", { params: { query: { geocode: query, lang: GEOCODER_LANG[locale] } } } as never)
        .catch(() => null);
    return parseGeocode(result?.data);
}

/**
 * Поле адреса (AutoComplete на MUI в MapWithAddress старого фронта): контурное
 * поле с «плавающей» подписью, подсказки геокодера после паузы 300 мс, выбор
 * мышью или Enter (первая подсказка), крестик очистки и стрелка списка.
 * Адрес принимается только из подсказок или с карты — правка текста сбрасывает точку.
 * Шрифт и цвета — темы MUI старого фронта (Roboto → Helvetica → Arial; #1976d2 — рамка и подпись в фокусе).
 */
export function AddressField({ value, onChange, locale, labels }: {
    value: AddressValue;
    onChange: (value: AddressValue) => void;
    locale: Locale;
    labels: { label: string; noOptions: string; clear: string; open: string; close: string };
}) {
    const id = useId();
    const listId = `${id}-list`;
    const [open, setOpen] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hover, setHover] = useState(false);
    // Подсказки помнят, к какому тексту они: устаревшие (текст уже другой) не показываются и не выбираются Enter
    const [results, setResults] = useState<{ query: string; places: GeoPlace[] }>({ query: "", places: [] });
    const [active, setActive] = useState(-1);
    const root = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLInputElement>(null);

    const query = value.address.trim();
    useEffect(() => {
        if (!query || value.place) return;
        let cancelled = false;
        const timer = setTimeout(() => {
            void geocode(query, locale).then((found) => {
                if (!cancelled) setResults({ query, places: found });
            });
        }, 300);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [query, locale, value.place]);

    // Выбранная точка в список не попадает (filterSelectedOptions у MUI)
    const options = value.place || !query || results.query !== query ? [] : results.places;

    useEffect(() => {
        if (!open) return;
        const close = (event: MouseEvent) => {
            if (root.current && !root.current.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    const pick = (place: GeoPlace) => {
        onChange({ address: placeLabel(place), place });
        setOpen(false);
        setActive(-1);
    };

    const type = (address: string) => {
        onChange({ address, place: null });
        setOpen(true);
        setActive(-1);
    };

    const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            if (!options.length) return;
            const step = event.key === "ArrowDown" ? 1 : -1;
            setActive((current) => (current + step + options.length) % options.length);
        } else if (event.key === "Enter") {
            const chosen = options[active] ?? (!value.place ? options[0] : undefined);
            if (chosen) {
                event.preventDefault();
                pick(chosen);
            }
        } else if (event.key === "Escape") {
            setOpen(false);
        }
    };

    const shrink = focused || value.address !== "";
        // Крестик — только у выбранного адреса и под курсором или в фокусе (как у MUI)
    const showClear = value.place !== null && (focused || hover);
    const outline = focused ? "border-2 border-[#1976d2]" : hover ? "border-[rgba(0,0,0,0.87)]" : "border-[rgba(0,0,0,0.23)]";

    return (
        <div ref={root} className="relative w-full font-[Roboto,Helvetica,Arial,sans-serif] tracking-[0.00938em]" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <div className="relative inline-flex w-full min-w-0 flex-col align-top">
                <label
                    htmlFor={id}
                    className={`pointer-events-none absolute top-0 left-0 z-[1] block origin-top-left overflow-hidden text-[16px] leading-[23px] text-ellipsis whitespace-nowrap transition-[color,transform,max-width] duration-200 ${shrink ? "max-w-[calc(133%-32px)] translate-x-[14px] translate-y-[-9px] scale-75" : "max-w-[calc(100%-24px)] translate-x-[14px] translate-y-[16px]"} ${focused ? "text-[#1976d2]" : "text-[rgba(0,0,0,0.6)]"}`}
                >
                    {labels.label}
                </label>
                <div className="relative flex w-full cursor-text flex-wrap items-center rounded-[4px] py-[9px] pr-[65px] pl-[9px] text-[16px] leading-[23px] text-[rgba(0,0,0,0.87)]">
                    <input
                        ref={input}
                        id={id}
                        role="combobox"
                        aria-expanded={open}
                        aria-controls={listId}
                        aria-autocomplete="list"
                        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
                        autoComplete="off"
                        value={value.address}
                        onChange={(event) => type(event.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onMouseDown={() => setOpen(true)}
                        onKeyDown={keyDown}
                        className="block h-[23px] min-w-[30px] flex-grow basis-0 box-content overflow-hidden bg-transparent py-[7.5px] pr-1 pl-[5px] text-ellipsis outline-none"
                    />
                    <div className="absolute top-[calc(50%-14px)] right-[9px] flex">
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={labels.clear}
                            onClick={() => {
                                onChange({ address: "", place: null });
                                input.current?.focus();
                            }}
                            className={`-mr-0.5 flex cursor-pointer rounded-full p-1 text-[rgba(0,0,0,0.54)] hover:bg-[rgba(0,0,0,0.04)] ${showClear ? "visible" : "invisible"}`}
                        >
                            <svg aria-hidden viewBox="0 0 24 24" className="block h-5 w-5 fill-current"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                        </button>
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={open ? labels.close : labels.open}
                            onClick={() => {
                                setOpen(!open);
                                input.current?.focus();
                            }}
                            className="-mr-0.5 flex cursor-pointer rounded-full p-0.5 text-[rgba(0,0,0,0.54)] hover:bg-[rgba(0,0,0,0.04)]"
                        >
                            <svg aria-hidden viewBox="0 0 24 24" className={`block h-6 w-6 fill-current ${open ? "rotate-180" : ""}`}><path d="M7 10l5 5 5-5z" /></svg>
                        </button>
                    </div>
                    <fieldset aria-hidden className={`pointer-events-none absolute inset-x-0 -top-[5px] bottom-0 m-0 min-w-0 overflow-hidden rounded-[4px] border border-solid px-2 text-left ${outline}`}>
                        <legend className={`invisible float-none block h-[11px] w-auto overflow-hidden p-0 text-[0.75em] whitespace-nowrap ${shrink ? "max-w-full" : "max-w-[0.01px]"}`}>
                            <span className="inline-block px-[5px] opacity-0">{labels.label}</span>
                        </legend>
                    </fieldset>
                </div>
            </div>
            {open && (
                <div className="absolute top-full right-0 left-0 z-20 overflow-auto rounded-[4px] bg-white text-[16px] leading-[1.5] tracking-[0.00938em] text-[rgba(0,0,0,0.87)] shadow-[0px_2px_1px_-1px_rgba(0,0,0,0.2),0px_1px_1px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.12)]">
                    {options.length ? (
                        <ul id={listId} role="listbox" aria-label={labels.label} className="m-0 max-h-[40vh] list-none overflow-auto py-2">
                            {options.map((option, index) => (
                                <li
                                    key={`${option.longitude},${option.latitude},${option.name}`}
                                    id={`${listId}-${index}`}
                                    role="option"
                                    aria-selected={index === active}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => pick(option)}
                                    onMouseEnter={() => setActive(index)}
                                    className={`flex cursor-pointer items-center justify-start px-4 py-1.5 down-sm:min-h-12 ${index === active ? "bg-[rgba(0,0,0,0.04)]" : ""}`}
                                >
                                    <span className="flex w-[30px] shrink-0">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- значок метки */}
                                        <img src="/web/icons/offer-wizard/location.svg" alt="" />
                                    </span>
                                    <span className="w-[calc(100%-44px)] [overflow-wrap:break-word]">
                                        <span>{option.name}</span>
                                        <span className="block text-[0.875rem] leading-[1.43] tracking-[0.01071em]">{option.description}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div id={listId} className="px-4 py-3.5 text-[rgba(0,0,0,0.6)]">{labels.noOptions}</div>
                    )}
                </div>
            )}
        </div>
    );
}
