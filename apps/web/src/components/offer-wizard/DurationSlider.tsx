"use client";

import { type PointerEvent as ReactPointerEvent, useRef } from "react";

import { DURATION_MAX, DURATION_MIN } from "@/lib/offerWizard";

const percent = (value: number) => ((value - DURATION_MIN) / (DURATION_MAX - DURATION_MIN)) * 100;

/**
 * Двойной бегунок срока участия (RangeSlider на Slider MUI старого фронта):
 * чёрная дорожка 38 %, синий отрезок, подписи значений над бегунками всегда
 * видны, метки снизу. Бегунки не меняются местами; клавиатура — стрелки.
 */
export function DurationSlider({ value, onChange, marks, format, labels }: {
    value: [number, number];
    onChange: (value: [number, number]) => void;
    marks: { value: number; label: string }[];
    format: (value: number) => string;
    labels: [string, string];
}) {
    const rail = useRef<HTMLSpanElement>(null);
    const dragging = useRef<0 | 1 | null>(null);

    const valueAt = (clientX: number) => {
        const box = rail.current?.getBoundingClientRect();
        if (!box || !box.width) return null;
        const ratio = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
        return Math.round(DURATION_MIN + ratio * (DURATION_MAX - DURATION_MIN));
    };

    const move = (thumb: 0 | 1, next: number) => {
        const [from, to] = value;
        if (thumb === 0) onChange([Math.min(Math.max(next, DURATION_MIN), to), to]);
        else onChange([from, Math.max(Math.min(next, DURATION_MAX), from)]);
    };

    const down = (event: ReactPointerEvent<HTMLSpanElement>) => {
        const next = valueAt(event.clientX);
        if (next === null) return;
        const thumb = Math.abs(next - value[0]) <= Math.abs(next - value[1]) && next <= value[1] ? 0 : 1;
        dragging.current = thumb;
        event.currentTarget.setPointerCapture(event.pointerId);
        move(thumb, next);
        document.getElementById(`duration-thumb-${thumb}`)?.focus();
    };

    return (
        <span
            ref={rail}
            onPointerDown={down}
            onPointerMove={(event) => {
                const next = dragging.current === null ? null : valueAt(event.clientX);
                if (next !== null && dragging.current !== null) move(dragging.current, next);
            }}
            onPointerUp={() => {
                dragging.current = null;
            }}
            className="relative mb-5 box-content inline-block h-1 w-full cursor-pointer touch-none rounded-[12px] py-[13px] text-[#1976d2]"
        >
            <span className="absolute top-1/2 block h-1 w-full -translate-y-1/2 rounded-[inherit] bg-black opacity-[0.38]" />
            <span className="absolute top-1/2 block h-1 -translate-y-1/2 rounded-[inherit] border border-primary bg-primary" style={{ left: `${percent(value[0])}%`, width: `${percent(value[1]) - percent(value[0])}%` }} />
            {marks.map((mark) => {
                const active = mark.value >= value[0] && mark.value <= value[1];
                return (
                    <span key={mark.value}>
                        <span className={`absolute top-1/2 block h-0.5 w-0.5 -translate-x-px -translate-y-1/2 rounded-[1px] ${active ? "bg-white opacity-80" : "bg-[#1976d2]"}`} style={{ left: `${percent(mark.value)}%` }} />
                        <span className={`absolute top-[30px] -translate-x-1/2 font-[Lato] text-[10px] leading-[1.43] tracking-[0.01071em] whitespace-nowrap ${active ? "text-[rgba(0,0,0,0.87)]" : "text-[rgba(0,0,0,0.6)]"}`} style={{ left: `${percent(mark.value)}%` }}>
                            {mark.label}
                        </span>
                    </span>
                );
            })}
            {value.map((current, index) => (
                <span
                    key={index}
                    id={`duration-thumb-${index}`}
                    role="slider"
                    tabIndex={0}
                    aria-label={labels[index]}
                    aria-valuemin={DURATION_MIN}
                    aria-valuemax={DURATION_MAX}
                    aria-valuenow={current}
                    aria-valuetext={format(current)}
                    onKeyDown={(event) => {
                        const step = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0;
                        if (!step) return;
                        event.preventDefault();
                        move(index === 0 ? 0 : 1, current + step);
                    }}
                    className="absolute top-1/2 box-border flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary outline-none hover:shadow-[0_0_0_8px_rgba(61,171,247,0.16)] focus-visible:shadow-[0_0_0_8px_rgba(61,171,247,0.16)]"
                    style={{ left: `${percent(current)}%` }}
                >
                    <span className="absolute -top-2.5 flex -translate-y-full items-center justify-center rounded-[2px] bg-[#757575] px-3 py-1 font-[Roboto,Helvetica,Arial,sans-serif] text-[14px] leading-[1.43] font-medium tracking-[0.01071em] whitespace-nowrap text-white before:absolute before:bottom-0 before:left-1/2 before:h-2 before:w-2 before:-translate-x-1/2 before:translate-y-1/2 before:rotate-45 before:bg-inherit">
                        {format(current)}
                    </span>
                </span>
            ))}
        </span>
    );
}
