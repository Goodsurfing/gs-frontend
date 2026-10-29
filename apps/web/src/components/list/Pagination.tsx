import { pageItems } from "@/lib/pagination";

const ITEM = "mx-[3px] box-border inline-flex h-10 min-w-10 items-center justify-center rounded-[20px] px-2.5 font-[Roboto,Helvetica,Arial,sans-serif] text-[15px] leading-[1.43] tracking-[0.01071em] text-black/87";

/**
 * Пагинация ссылками (?page=N): работает без JS, страницы индексируются.
 * Внешний вид — как MUI Pagination size="large" старого фронта.
 */
export function Pagination({ page, count, href, labels }: {
    page: number;
    count: number;
    href: (page: number) => string;
    labels: { prev: string; next: string; page: string };
}) {
    const arrow = (target: number, disabled: boolean, label: string, path: string) => (disabled
        ? (
            <span aria-hidden className={`${ITEM} opacity-38`}>
                <svg viewBox="0 0 24 24" className="-mx-2 h-[22px] w-[22px] fill-current"><path d={path} /></svg>
            </span>
        )
        : (
            <a href={href(target)} aria-label={label} className={`${ITEM} transition-colors hover:bg-black/4`}>
                <svg aria-hidden viewBox="0 0 24 24" className="-mx-2 h-[22px] w-[22px] fill-current"><path d={path} /></svg>
            </a>
        ));

    return (
        <nav className="flex py-2.5" aria-label={labels.page}>
            <ul className="flex flex-wrap items-center">
                <li>{arrow(page - 1, page <= 1, labels.prev, "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z")}</li>
                {pageItems(page, Math.max(count, 1)).map((item) => (
                    <li key={item}>
                        {typeof item === "number"
                            ? (
                                <a
                                    href={href(item)}
                                    aria-current={item === page ? "page" : undefined}
                                    className={`${ITEM} transition-colors hover:bg-black/4 aria-[current=page]:bg-black/8`}
                                >
                                    {item}
                                </a>
                            )
                            : <span className={`${ITEM} h-auto`}>…</span>}
                    </li>
                ))}
                <li>{arrow(page + 1, page >= count, labels.next, "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z")}</li>
            </ul>
        </nav>
    );
}
