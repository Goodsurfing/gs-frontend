"use client";

import { useState } from "react";

/**
 * Вопросы и ответы (shared/ui/Accordion старого фронта): открыт один,
 * стрелка поворачивается. Высота раскрытия — через grid-rows: в старом
 * фронте бралась высота последнего ответа, и длинные ответы обрезались.
 */
export function FaqAccordion({ items }: { items: { title: string; description: string }[] }) {
    const [open, setOpen] = useState<number | null>(null);
    return (
        <ul className="mt-[60px] list-none">
            {items.map((item, index) => {
                const expanded = open === index;
                return (
                    <li key={item.title} className="mb-[54px]">
                        <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={`faq-${index}`}
                            onClick={() => setOpen(expanded ? null : index)}
                            className="relative mb-[27px] w-full cursor-pointer rounded-[7px] bg-white pr-12 text-left text-[1.125rem] font-medium"
                        >
                            {item.title}
                            <svg
                                aria-hidden
                                viewBox="0 0 18 18"
                                className={`absolute top-1/2 right-5 block h-[18px] w-[18px] fill-black transition-transform ${expanded ? "-translate-y-1/2 rotate-180" : "-translate-y-1/2"}`}
                            >
                                <path d="M4.14545 5.36586L9.00653 10.2269L13.8676 5.36586C13.9836 5.24987 14.1213 5.15786 14.2729 5.09508C14.4244 5.03231 14.5868 5 14.7509 5C14.9149 5 15.0773 5.03231 15.2289 5.09508C15.3804 5.15786 15.5181 5.24987 15.6341 5.36586C15.7501 5.48185 15.8421 5.61955 15.9049 5.77111C15.9677 5.92266 16 6.08509 16 6.24912C16 6.41316 15.9677 6.57559 15.9049 6.72714C15.8421 6.87869 15.7501 7.0164 15.6341 7.13239L9.88353 12.883C9.76762 12.9991 9.62995 13.0913 9.47839 13.1542C9.32682 13.217 9.16435 13.2494 9.00027 13.2494C8.83618 13.2494 8.67371 13.217 8.52215 13.1542C8.37058 13.0913 8.23291 12.9991 8.117 12.883L2.36639 7.13239C2.25025 7.01648 2.1581 6.87881 2.09523 6.72724C2.03236 6.57568 2 6.41321 2 6.24912C2 6.08504 2.03236 5.92257 2.09523 5.771C2.1581 5.61944 2.25025 5.48177 2.36639 5.36586C2.855 4.88977 3.65683 4.87725 4.14545 5.36586Z" />
                            </svg>
                        </button>
                        <div
                            id={`faq-${index}`}
                            className={`grid border-b border-black transition-[grid-template-rows] duration-300 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                        >
                            <div className="overflow-hidden">
                                <div className="pt-4 pb-10 text-[.875rem] text-black">{item.description}</div>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
