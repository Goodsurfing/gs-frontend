import { ILanguage } from "@/type/languages";
import cn from "classnames";
import React, { FC, useState } from "react";

import { changeLanguageData } from "@/components/ChangeLanguage/ChangeLanguage.data";
import Arrow from "@/components/ui/Arrow/Arrow";

import styles from "./ChangeLanguage.module.scss";

interface ChangeLanguageProps {
    className?: string;
}

const ChangeLanguage: FC<ChangeLanguageProps> = ({ className }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentLanguage, setCurrentLanguage] = useState<ILanguage>(
        changeLanguageData[0]
    );

    const changeLanguageHandleClick = (item: ILanguage) => {
        setCurrentLanguage(item);
        setIsOpen(false);
    };

    return (
        <div className={styles.wrapper}>
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
