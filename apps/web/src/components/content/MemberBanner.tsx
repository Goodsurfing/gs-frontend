import type { Locale } from "@/i18n/config";
import { routes } from "@/lib/routes";

/**
 * Баннер «Оформи членство» (features/MemberBanner старого фронта): картинка
 * фоном, заголовок и синяя кнопка на страницу членства.
 */
export function MemberBanner({ locale, title, button, className = "" }: {
    locale: Locale;
    title: string;
    button: string;
    className?: string;
}) {
    return (
        <div className={`box-border flex min-h-[174px] w-full max-w-[468px] flex-col items-center justify-center gap-5 bg-[url(/web/images/member-banner.png)] bg-cover bg-no-repeat px-[30px] ${className}`}>
            <h3 className="text-center text-[18px] leading-[130%] font-medium text-white down-sm:text-[16px]">{title}</h3>
            <a
                href={routes.membership(locale)}
                className="flex items-center justify-center rounded-[10px] border border-primary bg-primary px-[50px] py-2.5 text-center text-label text-white transition-all duration-300 hover:bg-white hover:text-primary down-sm:p-2.5"
            >
                {button}
            </a>
        </div>
    );
}
