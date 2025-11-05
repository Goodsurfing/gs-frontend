import React, { FC, ReactNode } from "react";

import cn from "classnames";
import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import LocaleLink from "@/components/LocaleLink/LocaleLink";

import logoIcon from "@/shared/assets/icons/logo-black.svg";
import styles from "./EmptyHeader.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface EmptyHeaderProps {
    children?: ReactNode;
    className?: string;
}

const EmptyHeader: FC<EmptyHeaderProps> = (props) => {
    const { children, className } = props;
    const { locale } = useLocale();
    return (
        <header className={cn(styles.header, className)}>
            <LocaleLink to={getMainPageUrl(locale)}>
                <img src={logoIcon} alt="Logotype" />
            </LocaleLink>
            <ChangeLanguage />
            {children}
        </header>
    );
};

export default EmptyHeader;
