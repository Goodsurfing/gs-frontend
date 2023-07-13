import { useContext } from "react";
import { LocaleContext } from "../LangRouter/LangRouter";

export const useLocale = () => {
    const { locale, setLocale } = useContext(LocaleContext);
    return { locale, setLocale };
};
