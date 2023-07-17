import cn from "classnames";
import {
    useEffect, useRef, useState, memo,
} from "react";
import Arrow from "@/shared/ui/Arrow/Arrow";

import { changeLanguageData } from "../model/data/ChangeLanguage.data";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

import { localeApi } from "@/store/api/localeApi";

import { ILanguage } from "@/types/languages";

import styles from "./ChangeLanguage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface ChangeLanguageProps {
    className?: string;
}

export const ChangeLanguage = memo(({ className }: ChangeLanguageProps) => {
    const { locale, updateLocale } = useLocale();

    const [changeLocale] = localeApi.useChangeLocaleMutation();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [language, setLanguage] = useState(locale);

    const menuRef = useRef(null);

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    useOnClickOutside(menuRef, handleClickOutside);

    const changeLanguageHandleClick = async (lang: ILanguage) => {
        updateLocale(lang.code);
        await changeLocale({
            locale: lang.code,
        });
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
