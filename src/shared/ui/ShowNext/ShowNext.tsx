import React, { FC } from "react";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import styles from "./ShowNext.module.scss";
import arrowIcon from "@/shared/assets/icons/arrow-down.svg";

interface ShowNextProps {
    className?: string;
    onClick?: () => void;
}

export const ShowNext: FC<ShowNextProps> = (props) => {
    const { className, onClick } = props;
    const { t, ready } = useTranslation("offer");

    if (!ready) {
        return null;
    }

    return (
        <div className={cn(styles.wrapper, className)} onClick={onClick}>
            {t("personalOffer.Посмотреть следующие")}
            {" "}
            <img src={arrowIcon} alt="arrow-icon" />
        </div>
    );
};
