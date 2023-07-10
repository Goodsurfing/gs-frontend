import React, { FC } from "react";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import logoIcon from "@/shared/assets/icons/logo-black.svg";

import styles from "./EmptyHeader.module.scss";
import { getMainPageUrl, useLocale } from "@/routes";

const EmptyHeader: FC = () => {
    const { locale } = useLocale();
    return (
        <header className={styles.header}>
            <LocaleLink to={getMainPageUrl(locale)}>
                <img src={logoIcon} alt="Logotype" />
            </LocaleLink>
            <ChangeLanguage />
        </header>
    );
};

export default EmptyHeader;
