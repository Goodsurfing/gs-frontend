import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";

/**
 * Баннер «Оформи членство» (features/MemberBanner старого фронта): картинка
 * фоном, заголовок и синяя кнопка на страницу членства.
 */
export function MemberBanner({ locale, title, button, anchor, vertical = false, className = "" }: {
    locale: Locale;
    title: string;
    button: string;
    /** Якорь на странице членства (#host — раздел для организаторов) */
    anchor?: string;
    /** Узкий высокий вариант для боковой колонки кабинета (GS-188) */
    vertical?: boolean;
    className?: string;
}) {
    const shape = vertical
        ? "min-h-[280px] max-w-[240px] bg-center px-[18px] py-6 down-lg:min-h-[174px] down-lg:max-w-full"
        : "min-h-[174px] max-w-[468px] px-[30px]";
    return (
        <div className={`box-border flex w-full flex-col items-center justify-center gap-5 bg-[url(/web/images/member-banner.png)] bg-cover bg-no-repeat ${shape} ${className}`}>
            <h3 className={`text-center leading-[130%] font-medium text-white down-sm:text-[16px] ${vertical ? "text-[16px]" : "text-[18px]"}`}>{title}</h3>
            <a
                href={`${routes.membership(locale)}${anchor ? `#${anchor}` : ""}`}
                className="flex items-center justify-center rounded-[10px] border border-primary bg-primary px-[50px] py-2.5 text-center text-label text-white transition-all duration-300 hover:bg-white hover:text-primary down-sm:p-2.5"
            >
                {button}
            </a>
        </div>
    );
}
