import cn from "classnames";
import React, {
    useEffect, useRef, useState, memo, useContext,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import Arrow from "@/shared/ui/Arrow/Arrow";

import { changeLanguageData } from "../model/data/ChangeLanguage.data";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import { createUrlWithLanguageCode } from "@/shared/utils/language/createUrlWithLanguageCode";

import { localeApi } from "@/store/api/localeApi";

import { ILanguage } from "@/types/languages";

import styles from "./ChangeLanguage.module.scss";
import { LocaleContext } from "@/routes";

interface ChangeLanguageProps {
    className?: string;
}

export const ChangeLanguage = memo(({ className }: ChangeLanguageProps) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { locale, setLocale } = useContext(LocaleContext);

    const [changeLocale] = localeApi.useChangeLocaleMutation();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    // const [currentLanguage, setCurrentLanguage] = useState<ILanguage>(
    //     changeLanguageData[0],
    // );

    const [language, setLanguage] = useState(locale);

    const menuRef = useRef(null);

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    useOnClickOutside(menuRef, handleClickOutside);

    const changeLanguageHandleClick = async (lang: ILanguage) => {
        setLocale(lang.code);
        // await changeLocale({
        //     locale: lang.code,
        // });
        setIsOpen(false);
    };

    useEffect(() => {
        setLanguage(locale);
    }, [locale]);

    return (
        <div ref={menuRef} className={styles.wrapper}>
            <div
                className={cn(styles.selectLang, className)}
                onClick={() => setIsOpen(!isOpen)}
            >
                <p>{language}</p>
                {/* <img src={currentLanguage.icon} alt={currentLanguage.name} /> */}
                <Arrow isOpen={isOpen} />
            </div>
            <div
                className={cn(styles.list, {
                    [styles.visible]: isOpen,
                })}
            >
                {changeLanguageData
                    && changeLanguageData.map((item) => (
                        <div
                            key={item.id}
                            className={styles.item}
                            onClick={() => changeLanguageHandleClick(item)}
                        >
                            <img src={item.icon} alt={item.name} />
                            <span>{item.name}</span>
                        </div>
                    ))}
            </div>
        </div>
    );
});
