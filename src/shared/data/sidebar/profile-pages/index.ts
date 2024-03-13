import { useTranslation } from "react-i18next";
import aboutMeIcon from "@/shared/assets/icons/navbar/user-icon.svg";
import successIcon from "@/shared/assets/icons/navbar/success-icon.svg";
import roleIcon from "@/shared/assets/icons/navbar/role-icon.svg";
import shieldIcon from "@/shared/assets/icons/navbar/shield-icon.svg";
import lockIcon from "@/shared/assets/icons/navbar/lock-icon.svg";

import { SidebarContentProps } from "@/widgets/Sidebar";

export const useProfileSidebarData = () => {
    const { t } = useTranslation();
    const SideMenuData: SidebarContentProps[] = [
        {
            text: t("main.sidebar.Обо мне"),
            icon: aboutMeIcon,
            route: "/profile",
        },
        {
            text: t("main.sidebar.Предпочтения"),
            icon: successIcon,
            route: "/profile/preferences",
        },
        {
            text: t("main.sidebar.Роль"),
            icon: roleIcon,
            route: "/profile/role",
        },
        {
            text: t("main.sidebar.Пароль"),
            icon: lockIcon,
            route: "/profile/reset-password",
        },
        {
            text: t("main.sidebar.Приватность"),
            icon: shieldIcon,
            route: "/profile/privacy",
        },
    ];
    return { SideMenuData };
};
