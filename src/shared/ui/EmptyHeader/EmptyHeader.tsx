import React, { FC } from "react";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import { RoutePath } from "@/routes/config/RouterConfig";

import logoIcon from "@/shared/assets/icons/logo-black.svg";

import styles from "./EmptyHeader.module.scss";

const EmptyHeader: FC = () => (
    <header className={styles.header}>
        <LocaleLink to={RoutePath.HOME}>
            <img src={logoIcon} alt="Logotype" />
        </LocaleLink>
        <ChangeLanguage />
    </header>
);

export default EmptyHeader;
