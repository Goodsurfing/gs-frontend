import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useCheckoutMembershipMutation } from "@/store/api/membershipApi";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./PaymentPage.module.scss";

const DEFAULT_TARIFF_CODE = "volunteer_990";

const PaymentPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuth, myProfile } = useAuth();

    const [checkoutMembership, { isLoading }] = useCheckoutMembershipMutation();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const tariffCode = searchParams.get("tariff") || DEFAULT_TARIFF_CODE;

    useEffect(() => {
        if (!isAuth || !myProfile) {
            navigate(`/${locale}/signin`);
            return;
        }

        const initializeCheckout = async () => {
            try {
                const result = await checkoutMembership({ tariffCode }).unwrap();

                if (result.paymentUrl) {
                    setPaymentUrl(result.paymentUrl);
                    window.location.href = result.paymentUrl;
                } else {
                    setErrorMessage("Не удалось получить ссылку на оплату");
                }
            } catch (err: any) {
                const detail = err?.data?.detail
                    || err?.data?.title
                    || err?.data?.error;
                setErrorMessage(detail || "Произошла ошибка при создании платежа");
            }
        };

        initializeCheckout();
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
