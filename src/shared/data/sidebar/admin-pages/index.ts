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
                    route: "/review-courses",
                    text: "Отзывы о курсах",
                },
            ],
        },
    ];
    return { AdminPagesSidebarData };
};
