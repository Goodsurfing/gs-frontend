import React, { FC } from "react";
import { Link } from "react-router-dom";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";

import { AppRoutesEnum } from "@/routes/types";

import logoIcon from "@/assets/icons/logo-black.svg";

import styles from "./EmptyHeader.module.scss";

const EmptyHeader: FC = () => {
    return (
        <header className={styles.header}>
            <Link to={AppRoutesEnum.HOME}>
                <img src={logoIcon} alt="Logotype" />
            </Link>
            <ChangeLanguage />
        </header>
    );
};

export default EmptyHeader;
