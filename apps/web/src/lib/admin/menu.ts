/** Меню админки — разделы старой (shared/data/sidebar/admin-pages в корне) плюс сводка */
export interface AdminMenuGroup {
    title: string;
    items: { href: string; label: string }[];
}

export const ADMIN_MENU: AdminMenuGroup[] = [
    { title: "Сводка", items: [{ href: "/admin", label: "Главная" }] },
    {
        title: "Пользователи",
        items: [
            { href: "/admin/users", label: "Все пользователи" },
            { href: "/admin/organizations", label: "Все организации" },
            { href: "/admin/membership-log", label: "Журнал членства" },
            { href: "/admin/skills-achievements", label: "Навыки и достижения" },
            { href: "/admin/vacancies", label: "Все вакансии" },
            { href: "/admin/categories-vacancies", label: "Категории вакансий" },
            { href: "/admin/conditions-vacancies", label: "Условия для вакансий" },
            { href: "/admin/reviews", label: "Отзывы" },
        ],
    },
    { title: "Академия", items: [{ href: "/admin/courses", label: "Все курсы" }, { href: "/admin/reviews-courses", label: "Отзывы о курсах" }] },
    {
        title: "Сообщество",
        items: [
            { href: "/admin/news", label: "Новости" },
            { href: "/admin/blog", label: "Блог" },
            { href: "/admin/journals", label: "Журналы" },
            { href: "/admin/video", label: "Видео" },
            { href: "/admin/reviews-community", label: "Комментарии" },
            { href: "/admin/categories-blog", label: "Категории блога" },
        ],
    },
    { title: "Поддержка", items: [{ href: "/admin/donations", label: "Все сборы" }, { href: "/admin/donation-reports", label: "Публичная отчётность" }] },
    { title: "Лидер", items: [{ href: "/admin/ambassadors", label: "Амбассадоры" }] },
    { title: "О Гудсёрфинге", items: [{ href: "/admin/about-project", label: "О проекте" }, { href: "/admin/our-team", label: "Наша команда" }] },
    { title: "Обратная связь", items: [{ href: "/admin/feedback", label: "Обращения" }] },
    { title: "Система", items: [{ href: "/admin/system-admin", label: "Администраторы" }, { href: "/admin/banner-marketing", label: "Реклама" }] },
];

/** Пункт меню активен на своей странице и на вложенных (/admin/users/:id); «Главная» — только на /admin */
export const isMenuItemActive = (href: string, pathname: string) => {
    const path = pathname.replace(/^\/(ru|en|es)(?=\/|$)/, "") || "/";
    return href === "/admin" ? path === "/admin" : path === href || path.startsWith(`${href}/`);
};
