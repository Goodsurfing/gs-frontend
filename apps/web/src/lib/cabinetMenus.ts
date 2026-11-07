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
        { text: t("main.sidebar.Подписки на поиск"), href: `${p}/profile/subscriptions`, icon: "mail" },
        { text: t("main.sidebar.Уведомления"), href: `${p}/profile/notifications`, icon: "bell" },
        { text: t("main.sidebar.Пригласить друга"), href: `${p}/profile/invite`, icon: "support" },
    ];
}

/** Меню кабинета организатора (shared/data/sidebar/host-pages старого фронта) */
export function hostMenu(locale: Locale, t: Translate): CabinetMenuItem[] {
    return [
        { text: t("main.sidebar.Рабочий стол"), href: routes.hostDashboard(locale), icon: "home" },
        { text: t("main.sidebar.Предложения"), href: routes.myOffers(locale), icon: "globe" },
        { text: t("main.sidebar.Заявки"), href: routes.hostNotes(locale), icon: "mail" },
        { text: t("main.sidebar.Уведомления"), href: routes.hostNotifications(locale), icon: "bell" },
        { text: t("main.sidebar.Сборы"), href: routes.hostDonations(locale), icon: "check" },
        { text: t("main.sidebar.Пожертвования"), href: routes.hostDonationRating(locale), icon: "support" },
        {
            text: t("main.sidebar.Организация"),
            href: routes.hostInfo(locale),
            icon: "city",
            group: true,
            children: [
                { text: t("main.sidebar.Описание"), href: routes.hostInfo(locale) },
                { text: t("main.sidebar.Фотогалерея"), href: routes.hostGallery(locale) },
                { text: t("main.sidebar.Видеогалерея"), href: routes.hostVideo(locale) },
                { text: t("main.sidebar.Команда"), href: routes.hostTeam(locale) },
                { text: t("main.sidebar.Отзывы"), href: routes.hostReview(locale) },
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
