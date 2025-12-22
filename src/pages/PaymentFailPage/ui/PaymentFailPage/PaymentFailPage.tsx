import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./PaymentFailPage.module.scss";

const PaymentFailPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuth, myProfile } = useAuth();

    const reason = searchParams.get("reason");

    useEffect(() => {
        if (!isAuth) {
            navigate(`/${locale}/signin`);
        }
    }, [isAuth, navigate, locale]);

    if (!isAuth || !myProfile) {
        return <Preloader />;
    }

    const getErrorMessage = () => {
        if (reason === "not_found") {
            return "Платеж не найден";
        }
        if (reason === "cancelled") {
            return "Оплата была отменена";
        }
        return "Произошла ошибка при обработке платежа";
    };

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h1 className={styles.title}>Ошибка оплаты</h1>
                    <p className={styles.message}>
                        {getErrorMessage()}
                    </p>
                    <p className={styles.description}>
                        Пожалуйста, попробуйте еще раз или обратитесь в службу поддержки,
                        {" "}
                        если проблема сохраняется.
                    </p>
                    <div className={styles.buttonWrapper}>
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
            </div>
        </MainPageLayout>
    );
};

export default PaymentFailPage;
