import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { getUserAuthData, getUserInited } from "@/entities/User";
import { useAppSelector } from "@/shared/hooks/redux";
import { useCheckoutMembershipMutation } from "@/store/api/membershipApi";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl, getSignInPageUrl } from "@/shared/config/routes/AppUrls";
import { TARIFF_CODE } from "@/shared/constants/membership";

import styles from "./PaymentPage.module.scss";

const isFetchError = (err: unknown): err is FetchBaseQueryError => (
    typeof err === "object" && err !== null && "status" in err
);

const PaymentPage: React.FC = () => {
    const { t } = useTranslation("donation");
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // Сессия — из стора, синхронно. isAuth из useAuth выставляется эффектом
    // уже после первого рендера, а профиль догружается позже: на них страница
    // при прямом заходе (ссылка из письма, быстрый клик на /membership)
    // отправляла вошедшего пользователя на форму входа.
    const hasSession = Boolean(useAppSelector(getUserAuthData));
    const sessionInited = useAppSelector(getUserInited);
    const { myProfile } = useAuth();

    const [checkoutMembership, { isLoading }] = useCheckoutMembershipMutation();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const startedRef = useRef(false);

    const tariffCode = searchParams.get("tariff") || TARIFF_CODE.VOLUNTEER;

    useEffect(() => {
        if (!sessionInited) return;
        if (!hasSession) {
            // Прокидываем next/nextId, чтобы после логина AuthByEmail
            // вернул пользователя сюда же с тем же tariffCode, а не на
            // дефолтную страницу профиля (row: "просит войти — перебрасывает
            // в личный кабинет — нужно искать страницу оплаты заново").
            navigate(`${getSignInPageUrl(locale)}?next=payment&nextId=${tariffCode}`);
            return;
        }
        // Профиль ещё грузится — ждём (если сессия протухла, withReauthOn401
        // сделает logout, и сработает ветка выше)
        if (!myProfile) return;
        if (startedRef.current) return;
        startedRef.current = true;

        checkoutMembership({ tariffCode }).unwrap()
            .then((result) => {
                if (result.paymentUrl) {
                    setPaymentUrl(result.paymentUrl);
                    // replace, а не href: страница сама создаёт платёж при открытии,
                    // и «Назад» с ЮKassa возвращал сюда же — новый платёж и снова
                    // ЮKassa. Уйти было нельзя, отменённых платежей копилось втрое
                    // больше настоящих попыток. Так «Назад» ведёт на страницу до оплаты.
                    window.location.replace(result.paymentUrl);
                } else {
                    setErrorMessage(t("Не удалось получить ссылку на оплату"));
                }
            })
            .catch((err: unknown) => {
                if (isFetchError(err) && err.status === 409) {
                    // Раньше здесь был молчаливый переход на страницу членства
                    // без сообщения — выглядело так, будто клик по оплате
                    // "просто возвращает на начало страницы" (row 95).
                    setErrorMessage(t("У вас уже есть активное членство"));
                    return;
                }

                const status = isFetchError(err) ? err.status : null;
                const data = isFetchError(err) && typeof err.data === "object" && err.data !== null
                    ? (err.data as { detail?: string; title?: string })
                    : undefined;

                // 502/503/504 или сетевой сбой — бэк отдаёт честное сообщение в detail,
                // но если пришла сырая HTML-страница (например, таймаут Traefik),
                // err.data будет строкой и мы покажем свой дружелюбный текст.
                const providerUnavailable = status === 502 || status === 503 || status === 504
                    || status === "FETCH_ERROR" || status === "TIMEOUT_ERROR";

                const fallback = providerUnavailable
                    ? t("Сервис оплаты временно недоступен Попробуйте позже")
                    : t("Произошла ошибка при создании платежа");

                setErrorMessage(data?.detail || data?.title || fallback);
            });
    }, [sessionInited, hasSession, myProfile, checkoutMembership, navigate, locale, tariffCode, t]);

    const handlePayClick = () => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        } else {
            setErrorMessage(t("Ссылка на оплату не доступна"));
        }
    };

    if (!hasSession || !myProfile) {
        return <Preloader />;
    }

    if (isLoading && !paymentUrl) {
        return (
            <MainPageLayout>
                <div className={styles.container}>
                    <Preloader />
                </div>
            </MainPageLayout>
        );
    }

    if (errorMessage) {
        return (
            <MainPageLayout>
                <div className={styles.container}>
                    <div className={styles.error}>
                        <h2>{t("Ошибка")}</h2>
                        <p>{errorMessage}</p>
                        <Button
                            color="BLUE"
                            size="MEDIUM"
                            variant="FILL"
                            onClick={() => navigate(getMembershipPageUrl(locale))}
                        >
                            {t("Вернуться на страницу членства")}
                        </Button>
                    </div>
                </div>
            </MainPageLayout>
        );
    }

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <div className={styles.content}>
                    <p className={styles.text}>
                        {t("Списание средств происходит в российских рублях")}
                    </p>
                    <p className={styles.text}>
                        {t("Банк автоматически произведет конвертацию в валюту, используемой вами карты")}
                    </p>
                    <p className={styles.text}>
                        {t("Сейчас вы будете перенаправлены на страницу оплаты")}
                        {" "}
                        {t("Если это не произошло, нажмите на ссылку ниже")}
                    </p>
                    <div className={styles.buttonWrapper}>
                        <Button
                            color="BLUE"
                            size="LARGE"
                            variant="FILL"
                            onClick={handlePayClick}
                            disabled={!paymentUrl || isLoading}
                        >
                            {t("Оплатить")}
                        </Button>
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default PaymentPage;
