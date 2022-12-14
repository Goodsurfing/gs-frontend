import { ILanguage } from "@/type/languages";
import cn from "classnames";
import React, {FC, useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { changeLanguageData } from "@/components/ChangeLanguage/ChangeLanguage.data";
import Arrow from "@/components/ui/Arrow/Arrow";

import { createUrlWithLanguageCode } from "@/utils/language/createUrlWithLanguageCode";

import styles from "./ChangeLanguage.module.scss";
import {useOnClickOutside} from "@/hooks/useOnClickOutside";

interface ChangeLanguageProps {
    className?: string;
}

const ChangeLanguage: FC<ChangeLanguageProps> = ({ className }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentLanguage, setCurrentLanguage] = useState<ILanguage>(
        changeLanguageData[0]
    );

    const ref = useRef(null);

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    useOnClickOutside(ref, handleClickOutside);

    const changeLanguageHandleClick = (lang: ILanguage) => {
        i18n.changeLanguage(lang.code);
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
        });
        setCurrentLanguage(currentLang[0]);
    }, [i18n.language]);

    return (
        <div ref={ref} className={styles.wrapper}>
            <div
                className={cn(styles.selectLang, className)}
                onClick={() => setIsOpen(!isOpen)}
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
                    changeLanguageData.map((item) => (
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
};

export default ChangeLanguage;
