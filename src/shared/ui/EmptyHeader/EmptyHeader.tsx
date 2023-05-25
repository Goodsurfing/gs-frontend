import React, { FC } from "react";

import ChangeLanguage from "widgets/ChangeLanguage/ChangeLanguage";
import LocaleLink from "shared/ui/LocaleLink/LocaleLink";

import { AppRoutesEnum } from "routes/types";

import logoIcon from "assets/icons/logo-black.svg";

import styles from "./EmptyHeader.module.scss";

const EmptyHeader: FC = () => (
    <header className={styles.header}>
        <LocaleLink to={AppRoutesEnum.HOME}>
            <img src={logoIcon} alt="Logotype" />
        </LocaleLink>
        <ChangeLanguage />
    </header>
);

export default EmptyHeader;
