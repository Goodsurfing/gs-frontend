"use client";

import { useEffect, useState } from "react";

// Раздел считается текущим, когда пересекает линию в 100 px от верха окна (как в старом фронте)
const ACTIVE_LINE = 100;

/**
 * Оглавление юридической страницы: ссылки на разделы, текущий раздел
 * подсвечивается серым. В старом фронте это были div с обработчиком клика —
 * здесь обычные ссылки на якоря: работают без JS, с клавиатуры и открываются
 * в новой вкладке. Шире 992 px, уже — скрыто, как раньше.
 */
export function LegalSideMenu({ items, label }: { items: { id: string; title: string }[]; label: string }) {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        const update = () => {
            const current = items.find(({ id }) => {
                const rect = document.getElementById(id)?.getBoundingClientRect();
                return rect !== undefined && rect.top - ACTIVE_LINE <= ACTIVE_LINE && rect.bottom > ACTIVE_LINE;
            });
            setActive(current?.id ?? null);
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [items]);

    return (
        <nav aria-label={label} className="relative flex-[1_0_350px] border-r border-caption down-lg:hidden">
            <ul className="sticky top-32 left-0 flex max-w-[325px] flex-col gap-y-[1lh]">
                {items.map(({ id, title }) => (
                    <li key={id}>
                        <a
                            href={`#${id}`}
                            aria-current={active === id ? "location" : undefined}
                            className="block text-black transition-colors duration-300 hover:underline aria-[current=location]:text-[gray]"
                        >
                            {title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
