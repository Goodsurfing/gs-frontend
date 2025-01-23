import React, { FC } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.scss";

type NameMain = "Новости" | "Блог" | "Журнал" | "Видео";

interface NavigationProps {
    nameMain: NameMain;
    mainLink: string;
    nameArticle: string;
    className?: string
}

export const Navigation: FC<NavigationProps> = (props) => {
    const {
        className, mainLink, nameArticle, nameMain,
    } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <span className={styles.navigation}>
                <Link to={mainLink}>{nameMain}</Link>
                {" "}
                /
                {" "}
                {nameArticle}
            </span>
        </div>
    );
};
