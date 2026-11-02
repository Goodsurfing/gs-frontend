import { pageItems } from "@/lib/pagination";

export const PAGE_ITEM = "mx-[3px] box-border inline-flex h-10 min-w-10 items-center justify-center rounded-[20px] px-2.5 font-[Roboto,Helvetica,Arial,sans-serif] text-[15px] leading-[1.43] tracking-[0.01071em] text-black/87";
/** MUI Pagination size="small" (колонки заявок организатора) */
const ITEM_SMALL = "mx-px box-border inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-[13px] px-1 font-[Roboto,Helvetica,Arial,sans-serif] text-[13px] leading-[1.43] tracking-[0.01071em] text-black/87";

/**
 * Пагинация ссылками (?page=N): работает без JS, страницы индексируются.
 * В кабинете (данные в браузере) — кнопками: onPage вместо href.
 * Внешний вид — как MUI Pagination size="large" старого фронта.
 */
export function Pagination({ page, count, href, onPage, size, labels }: {
    page: number;
    count: number;
    href?: (page: number) => string;
    onPage?: (page: number) => void;
    size?: "small";
    labels: { prev: string; next: string; page: string };
}) {
    const ITEM = size === "small" ? ITEM_SMALL : PAGE_ITEM;
    // Функция, а не компонент: компонент, объявленный в рендере, пересоздавал бы кнопки и терял фокус
    const link = (target: number, className: string, children: React.ReactNode, extra: { "aria-label"?: string; "aria-current"?: "page" } = {}) => (onPage
        ? <button type="button" onClick={() => onPage(target)} className={`${className} cursor-pointer border-0 bg-transparent`} {...extra}>{children}</button>
        : <a href={href?.(target)} className={className} {...extra}>{children}</a>);
    const arrow = (target: number, disabled: boolean, label: string, path: string) => (disabled
        ? (
            <span aria-hidden className={`${ITEM} opacity-38`}>
                <svg viewBox="0 0 24 24" className="-mx-2 h-[22px] w-[22px] fill-current"><path d={path} /></svg>
            </span>
        )
        : (
            link(target, `${ITEM} transition-colors hover:bg-black/4`, <svg aria-hidden viewBox="0 0 24 24" className="-mx-2 h-[22px] w-[22px] fill-current"><path d={path} /></svg>, { "aria-label": label })
        ));

    return (
        <nav className="flex py-2.5" aria-label={labels.page}>
            <ul className="flex flex-wrap items-center">
                <li>{arrow(page - 1, page <= 1, labels.prev, "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z")}</li>
                {pageItems(page, Math.max(count, 1)).map((item) => (
                    <li key={item}>
                        {typeof item === "number"
                            ? (
                                link(item, `${ITEM} transition-colors hover:bg-black/4 aria-[current=page]:bg-black/8`, item, { "aria-current": item === page ? "page" : undefined })
                            )
                            : <span className={`${ITEM} h-auto`}>…</span>}
                    </li>
                ))}
                <li>{arrow(page + 1, page >= count, labels.next, "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z")}</li>
            </ul>
        </nav>
    );
}
