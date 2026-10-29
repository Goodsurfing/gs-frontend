import type { ReactNode } from "react";

/**
 * Раздел страницы (shared/ui/Section старого фронта): отступ сверху 80 px,
 * колонка фиксированной ширины 1180/992/768/480/320 px по точкам перелома,
 * заголовок h2 по центру.
 */
export function AcademySection({ title, id, className = "", innerClassName = "", children }: {
    title?: string;
    id?: string;
    className?: string;
    /** Классы колонки (в старом фронте — className у Section) */
    innerClassName?: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className={`pt-20 ${className}`}>
            <div className={`mx-auto w-[1180px] down-xl:w-[992px] down-lg:w-[768px] down-md:w-[480px] down-xs:w-[320px] ${innerClassName}`}>
                {title && <h2 className="text-center text-[1.625rem] leading-[123%] font-normal text-black">{title}</h2>}
                {children}
            </div>
        </section>
    );
}
