import { useTranslation } from "react-i18next";
import { SidebarContentProps } from "@/widgets/Sidebar";
import aboutMeIcon from "@/shared/assets/icons/navbar/volunteer/about-me.svg";
import skillsIcon from "@/shared/assets/icons/navbar/volunteer/skills.svg";
import reviewsIcon from "@/shared/assets/icons/navbar/volunteer/reviews.svg";
import feedbackIcon from "@/shared/assets/icons/navbar/volunteer/feedback.svg";
import friendsIcon from "@/shared/assets/icons/navbar/volunteer/friends.svg";
import galleryIcon from "@/shared/assets/icons/navbar/volunteer/photo-gallery.svg";
import blogIcon from "@/shared/assets/icons/navbar/volunteer/blog.svg";
import articlesIcon from "@/shared/assets/icons/navbar/volunteer/articles.svg";

export const useVolunteerSidebarData = () => {
    const { t } = useTranslation();
    const SideMenuData: SidebarContentProps[] = [
        {
            text: t("main.sidebar.Панель управления"),
            icon: aboutMeIcon,
            route: "/volunteer/volunteer-dashboard",
        },
        {
            text: t("main.sidebar.Навыки"),
            icon: skillsIcon,
            route: "/volunteer/skills",
        },
        {
            text: t("main.sidebar.Отзывы"),
            icon: reviewsIcon,
            route: "/volunteer/review",
        },
        {
            text: t("main.sidebar.Заявки"),
            icon: feedbackIcon,
            route: "/volunteer/notes",
        },
        {
            text: t("main.sidebar.Подписки"),
            icon: friendsIcon,
            route: "/volunteer/subscribers",
        },
        {
            text: t("main.sidebar.Фото и видео"),
            icon: galleryIcon,
            route: "/volunteer/gallery",
        },
        {
            text: t("main.sidebar.Написать в блог"),
            icon: blogIcon,
            route: "/volunteer/create-article",
        },
        {
            text: t("main.sidebar.Мои статьи"),
            icon: articlesIcon,
            route: "/volunteer/articles",
        },
    ];
    return { SideMenuData };
};
