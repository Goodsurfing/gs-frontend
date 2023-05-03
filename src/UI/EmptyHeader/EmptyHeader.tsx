import React, { FC } from "react";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { AppRoutesEnum } from "@/routes/types";

import logoIcon from "@/assets/icons/logo-black.svg";

import styles from "./EmptyHeader.module.scss";

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
