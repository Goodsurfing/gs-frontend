import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetMembershipStatusQuery } from "@/store/api/paymentApi";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getOffersMapPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./PaymentSuccessPage.module.scss";

const PaymentSuccessPage: React.FC = () => {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { myProfile, isAuth } = useAuth();
    
    const paymentId = searchParams.get("payment_id");
    
    // Обновляем статус членства после успешной оплаты
    const { data: membershipStatus, isLoading, refetch } = useGetMembershipStatusQuery(undefined, {
        skip: !isAuth,
    });

    useEffect(() => {
        // Обновляем статус членства при загрузке страницы успеха
        if (isAuth && paymentId) {
            refetch();
        }
    }, [isAuth, paymentId, refetch]);

    useEffect(() => {
        if (!isAuth) {
            navigate(`/${locale}/signin`);
        }
    }, [isAuth, navigate, locale]);

    if (!isAuth || !myProfile) {
        return <Preloader />;
    }

    if (isLoading) {
        return (
            <MainPageLayout>
                <div className={styles.container}>
                    <Preloader />
                </div>
            </MainPageLayout>
        );
    }

    const userName = myProfile.firstName || myProfile.email || "пользователь";

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Спасибо, <span className={styles.username}>{userName}</span>,
                    </h1>
                    <p className={styles.subtitle}>
                        вы успешно оплатили членство в сообществе Гудсёрфинга
                    </p>
                    
                    <div className={styles.info}>
                        <p>
                            Теперь вы можете пользоваться всеми возможностями портала goodsurfing.org.
                        </p>
                        <p>
                            Уже сейчас на вашем аккаунте появилась специальная метка верифицированного пользователя.
                        </p>
                    </div>

                    <div className={styles.benefits}>
                        <h2 className={styles.benefitsTitle}>Теперь для вас доступно:</h2>
                        <ul className={styles.benefitsList}>
                            <li>Неограниченный доступ ко всем направлениям и видам путешествий</li>
                            <li>Прямое общение с хостом</li>
                            <li>Поддержка в путешествиях со стороны Гудсёрфинга</li>
                            <li>Доступ к образовательным материалам</li>
                            <li>Поддержка интересного и важного проекта</li>
                        </ul>
                    </div>

                    <p className={styles.callToAction}>
                        Самое время подобрать для себя идеальное путешествие со смыслом в этом году.
                    </p>

                    <div className={styles.buttonWrapper}>
                        <Button
                            color="BLUE"
                            size="LARGE"
                            variant="FILL"
                            onClick={() => navigate(getOffersMapPageUrl(locale))}
                        >
                            Искать путешествия
                        </Button>
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default PaymentSuccessPage;
