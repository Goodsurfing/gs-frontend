"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { DURATION_MAX, DURATION_MIN, type OffersFilters, offersFiltersQuery, type Provided } from "@/lib/offersFilters";

export interface FilterBarLabels {
    from: string;
    to: string;
    notSet: string;
    categories: string;
    duration: string;
    durationValue: string;
    days: string;
    extra: string;
    withChildren: string;
    languages: string;
    provided: string;
    housing: string;
    food: string;
    travel: string;
    apply: string;
    reset: string;
}

type Panel = "categories" | "duration" | "extra" | null;
// Как в старом фронте: не больше пяти направлений сразу
const MAX_CATEGORIES = 5;

const PROVIDED: Provided[] = ["housing", "food", "paidTravel"];

/** Кнопка-раскрывашка фильтра со стрелкой и синей точкой «фильтр задан». */
function DropdownButton({ label, active, open, onClick, minWidth }: {
    label: string;
    active: boolean;
    open: boolean;
    onClick: () => void;
    minWidth: string;
}) {
    return (
        <button
            type="button"
            aria-expanded={open}
            onClick={onClick}
            className={`flex cursor-pointer items-center justify-between gap-3 border border-field px-2.5 py-3.5 text-left ${minWidth} ${open ? "bg-accent-bg" : "bg-white"}`}
        >
            <span className="relative">
                {label}
                {active && <span aria-hidden className="absolute top-0 left-[calc(100%+6px)] h-2 w-2 rounded-full bg-primary" />}
            </span>
            <span aria-hidden className={`h-0 w-0 border-x-[5px] border-x-transparent ${open ? "border-b-[5px] border-b-ink-secondary" : "border-t-[5px] border-t-ink-secondary"}`} />
        </button>
    );
}

function Chip({ selected, color, onClick, children }: { selected: boolean; color?: string; onClick: () => void; children: ReactNode }) {
    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick={onClick}
            style={color ? { borderColor: color, backgroundColor: selected ? color : undefined } : undefined}
            className={`cursor-pointer rounded-[26px] px-2.5 py-[5px] text-[14px] font-medium text-ink-secondary transition-colors ${color ? "border-2" : selected ? "bg-primary text-white" : "bg-field"}`}
        >
            {children}
        </button>
    );
}

/**
 * Панель фильтров каталога (десктоп): период, направление деятельности, срок
 * участия, доп. фильтры; «Применить» — в адрес страницы (список и карта
 * обновятся), «Очистить все» — сброс. Выбор копится в черновике, как в
 * старом фронте, — список не перезагружается на каждый щелчок.
 */
