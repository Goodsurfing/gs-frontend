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
    return [
        { text: t("main.sidebar.Рабочий стол"), href: routes.hostDashboard(locale), icon: "home" },
        { text: t("main.sidebar.Предложения"), href: routes.myOffers(locale), icon: "globe" },
        { text: t("main.sidebar.Заявки"), href: routes.hostNotes(locale), icon: "mail" },
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
