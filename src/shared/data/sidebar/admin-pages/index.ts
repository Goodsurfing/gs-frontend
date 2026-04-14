import { SidebarContentProps } from "@/widgets/Sidebar";

export const useAdminPagesSidebarData = () => {
    const AdminPagesSidebarData: SidebarContentProps[] = [
        {
            route: "/admin",
            text: "Пользователи",
            dropdownItems: [
                {
                    route: "/users",
                    text: "Все пользователи",
                },
                {
                    route: "/organizations",
                    text: "Все организации",
                },
                {
                    route: "/skills-achievements",
                    text: "Навыки и достижения пользователей",
                },
                {
                    route: "/vacancies",
                    text: "Все вакансии",
                },
                {
                    route: "/categories-vacancies",
                    text: "Категории вакансий",
                },
                {
                    route: "/conditions-vacancies",
                    text: "Условия для вакансий",
                },
                {
                    route: "/reviews",
                    text: "Отзывы",
                },
            ],
        },
        {
            route: "/admin",
            text: "Академия",
            dropdownItems: [
                {
                    route: "/courses",
                    text: "Все курсы",
                },
                {
                    route: "/reviews-courses",
                    text: "Отзывы о курсах",
                },
            ],
        },
        {
            route: "/admin",
            text: "Сообщество",
            dropdownItems: [
                {
                    route: "/news",
                    text: "Все новости",
                },
                {
                    route: "/blog",
                    text: "Все статьи блога",
                },
                {
                    route: "/journals",
                    text: "Все журналы",
                },
                {
                    route: "/video",
                    text: "Все видео",
                },
                {
                    route: "/reviews-community",
                    text: "Комментарии",
                },
                {
                    route: "/categories-blog",
                    text: "Категории для блога",
                },
            ],
        },
        {
            route: "/admin",
            text: "Поддержка",
            dropdownItems: [
                {
                    route: "/donations",
                    text: "Все сборы",
                },
                {
                    route: "/donation-reports",
                    text: "Публичная отчётность",
                },
            ],

        },
        {
            route: "/admin",
            text: "Лидер",
            dropdownItems: [
                {
                    route: "/ambassadors",
                    text: "Амбассадоры",
                },
            ],

        },
        {
            route: "/admin",
            text: "О Гудсёрфинге",
            dropdownItems: [
                {
                    route: "/about-project",
                    text: "О проекте",
                },
                {
                    route: "/our-team",
                    text: "Наша команда",
                },
            ],

        },
        {
            route: "/admin",
            text: "Система",
            dropdownItems: [
                {
                    route: "/system-admin",
                    text: "Администраторы",
                },
                {
                    route: "/banner-marketing",
                    text: "Реклама",
                },
            ],

        },
    ];
    return { AdminPagesSidebarData };
};
