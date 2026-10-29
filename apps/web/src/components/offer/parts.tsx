import type { ReactNode } from "react";

/**
 * Мелкие части страницы вакансии (shared/ui старого фронта: Text, InfoCard,
 * IconTextComponent). Иконки старый фронт вставлял в разметку и красил
 * через fill — здесь локальные красятся маской, с API — вставляются как есть.
 */

/** Иконка из public/web/icons/offer цветом текста */
export function MaskIcon({ name, className = "" }: { name: string; className?: string }) {
    const url = `url(/web/icons/offer/${name}.svg)`;
    return (
        <span
            aria-hidden
            className={`inline-block shrink-0 bg-current ${className}`}
            style={{ maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }}
        />
    );
}

/** SVG с API, уже очищенный на сервере (inlineSvg), цветом текста */
export function RemoteSvg({ svg, className = "" }: { svg: string | null; className?: string }) {
    if (!svg) return <span aria-hidden className={`inline-block shrink-0 ${className}`} />;
    return (
        <span
            aria-hidden
            className={`inline-block shrink-0 [&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current [&_svg_*]:fill-current ${className}`}
             
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}

/** Заголовок блока (Text titleSize="h3"): до 992 px — по центру */
export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <h3 className={`text-[18px] leading-[120%] font-medium down-lg:text-center ${className}`}>{children}</h3>;
}

/** Иконка в голубом круге и подпись (IconTextComponent) */
export function IconText({ icon, text }: { icon: ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-5 text-[16px]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">{icon}</div>
            {text}
        </div>
    );
}

/** Сетка карточек «иконка + подпись» */
export function IconGrid({ children }: { children: ReactNode }) {
    return <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-[30px]">{children}</div>;
}

/** Серая плашка с парами «подпись — значение» (InfoCard) */
export function InfoCard({ children, className = "flex-wrap" }: { children: ReactNode; className?: string }) {
    return <div className={`flex w-full gap-[30px] rounded-[10px] bg-field px-[30px] py-4 down-md:flex-col ${className}`}>{children}</div>;
}

export function InfoCardItem({ title, text, className = "", children }: {
    title: string;
    text?: string | number;
    className?: string;
    children?: ReactNode;
}) {
    return (
        <div className={`flex flex-col gap-2 text-[16px] leading-[120%] text-ink-secondary ${className}`}>
            <span className="text-[12px] leading-[120%] font-medium text-caption">{title}</span>
            {/* Ноль старый фронт не показывал (text && …) */}
            {text ? <span>{text}</span> : null}
            {children}
        </div>
    );
}
