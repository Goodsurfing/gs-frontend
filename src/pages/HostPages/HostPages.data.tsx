import { SideMenuParams } from "components/SideMenu/types/SideMenu.interface";

import calendarIcon from "assets/icons/navbar/calendar.svg";
import cityIcon from "assets/icons/navbar/city.svg";
import globeIcon from "assets/icons/navbar/globe.svg";
import houseIcon from "assets/icons/navbar/home.svg";
import mailIcon from "assets/icons/navbar/mail.svg";

export const HostPagesSidebarData: SideMenuParams[] = [
  {
    route: "host",
    text: "Рабочий стол",
    icon: houseIcon,
  },
  {
    route: "offers",
    text: "Предложения",
    icon: globeIcon,
  },
  {
    route: "notes",
    text: "Заявки",
    icon: mailIcon,
  },
  {
    route: "calendar",
    text: "Календарь",
    icon: calendarIcon,
  },
  {
    route: "organization",
    text: "Организация",
    icon: cityIcon,
    dropdownItems: [
      {
        text: "Описание",
        route: "registration",
      },
      {
        text: "Фотогалерея",
        route: "",
      },
      {
        text: "Видеогалерея",
        route: "",
      },
      {
        text: "Команда",
        route: "",
      },
      {
        text: "Отзывы",
        route: "",
      },
    ],
  },
];
