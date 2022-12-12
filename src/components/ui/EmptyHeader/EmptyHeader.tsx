import React, { FC } from "react";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";

import { AppRoutesEnum } from "@/routes/types";

import logoIcon from "@/assets/icons/logo-black.svg";

import styles from "./EmptyHeader.module.scss";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

const EmptyHeader: FC = () => {
    return (
        <header className={styles.header}>
            <LocaleLink to={AppRoutesEnum.HOME}>
                <img src={logoIcon} alt="Logotype" />
            </LocaleLink>
            <ChangeLanguage />
        </header>
    );
};

export default EmptyHeader;
