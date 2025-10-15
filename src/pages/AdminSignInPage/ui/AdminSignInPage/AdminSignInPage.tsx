import React, { useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmptyHeader from "@/shared/ui/EmptyHeader/EmptyHeader";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import cancelIcon from "@/shared/assets/icons/mobile-cancel.svg";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { getAdminAuthData } from "@/entities/Admin";
import { useAppSelector } from "@/shared/hooks/redux";
import styles from "./AdminSignInPage.module.scss";
import { AdminAuth } from "@/features/Admin";

const AdminSignInPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation();
    const navigate = useNavigate();
    const isAuth = useAppSelector(getAdminAuthData);

    useLayoutEffect(() => {
        if (isAuth) {
            navigate(getMainPageUrl(locale));
        }
    }, [isAuth, locale, navigate]);

    if (!ready) {
        return (
            <Preloader />
        );
    }

    return (
        <div className={styles.wrapper}>
            <EmptyHeader />
            <div className={styles.cancel}>
                <ButtonLink
                    type="outlined"
                    className={styles.btn}
                    path={getMainPageUrl(locale)}
                >
                    {t("login.Отменить")}
                </ButtonLink>
                <Link className={styles.mobileBtn} to={getMainPageUrl(locale)}>
                    <img src={cancelIcon} alt={t("login.Отменить")} />
                </Link>
            </div>
            <div className={styles.container}>
                <AdminAuth />
            </div>
        </div>
    );
};

export default AdminSignInPage;
