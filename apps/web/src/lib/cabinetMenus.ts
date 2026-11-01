import type { CabinetMenuItem } from "@/components/cabinet/CabinetFrame";
import { type Locale, localePrefix } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";

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
