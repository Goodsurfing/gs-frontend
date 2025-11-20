import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmptyHeader from "@/shared/ui/EmptyHeader/EmptyHeader";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import cancelIcon from "@/shared/assets/icons/mobile-cancel.svg";
import { getAdminUsersPageUrl, getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import Preloader from "@/shared/ui/Preloader/Preloader";
import styles from "./AdminSignInPage.module.scss";
import { AdminAuth } from "@/features/Admin";
import { useAuth } from "@/routes/model/guards/AuthProvider";

const AdminSignInPage = () => {
    const { locale } = useLocale();
    const { t, ready } = useTranslation();
    const navigate = useNavigate();
    const { isAuth, isUserAdmin } = useAuth();

    useEffect(() => {
        if (isAuth && isUserAdmin) {
            navigate(getAdminUsersPageUrl(locale), { replace: true });
        }
    }, [isAuth, isUserAdmin, locale, navigate]);

    if (!ready) {
        return (
            <Preloader />
        );
    }

    if (isAuth && isUserAdmin) {
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
