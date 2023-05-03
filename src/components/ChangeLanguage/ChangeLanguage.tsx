import Arrow from "@/UI/Arrow/Arrow";
import cn from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { changeLanguageData } from "@/components/ChangeLanguage/ChangeLanguage.data";

import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import { createUrlWithLanguageCode } from "@/utils/language/createUrlWithLanguageCode";

import { localeApi } from "@/store/api/localeApi";

import { ILanguage } from "@/types/languages";

import styles from "./ChangeLanguage.module.scss";

interface ChangeLanguageProps {
    className?: string;
}

const ChangeLanguage: FC<ChangeLanguageProps> = ({ className }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [changeLocale] = localeApi.useChangeLocaleMutation();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentLanguage, setCurrentLanguage] = useState<ILanguage>(
        changeLanguageData[0]
    );

    const menuRef = useRef(null);

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    useOnClickOutside(menuRef, handleClickOutside);

    const changeLanguageHandleClick = async (lang: ILanguage) => {
        i18n.changeLanguage(lang.code);
        await changeLocale({
            locale: lang.code,
        });
        navigate(createUrlWithLanguageCode(lang.code, location.pathname), {
            replace: true,
        });
        setIsOpen(false);
    };

    useEffect(() => {
        const currentLang = changeLanguageData.filter((item) => {
            if (item.code === i18n.language) {
                return item;
            }

            return false;
        });
        setCurrentLanguage(currentLang[0]);
    }, [i18n.language]);

    return (
        <div ref={menuRef} className={styles.wrapper}>
            <div
                className={cn(styles.selectLang, className)}
                onClick={() => {
                    return setIsOpen(!isOpen);
                }}
            >
                <img src={currentLanguage.icon} alt={currentLanguage.name} />
                <Arrow isOpen={isOpen} />
            </div>
            <div
                className={cn(styles.list, {
                    [styles.visible]: isOpen,
                })}
            >
                {changeLanguageData &&
                    changeLanguageData.map((item) => {
                        return (
                            <div
                                key={item.id}
                                className={styles.item}
                                onClick={() => {
                                    return changeLanguageHandleClick(item);
                                }}
                            >
                                <img src={item.icon} alt={item.name} />
                                <span>{item.name}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default ChangeLanguage;
