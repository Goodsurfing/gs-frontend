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
