import { memo } from "react";
import { useTranslation } from "react-i18next";

import cn from "classnames";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import { Logotype } from "@/widgets/Loogtype";

import styles from "./Header.module.scss";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";

interface HeaderProps {
    className?: string;
}

export const Header = memo((props: HeaderProps) => {
    const { className } = props;

    const { t } = useTranslation();

    const authData = useAppSelector(getUserAuthData);

    // eslint-disable-next-line no-empty
    if (authData) {

    }

    return (
        <header className={cn(styles.wrapper, className)}>
            <Logotype />
            <ChangeLanguage />
            <nav className={styles.nav}>
                <ul className={styles.navContainer}>
                    <li className={styles.navItem}>{t("Сообщество")}</li>
                    <li className={styles.navItem}>{t("О проекте")}</li>
                </ul>
            </nav>
            <div className={styles.auth} />
        </header>
    );
});
