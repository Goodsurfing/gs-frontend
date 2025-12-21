import React from "react";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetMembershipStatusQuery } from "@/store/api/paymentApi";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getPaymentPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./Header.module.scss";

export const Header = () => {
    const { t } = useTranslation("membership");
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { isAuth, myProfile } = useAuth();
    
    const { data: membershipStatus, isLoading } = useGetMembershipStatusQuery(undefined, {
        skip: !isAuth,
    });

    const hasMembership = membershipStatus?.hasMembership ?? false;
    const isButtonDisabled = hasMembership || !isAuth || isLoading;

    const handleButtonClick = () => {
        if (!isButtonDisabled && isAuth) {
            navigate(getPaymentPageUrl(locale));
        }
    };

    if (isLoading) {
        return (
            <section className={styles.wrapeprImage}>
                <Preloader />
            </section>
        );
    }

    return (
        <section className={styles.wrapeprImage}>
            <h1 className={styles.title}>
                <span>{t("header.Оформи членство Гудсёрфинга")}</span>
                <br />
                <span>{t("header.и открой для себя бескрайний мир")}</span>
                <br />
                <span>{t("header.путешествий со смыслом!")}</span>
            </h1>
            <ul className={styles.list}>
                <li>{t("header.Неограниченный доступ ко всем направлениям и видам путешествий")}</li>
                <li>{t("header.Прямое общение с хостом")}</li>
                <li>{t("header.Поддержка в путешествиях со стороны Гудсёрфинга")}</li>
                <li>{t("header.Доступ к образовательным материалам")}</li>
                <li>{t("header.Поддержка интересного и важного проекта")}</li>
            </ul>
            <div className={styles.buttonPrice}>
                <Button 
                    color="GREEN" 
                    size="SMALL" 
                    variant="FILL"
                    onClick={handleButtonClick}
                    disabled={isButtonDisabled}
                >
                    {hasMembership ? "Членство получено" : t("header.Получить членство")}
                </Button>
                <span className={styles.price}>1 500 руб</span>
            </div>
        </section>
    );
};
