import {
    createContext, useState, useMemo, FC, ReactNode,
} from "react";

export type Locale = "ru" | "en" | "es";

interface LocaleContextProps {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextProps>({
    locale: "ru",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setLocale: (newLocale: "ru" | "en" | "es") => {},
});

export const defaultLocale = "ru";
export const availableLocales: Locale[] | string[] = ["ru", "en", "es"];

interface LocaleProviderProps {
    initialLanguage?: Locale;
    children: ReactNode;
}

export const LocaleProvider: FC<LocaleProviderProps> = ({ initialLanguage, children }) => {
    const [locale, setLocale] = useState(initialLanguage || defaultLocale);

    const defaultProps = useMemo(() => ({
        locale,
        setLocale,
    }), [locale]);

    return (
        <LocaleContext.Provider value={defaultProps}>
            {children}
        </LocaleContext.Provider>
    );
};
