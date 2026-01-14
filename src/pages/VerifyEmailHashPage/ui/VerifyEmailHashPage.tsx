import React, {
    useCallback, useEffect, useState, useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "./VerifyEmailHashPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import SignLayout from "@/shared/ui/SignLayout/SignLayout";
import SignTitle from "@/shared/ui/SignTitle/SignTitle";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getProfileInfoPageUrl, getSignUpPageUrl } from "@/shared/config/routes/AppUrls";
import { API_BASE_URL_V3 } from "@/shared/constants/api";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { userActions } from "@/entities/User";
import { useAuth } from "@/routes/model/guards/AuthProvider";

const VerifyEmailHashPage = () => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const { isUserAdmin, token } = useAuth();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isError, setError] = useState<boolean>(false);
    const hasFetchedRef = useRef<boolean>(false);

    const getVerifyEmail = useCallback(async () => {
        if (hasFetchedRef.current) return;
        try {
            const response = await fetch(`${API_BASE_URL_V3}verify/email/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();

            dispatch(userActions.setAuthData({
                token: data.accessToken,
                mercureToken: data.mercureToken,
                rememberMe: true,
                username: "",
                roles: isUserAdmin ? ["ROLE_USER", "ROLE_ADMIN"] : ["ROLE_USER"],
            }));

            setError(false);
            hasFetchedRef.current = true;
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id, dispatch, isUserAdmin, token]);

    useEffect(() => {
        if (id) {
            hasFetchedRef.current = false;
            getVerifyEmail();
        }
    }, [id, getVerifyEmail]);

    if (isLoading) {
        return (
            <SignLayout disableRedirectIfIsAuth cancelText={t("login.Отменить")} cancelPath={getSignUpPageUrl(locale)}>
                <Preloader />
            </SignLayout>
        );
    }

    if (isError) {
        return (
            <SignLayout disableRedirectIfIsAuth cancelText={t("login.Отменить")} cancelPath={getSignUpPageUrl(locale)}>
                <div className={styles.content}>
                    <div className={styles.notification}>{t("login.Произошла ошибка")}</div>
                </div>
            </SignLayout>
        );
    }

    return (
        <SignLayout disableRedirectIfIsAuth cancelText={t("login.Отменить")} cancelPath={getSignUpPageUrl(locale)}>
            <div className={styles.wrapper}>
                <SignTitle>{t("login.Подтверждение почты")}</SignTitle>
                <div className={styles.content}>
                    <div className={styles.notification}>
                        {t("login.Спасибо! Ваш адрес электронной почты")}
                        {" "}
                        <span>email</span>
                        {" "}
                        {t("login.был подтверждён.")}
                    </div>
                    <ButtonLink
                        className={styles.btn}
                        path={getProfileInfoPageUrl(locale)}
                        type="outlined"
                    >
                        {t("login.Перейти в профиль")}
                    </ButtonLink>
                </div>
            </div>
        </SignLayout>
    );
};

export default VerifyEmailHashPage;
