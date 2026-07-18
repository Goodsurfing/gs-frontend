import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import arrowIcon from "@/shared/assets/icons/arrow-right.svg";

import styles from "./ButtonClose.module.scss";

interface ButtonCloseProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export const ButtonClose: FC<ButtonCloseProps> = (props) => {
    const { value, onChange } = props;
    const { t } = useTranslation();

    return (
        <>
            <span
                className={cn(styles.text, { [styles.closed]: !value })}
                onClick={() => onChange(!value)}
            >
                {t("Вернуться к карте")}
            </span>
            <div
                className={cn(styles.wrapper, { [styles.closed]: !value })}
                onClick={() => onChange(!value)}
            >
                <div className={styles.buttonWrapper}>
                    <img
                        src={arrowIcon}
                        className={cn(styles.arrow, { [styles.closed]: !value })}
                        alt="arrow"
                    />
                </div>
            </div>
        </>
    );
};
