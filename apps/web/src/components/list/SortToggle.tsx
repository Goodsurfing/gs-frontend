/**
 * Переключатель «Свежее / Популярное» ссылками (?sort=…), внешне — как
 * MUI ToggleButtonGroup старого фронта (features/Article/ui/Filter).
 */
export function SortToggle<T extends string>({ value, options, href }: {
    value: T;
    options: { value: T; text: string }[];
    href: (value: T) => string;
}) {
    return (
        <div className="flex max-w-[624px] flex-wrap gap-2.5 rounded-[4px]">
            {options.map((option, index) => {
                const selected = option.value === value;
                return (
                    <a
                        key={option.value}
                        href={href(option.value)}
                        aria-current={selected ? "true" : undefined}
                        className={`box-content inline-flex max-h-[35px] items-center justify-center rounded-[26px] px-2.5 py-[5px] text-[14px] leading-[1.75] font-medium tracking-[0.02857em] transition-colors ${index > 0 ? "-ml-px" : ""} ${selected ? "bg-primary text-white" : "border border-caption text-ink-secondary hover:bg-black/4"}`}
                    >
                        {option.text}
                    </a>
                );
            })}
        </div>
    );
}