export function OffersFilterBar({ basePath, filters, categories, languages, labels, stacked = false, onApplied }: {
    basePath: string;
    /** Телефон: фильтры столбиком во всю ширину, раскрывающиеся части — в потоке */
    stacked?: boolean;
    /** После «Применить» / «Очистить все» (телефон: вернуться к списку) */
    onApplied?: () => void;
    filters: OffersFilters;
    categories: { id: number; name: string; color: string }[];
    languages: { value: string; label: string }[];
    labels: FilterBarLabels;
}) {
    const router = useRouter();
    const [draft, setDraft] = useState(filters);
    const [panel, setPanel] = useState<Panel>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    // Клик вне панели и Escape закрывают раскрытый фильтр
    useEffect(() => {
        if (!panel) return;
        const onDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setPanel(null);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setPanel(null);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [panel]);

    const toggle = (name: Exclude<Panel, null>) => setPanel((current) => (current === name ? null : name));
    const apply = () => {
        setPanel(null);
        const query = offersFiltersQuery({ ...draft, page: 1, offerId: undefined });
        router.push(query ? `${basePath}?${query}` : basePath);
        onApplied?.();
    };
    const reset = () => {
        setPanel(null);
        router.push(basePath);
        onApplied?.();
    };
    // Раскрывающиеся части: на десктопе — поверх списка, на телефоне — в потоке
    const floating = stacked ? "static" : "absolute top-full";

    const minDays = draft.minDays ?? DURATION_MIN;
    const maxDays = draft.maxDays ?? DURATION_MAX;
    const setDuration = (min: number, max: number) => setDraft((current) => ({
        ...current,
        minDays: min > DURATION_MIN ? min : undefined,
        maxDays: max < DURATION_MAX ? max : undefined,
    }));
    const toggleIn = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

    const durationPanel = (

        <div className={`${floating} z-[3] w-full bg-white py-5 ${stacked ? "px-[15px]" : "px-[50px]"}`} style={{ boxShadow: "0 1px 1px rgb(0 0 0 / 16%), 0 3px 1px rgb(0 0 0 / 10%)" }}>
            <div className="mx-auto flex w-full max-w-[880px] flex-col gap-3">
                <p className="text-[14px] font-medium">{labels.durationValue.replace("{{min}}", String(minDays)).replace("{{max}}", String(maxDays))}</p>
                <div className="relative h-6">
                    <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-accent-bg" />
                    <div
                        className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-primary"
                        style={{
                            left: `${((minDays - DURATION_MIN) / (DURATION_MAX - DURATION_MIN)) * 100}%`,
                            right: `${100 - ((maxDays - DURATION_MIN) / (DURATION_MAX - DURATION_MIN)) * 100}%`,
                        }}
                    />
                    {/* Два ползунка поверх одной шкалы: «от» и «до», в днях */}
                    <input
                        type="range"
                        aria-label={`${labels.duration}: ${labels.from}`}
                        min={DURATION_MIN}
                        max={DURATION_MAX}
                        value={minDays}
                        onChange={(event) => setDuration(Math.min(Number(event.target.value), maxDays), maxDays)}
                        className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow"
                    />
                    <input
                        type="range"
                        aria-label={`${labels.duration}: ${labels.to}`}
                        min={DURATION_MIN}
                        max={DURATION_MAX}
                        value={maxDays}
                        onChange={(event) => setDuration(minDays, Math.max(Number(event.target.value), minDays))}
                        className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow"
                    />
                </div>
                <div className="flex justify-between text-[12px] text-caption">
                    <span>{DURATION_MIN} {labels.days}</span>
                    <span>{DURATION_MAX} {labels.days}</span>
                </div>
            </div>
        </div>
    );

    const extraPanel = (

        <div className={`${floating} z-[3] flex w-full flex-wrap items-start gap-x-20 gap-y-2.5 bg-white py-5 ${stacked ? "px-[15px]" : "px-[50px]"}`} style={{ boxShadow: "0 1px 1px rgb(0 0 0 / 16%), 0 3px 1px rgb(0 0 0 / 10%)" }}>
            <div className="flex flex-col gap-3">
                <label className="flex cursor-pointer items-center gap-2.5">
                    <input
                        type="checkbox"
                        checked={draft.withChildren}
                        onChange={(event) => setDraft((current) => ({ ...current, withChildren: event.target.checked }))}
                        className="h-[18px] w-[18px] accent-primary"
                    />
                    {labels.withChildren}
                </label>
                <fieldset>
                    <legend className="mb-2.5">{labels.languages}</legend>
                    <div className="flex max-w-[624px] flex-wrap gap-2.5">
                        {languages.map((language) => (
                            <Chip
                                key={language.value}
                                selected={draft.languages.includes(language.value)}
                                onClick={() => setDraft((current) => ({ ...current, languages: toggleIn(current.languages, language.value) }))}
                            >
                                {language.label}
                            </Chip>
                        ))}
                    </div>
                </fieldset>
            </div>
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-2">{labels.provided}:</legend>
                {PROVIDED.map((item) => (
                    <label key={item} className="flex cursor-pointer items-center gap-2.5">
                        <input
                            type="checkbox"
                            checked={draft.provided.includes(item)}
                            onChange={() => setDraft((current) => ({ ...current, provided: toggleIn(current.provided, item) }))}
                            className="h-[18px] w-[18px] accent-primary"
                        />
                        {item === "housing" ? labels.housing : item === "food" ? labels.food : labels.travel}
                    </label>
                ))}
            </fieldset>
        </div>
    );

    return (
        <div
            ref={rootRef}
            className="relative"
            onKeyDown={(event) => {
                if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
                    event.preventDefault();
                    apply();
                }
            }}
        >
            <div className={stacked ? "flex flex-col gap-2.5 px-5 py-[15px]" : "flex flex-wrap items-center gap-2.5 border-b border-accent-bg px-[50px] py-5"}>
                <div className={stacked ? "flex flex-wrap gap-2.5" : "flex"}>
                    <label className={`flex items-center border border-field bg-white px-2.5 py-3 ${stacked ? "flex-1" : ""}`}>
                        <span className="sr-only">{labels.from}</span>
                        <input
                            type="date"
                            value={draft.from ?? ""}
                            max={draft.to}
                            onChange={(event) => setDraft((current) => ({ ...current, from: event.target.value || undefined }))}
                            className="w-[146px] text-[14px] text-ink-tertiary outline-none"
                        />
                    </label>
                    <label className={`flex items-center border border-field bg-white px-2.5 py-3 ${stacked ? "flex-1" : "border-l-0"}`}>
                        <span className="sr-only">{labels.to}</span>
                        <input
                            type="date"
                            value={draft.to ?? ""}
                            min={draft.from}
                            onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value || undefined }))}
                            className="w-[146px] text-[14px] text-ink-tertiary outline-none"
                        />
                    </label>
                </div>

                <div className="relative flex flex-col">
                    <DropdownButton label={labels.categories} active={draft.categories.length > 0} open={panel === "categories"} onClick={() => toggle("categories")} minWidth={stacked ? "w-full" : "min-w-[260px]"} />
                    {panel === "categories" && (
                        <div className={`${floating} z-[4] bg-white px-[15px] py-[17px] shadow-[0_4px_6px_0_rgba(0,0,0,0.1)] ${stacked ? "w-full" : "w-max max-w-[420px]"}`}>
                            <div className="flex max-w-[624px] flex-wrap gap-2.5">
                                {categories.map((category) => (
                                    <Chip
                                        key={category.id}
                                        color={category.color || "#3dabf7"}
                                        selected={draft.categories.includes(category.id)}
                                        onClick={() => setDraft((current) => {
                                            const next = toggleIn(current.categories, category.id);
                                            return next.length > MAX_CATEGORIES ? current : { ...current, categories: next };
                                        })}
                                    >
                                        {category.name}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DropdownButton
                    label={labels.duration}
                    active={draft.minDays !== undefined || draft.maxDays !== undefined}
                    open={panel === "duration"}
                    onClick={() => toggle("duration")}
                    minWidth={stacked ? "w-full" : "min-w-[200px]"}
                />
                <DropdownButton label={labels.extra} active={false} open={panel === "extra"} onClick={() => toggle("extra")} minWidth={stacked ? "w-full" : "min-w-[200px]"} />

                {stacked && panel === "duration" && durationPanel}
                {stacked && panel === "extra" && extraPanel}
                <div className={stacked ? "mt-2 flex gap-2.5" : "ml-auto flex gap-2.5"}>
                    <button type="button" onClick={apply} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-3 py-2.5 text-[14px] text-white transition-colors hover:bg-white hover:text-primary">
                        {labels.apply}
                    </button>
                    <button type="button" onClick={reset} className="cursor-pointer rounded-[10px] px-3 py-2.5 text-[14px] text-primary transition-colors hover:text-primary-hover">
                        {labels.reset}
                    </button>
                </div>
            </div>

            {!stacked && panel === "duration" && durationPanel}
            {!stacked && panel === "extra" && extraPanel}
        </div>
    );
}
