import logoIcon from "assets/icons/logo-black.svg";
import React, { FC } from "react";

import ChangeLanguage from "widgets/ChangeLanguage";

import { LocaleLink } from "shared/ui/LocaleLink";

import styles from "./EmptyHeader.module.scss";

const EmptyHeader: FC = () => (
    <header className={styles.header}>
        <LocaleLink to="/">
            <img src={logoIcon} alt="Logotype" />
        </LocaleLink>
        <ChangeLanguage />
    </header>
);

export default EmptyHeader;
