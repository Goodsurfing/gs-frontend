import { SidebarContentProps } from "@/widgets/Sidebar";
import aboutMeIcon from "@/shared/assets/icons/navbar/volunteer/about-me.svg";
import skillsIcon from "@/shared/assets/icons/navbar/volunteer/skills.svg";
import reviewsIcon from "@/shared/assets/icons/navbar/volunteer/reviews.svg";
import feedbackIcon from "@/shared/assets/icons/navbar/volunteer/feedback.svg";
import friendsIcon from "@/shared/assets/icons/navbar/volunteer/friends.svg";
import galleryIcon from "@/shared/assets/icons/navbar/volunteer/photo-gallery.svg";
import blogIcon from "@/shared/assets/icons/navbar/volunteer/blog.svg";
import articlesIcon from "@/shared/assets/icons/navbar/volunteer/articles.svg";

export const SideMenuData: SidebarContentProps[] = [
    {
        text: "Панель управления",
        icon: aboutMeIcon,
        route: "/volunteer/volunteer-dashboard",
    },
    {
        text: "Навыки",
        icon: skillsIcon,
        route: "/volunteer/skills",
    },
    {
        text: "Отзывы",
        icon: reviewsIcon,
        route: "/volunteer/review",
    },
    {
        text: "Заявки",
        icon: feedbackIcon,
        route: "/volunteer/notes",
    },
    {
        text: "Подписки",
        icon: friendsIcon,
        route: "/volunteer/subscribers",
    },
    {
        text: "Фото и видео",
        icon: galleryIcon,
        route: "/volunteer/gallery",
    },
    {
        text: "Написать в блог",
        icon: blogIcon,
        route: "/volunteer/create-article",
    },
    {
        text: "Мои статьи",
        icon: articlesIcon,
        route: "/volunteer/articles",
    },
];
