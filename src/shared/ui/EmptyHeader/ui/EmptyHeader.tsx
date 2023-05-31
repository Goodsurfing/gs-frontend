import logoIcon from "assets/icons/logo-black.svg";
import React, { FC } from "react";

import { SwitchLanguage } from "features/SwitchLanguage";

import { LocaleLink } from "shared/ui/LocaleLink";

import styles from "./EmptyHeader.module.scss";

export const EmptyHeader: FC = () => (
    <header className={styles.header}>
        <LocaleLink to="/">
            <img src={logoIcon} alt="Logotype" />
        </LocaleLink>
        <SwitchLanguage />
    </header>
);
