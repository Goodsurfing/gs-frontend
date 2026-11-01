import type { CabinetMenuItem } from "@/components/cabinet/CabinetFrame";
import { type Locale, localePrefix } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";

/** Меню раздела «Профиль» (shared/data/sidebar/profile-pages старого фронта) */
export function profileMenu(locale: Locale, t: Translate): CabinetMenuItem[] {
    const p = localePrefix(locale);
    return [
        { text: t("main.sidebar.Обо мне"), href: `${p}/profile/info`, icon: "user-icon" },
        { text: t("main.sidebar.Предпочтения"), href: `${p}/profile/preferences`, icon: "success-icon" },
        { text: t("main.sidebar.Роль"), href: `${p}/profile/role`, icon: "role-icon" },
        { text: t("main.sidebar.Пароль"), href: `${p}/profile/reset-password`, icon: "lock-icon" },
        { text: t("main.sidebar.Приватность"), href: `${p}/profile/privacy`, icon: "shield-icon" },
    ];
}

/** Меню кабинета организатора (shared/data/sidebar/host-pages старого фронта) */
export function hostMenu(locale: Locale, t: Translate): CabinetMenuItem[] {
    const p = localePrefix(locale);
    return [
        { text: t("main.sidebar.Рабочий стол"), href: `${p}/host/host-dashboard`, icon: "home" },
        { text: t("main.sidebar.Предложения"), href: `${p}/host/my-offers`, icon: "globe" },
        { text: t("main.sidebar.Заявки"), href: `${p}/host/notes`, icon: "mail" },
        { text: t("main.sidebar.Сборы"), href: `${p}/host/donations`, icon: "check" },
        { text: t("main.sidebar.Пожертвования"), href: `${p}/host/donation-rating`, icon: "support" },
        {
            text: t("main.sidebar.Организация"),
            href: `${p}/host/info`,
            icon: "city",
            group: true,
            children: [
                { text: t("main.sidebar.Описание"), href: `${p}/host/info` },
                { text: t("main.sidebar.Фотогалерея"), href: `${p}/host/gallery` },
                { text: t("main.sidebar.Видеогалерея"), href: `${p}/host/video` },
                { text: t("main.sidebar.Команда"), href: `${p}/host/team` },
                { text: t("main.sidebar.Отзывы"), href: `${p}/host/review` },
            ],
        },
    ];
}

/**
 * Меню мастера сбора (shared/data/sidebar/fundraise-pages старого фронта):
 * «К сборам» и шаги мастера своего сбора.
 */
export function fundraiseMenu(locale: Locale, t: Translate, id: string): CabinetMenuItem[] {
    const step = (name: Parameters<typeof routes.fundraiseStep>[1]) => routes.fundraiseStep(locale, name, id);
    return [
        { text: t("main.sidebar.К сборам"), href: routes.hostDonations(locale), icon: "offers/back" },
        { text: t("main.sidebar.Где"), href: step("where"), icon: "offers/pin" },
        { text: t("main.sidebar.Когда"), href: step("when"), icon: "offers/calendar" },
        { text: t("main.sidebar.Сколько"), href: step("amount"), icon: "offers/view-list" },
        { text: t("main.sidebar.Описание"), href: step("description"), icon: "offers/checklist" },
        { text: t("main.sidebar.Настройка автоматических сообщений"), href: step("auto-messages"), icon: "offers/writing-fluently" },
    ];
}
