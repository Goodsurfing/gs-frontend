import cn from "classnames";
import {
    memo, useEffect, useRef, useState,
} from "react";
import { localeApi } from "@/store/api/localeApi";
import { ILanguage } from "@/types/languages";

import { useLocale } from "@/app/providers/LocaleProvider";

import ruIcon from "@/shared/assets/icons/langs/ru.svg";
import esIcon from "@/shared/assets/icons/langs/spain.svg";
import enIcon from "@/shared/assets/icons/langs/uk.svg";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import Arrow from "@/shared/ui/Arrow/Arrow";

import { changeLanguageData } from "../model/data/ChangeLanguage.data";
import styles from "./ChangeLanguage.module.scss";

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
                {language === "ru" && <img src={ruIcon} alt="Russian language" />}
                {language === "en" && <img src={enIcon} alt="English language" />}
                {language === "es" && <img src={esIcon} alt="Spain language" />}
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
