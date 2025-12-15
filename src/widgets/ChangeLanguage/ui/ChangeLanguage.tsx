import cn from "classnames";
import {
    memo, useEffect, useRef, useState,
} from "react";
import { ILanguage } from "@/types/languages";

import { useLocale } from "@/app/providers/LocaleProvider";

import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";
import Arrow from "@/shared/ui/Arrow/Arrow";

import { changeLanguageData, languageIconsData } from "../model/data/ChangeLanguage.data";
import styles from "./ChangeLanguage.module.scss";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { useUpdateProfileInfoMutation } from "@/entities/Profile/api/profileApi";
import { Profile } from "@/entities/Profile";
import { updateProfileDataAdapter } from "@/features/ProfileInfo";

interface ChangeLanguageProps {
    className?: string;
    localeApi?: Locale;
    profileData?: Profile | null;
}

export const ChangeLanguage = memo(({ className, localeApi, profileData }: ChangeLanguageProps) => {
    const { locale, updateLocale } = useLocale();

    const [updateProfile] = useUpdateProfileInfoMutation();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [language, setLanguage] = useState(localeApi ?? locale);

    const menuRef = useRef(null);

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    useOnClickOutside(menuRef, handleClickOutside);

    const changeLanguageHandleClick = async (lang: ILanguage) => {
        if (profileData) {
            const formatUpdateProfileData = updateProfileDataAdapter(
                { ...profileData, locale: lang.code },
            );
            await updateProfile(formatUpdateProfileData);
        }
        updateLocale(lang.code);
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
                <img src={languageIconsData[language]} alt={`${language} language`} />
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
