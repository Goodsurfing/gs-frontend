import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useCreatePaymentMutation } from "@/store/api/paymentApi";
import { useLocale } from "@/app/providers/LocaleProvider";

import styles from "./PaymentPage.module.scss";

const PaymentPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { isAuth, myProfile } = useAuth();

    const [createPayment, { isLoading }] = useCreatePaymentMutation();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuth || !myProfile) {
            // Редирект на страницу входа, если не авторизован
            navigate(`/${locale}/signin`);
            return;
        }

        // Создаем платеж при загрузке страницы
        const initializePayment = async () => {
            try {
                const result = await createPayment({
                    amount: "1500.00",
                    currency: "RUB",
                    description: "Оплата членства в сообществе Гудсёрфинга",
                }).unwrap();

                if (result.payment_url) {
                    setPaymentUrl(result.payment_url);
                    // Автоматический редирект на страницу оплаты
                    window.location.href = result.payment_url;
                } else {
                    setErrorMessage("Не удалось получить ссылку на оплату");
                }
            } catch (err: any) {
                setErrorMessage(err?.data?.error || "Произошла ошибка при создании платежа");
            }
        };

        initializePayment();
    }, [isAuth, myProfile, createPayment, navigate, locale]);

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
                            onClick={() => navigate(`/${locale}/membership`)}
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
                        Списание средств происходит в российских рублях (1500 рублей).
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
