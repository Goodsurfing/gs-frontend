import type { CabinetMenuItem } from "@/components/cabinet/CabinetFrame";
import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";

import { routes } from "./routes";

/**
 * Меню кабинета волонтёра (shared/data/sidebar/volunteer-pages старого
 * фронта). «Подписки» в старом меню закомментированы — страница есть, пункта нет.
 * TODO: перенести в lib/cabinetMenus.ts рядом с profileMenu (файл каркаса,
 * в задаче переноса кабинета волонтёра не меняется).
 */
export function volunteerMenu(locale: Locale, t: Translate): CabinetMenuItem[] {
    return [
        { text: t("main.sidebar.Панель управления"), href: routes.volunteerDashboard(locale), icon: "volunteer-about-me" },
        { text: t("main.sidebar.Навыки"), href: routes.volunteerSkills(locale), icon: "volunteer-skills" },
        { text: t("main.sidebar.Отзывы"), href: routes.volunteerReview(locale), icon: "volunteer-reviews" },
        { text: t("main.sidebar.Заявки"), href: routes.volunteerNotes(locale), icon: "mail" },
        { text: t("main.sidebar.Поддержать"), href: routes.volunteerDonations(locale), icon: "support" },
        { text: t("main.sidebar.Фото и видео"), href: routes.volunteerGallery(locale), icon: "volunteer-photo-gallery" },
        { text: t("main.sidebar.Написать в блог"), href: routes.createArticle(locale), icon: "volunteer-blog" },
        { text: t("main.sidebar.Мои статьи"), href: routes.volunteerArticles(locale), icon: "volunteer-articles" },
    ];
}
