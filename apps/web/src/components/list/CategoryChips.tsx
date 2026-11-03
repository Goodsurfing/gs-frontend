const DEFAULT_COLOR = "#3DABF7";

/**
 * Фильтр по категории (как CategoriesFilter + MUI ToggleButtonGroup старого
 * фронта): «пилюли» с рамкой цвета категории, выбранная — залита. Ссылки:
 * повторное нажатие на выбранную снимает фильтр. Если известно число
 * материалов — оно рядом с названием, пустые категории бледные и не нажимаются.
 */
export function CategoryChips({ title, categories, value, href }: {
    title: string;
    categories: { id: number; name: string; color: string; count?: number }[];
    value?: number;
    href: (category?: number) => string;
}) {
    if (categories.length === 0) return null;

    return (
        <div>
            <span className="mb-2.5 block text-caption">{title}</span>
            <div className="flex max-w-[39.25rem]">
                <div className="flex max-w-[624px] flex-wrap gap-2.5 rounded-[4px]">
                    {categories.map((category, index) => {
                        const color = category.color || DEFAULT_COLOR;
                        const selected = category.id === value;
                        const className = `box-content inline-flex max-h-[35px] items-center justify-center rounded-[26px] border-2 px-2.5 py-[5px] text-[14px] leading-[1.75] font-medium tracking-[0.02857em] text-ink-secondary transition-colors ${index > 0 ? "-ml-px" : ""}`;
                        const label = (
                            <>
                                {category.name}
                                {category.count !== undefined && <span className="ml-1.5 text-caption">{category.count}</span>}
                            </>
                        );
                        if (category.count === 0 && !selected) {
                            return (
                                <span key={category.id} aria-disabled="true" style={{ borderColor: color }} className={`${className} cursor-default opacity-45`}>
                                    {label}
                                </span>
                            );
                        }
                        return (
                            <a
                                key={category.id}
                                href={href(selected ? undefined : category.id)}
                                aria-current={selected ? "true" : undefined}
                                style={{ borderColor: color, backgroundColor: selected ? color : undefined }}
                                className={`${className} ${selected ? "" : "hover:bg-black/4"}`}
                            >
                                {label}
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
