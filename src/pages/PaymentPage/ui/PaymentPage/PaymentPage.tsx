import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useCheckoutMembershipMutation } from "@/store/api/membershipApi";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { TARIFF_CODE } from "@/shared/constants/membership";

import styles from "./PaymentPage.module.scss";

const isFetchError = (err: unknown): err is FetchBaseQueryError => (
    typeof err === "object" && err !== null && "status" in err
);

const PaymentPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuth, myProfile } = useAuth();

    const [checkoutMembership, { isLoading }] = useCheckoutMembershipMutation();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const startedRef = useRef(false);

    const tariffCode = searchParams.get("tariff") || TARIFF_CODE.VOLUNTEER;

    useEffect(() => {
        if (!isAuth || !myProfile) {
            navigate(`/${locale}/signin`);
            return;
        }
        if (startedRef.current) return;
        startedRef.current = true;

        checkoutMembership({ tariffCode }).unwrap()
            .then((result) => {
                if (result.paymentUrl) {
                    setPaymentUrl(result.paymentUrl);
                    window.location.href = result.paymentUrl;
                } else {
                    setErrorMessage("Не удалось получить ссылку на оплату");
                }
            })
            .catch((err: unknown) => {
                if (isFetchError(err) && err.status === 409) {
                    navigate(getMembershipPageUrl(locale));
                    return;
                }
                const data = isFetchError(err)
                    ? (err.data as { detail?: string; title?: string } | undefined)
                    : undefined;
                setErrorMessage(
                    data?.detail
                    || data?.title
                    || "Произошла ошибка при создании платежа",
                );
            });
    }, [isAuth, myProfile, checkoutMembership, navigate, locale, tariffCode]);

    const handlePayClick = () => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        } else {
            setErrorMessage("Ссылка на оплату не доступна");
        }
    };

    if (!isAuth || !myProfile) {
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
                        <h2>Ошибка</h2>
                        <p>{errorMessage}</p>
                        <Button
                            color="BLUE"
                            size="MEDIUM"
                            variant="FILL"
                            onClick={() => navigate(getMembershipPageUrl(locale))}
                        >
                            Вернуться на страницу членства
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
                        Списание средств происходит в российских рублях.
                    </p>
                    <p className={styles.text}>
                        Банк автоматически произведет конвертацию в валюту, используемой вами карты.
                    </p>
                    <p className={styles.text}>
                        Сейчас вы будете перенаправлены на страницу оплаты.
                        {" "}
                        Если это не произошло, нажмите на ссылку ниже.
                    </p>
                    <div className={styles.buttonWrapper}>
                        <Button
                            color="BLUE"
                            size="LARGE"
                            variant="FILL"
                            onClick={handlePayClick}
                            disabled={!paymentUrl || isLoading}
                        >
                            Оплатить
                        </Button>
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default PaymentPage;
