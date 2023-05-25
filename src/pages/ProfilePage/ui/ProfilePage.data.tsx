import aboutMeIcon from "@assets/icons/navbar/user-icon.svg";
import successIcon from "@assets/icons/navbar/success-icon.svg";
import roleIcon from "@assets/icons/navbar/role-icon.svg";
import shieldIcon from "@assets/icons/navbar/shield-icon.svg";
import lockIcon from "@assets/icons/navbar/lock-icon.svg";

import { SideMenuParams } from "components/SideMenu/types/SideMenu.interface";

export const SideMenuData: SideMenuParams[] = [
  {
    text: "Обо мне",
    icon: aboutMeIcon,
    route: "profile/info",
  },
  {
    text: "Предпочтения",
    icon: successIcon,
    route: "",
  },
  {
    text: "Роль",
    icon: roleIcon,
    route: "",
  },
  {
    text: "Пароль",
    icon: lockIcon,
    route: "",
  },
  {
    route: "",
    text: "Приватность",
    icon: shieldIcon,
  },
];
