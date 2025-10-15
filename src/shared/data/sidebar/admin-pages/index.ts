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
                    route: "/reviews",
                    text: "Отзывы",
                },
            ],
        },
    ];
    return { AdminPagesSidebarData };
};
