import { ILanguage } from "@/type/languages";

import ruIcon from "@/assets/icons/langs/ru.svg";
import spIcon from "@/assets/icons/langs/spain.svg";
import engIcon from "@/assets/icons/langs/uk.svg";

export const changeLanguageData: ILanguage[] = [
    {
        id: "1",
        code: "RU",
        name: "Русский",
        icon: ruIcon,
    },
    {
        id: "2",
        code: "UK",
        name: "English",
        icon: engIcon,
    },
    {
        id: "3",
        code: "ES",
        name: "Español",
        icon: spIcon,
    },
];
