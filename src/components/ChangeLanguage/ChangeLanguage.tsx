import cn from "classnames";
import React, { FC } from "react";

import Arrow from "@/components/ui/Arrow/Arrow";

import ruIcon from "@/assets/icons/langs/ru.svg";

import styles from "./ChangeLanguage.module.scss";

interface ChangeLanguageProps {
    className?: string;
}

const ChangeLanguage: FC<ChangeLanguageProps> = ({ className }) => {
    return (
        <div className={cn(styles.selectLang, className)}>
            <img src={ruIcon} alt="Russian" />
            <Arrow isOpen={false} />
        </div>
    );
};

export default ChangeLanguage;
