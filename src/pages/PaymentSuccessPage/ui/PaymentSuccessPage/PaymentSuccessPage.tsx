import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetCurrentMembershipQuery } from "@/store/api/membershipApi";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getMyOffersPageUrl, getOffersMapPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./PaymentSuccessPage.module.scss";

const VOLUNTEER_BENEFITS = [
    "Неограниченный доступ ко всем направлениям и видам путешествий",
    "Прямое общение с хостом",
    "Поддержка в путешествиях со стороны Гудсёрфинга",
    "Доступ к образовательным материалам",
    "Поддержка интересного и важного проекта",
];

const HOST_BENEFITS = [
    "Неограниченная публикация объявлений на платформе",
    "Доступ к уникальным чатам платформы",
    "Метка «Партнёр Гудсёрфинга» в профиле",
    "Доступ к Академии и офлайн-мероприятиям",
    "Скидки на платные размещения",
];

const POLL_INTERVAL_MS = 3000;

const PaymentSuccessPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { myProfile, isAuth } = useAuth();

    const paymentId = searchParams.get("payment_id");

    const [shouldPoll, setShouldPoll] = useState<boolean>(Boolean(paymentId));

    const { data: membership, isLoading } = useGetCurrentMembershipQuery(undefined, {
        skip: !isAuth,
        pollingInterval: shouldPoll && isAuth ? POLL_INTERVAL_MS : 0,
    });

    useEffect(() => {
        if (membership?.isActive) {
            setShouldPoll(false);
        }
    }, [membership?.isActive]);

    useEffect(() => {
        if (!isAuth) {
            navigate(`/${locale}/signin`);
        }
    }, [isAuth, navigate, locale]);

    if (!isAuth || !myProfile) {
        return <Preloader />;
    }

    if (isLoading && !membership) {
        return (
            <MainPageLayout>
                <div className={styles.container}>
                    <Preloader />
                </div>
            </MainPageLayout>
        );
    }

    const userName = myProfile.firstName || myProfile.email || "пользователь";
    const isHost = membership?.tariff?.forRole === "HOST";
    const benefits = isHost ? HOST_BENEFITS : VOLUNTEER_BENEFITS;
    const ctaText = isHost ? "Перейти к объявлениям" : "Искать путешествия";
    const ctaUrl = isHost ? getMyOffersPageUrl(locale) : getOffersMapPageUrl(locale);
    const callToAction = isHost
        ? "Самое время опубликовать объявление и принять волонтёров."
        : "Самое время подобрать для себя идеальное путешествие со смыслом в этом году.";

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        Спасибо,
                        {" "}
                        <span className={styles.username}>{userName}</span>
                        ,
                    </h1>
                    <p className={styles.subtitle}>
                        вы успешно оплатили членство в сообществе Гудсёрфинга
                    </p>

                    <div className={styles.info}>
                        <p>
                            Теперь вы можете пользоваться всеми возможностями портала
                            {" "}
                            goodsurfing.org.
                        </p>
                        <p>
                            Уже сейчас на вашем аккаунте появилась специальная метка
                            {" "}
                            верифицированного пользователя.
                        </p>
                    </div>

                    <div className={styles.benefits}>
                        <h2 className={styles.benefitsTitle}>Теперь для вас доступно:</h2>
                        <ul className={styles.benefitsList}>
                            {benefits.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <p className={styles.callToAction}>{callToAction}</p>

                    <div className={styles.buttonWrapper}>
                        <Button
                            color="BLUE"
                            size="LARGE"
                            variant="FILL"
                            onClick={() => navigate(ctaUrl)}
                        >
                            {ctaText}
                        </Button>
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default PaymentSuccessPage;
