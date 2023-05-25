import { ILanguage } from "types/languages";

import ruIcon from "assets/icons/langs/ru.svg";
import spIcon from "assets/icons/langs/spain.svg";
import engIcon from "assets/icons/langs/uk.svg";

export const changeLanguageData: ILanguage[] = [
  {
    id: "1",
    code: "ru",
    name: "Русский",
    icon: ruIcon,
  },
  {
    id: "2",
    code: "en",
    name: "English",
    icon: engIcon,
  },
  {
    id: "3",
    code: "es",
    name: "Español",
    icon: spIcon,
  },
];
