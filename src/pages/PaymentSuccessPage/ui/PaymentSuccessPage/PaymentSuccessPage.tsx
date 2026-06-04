import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";
import Preloader from "@/shared/ui/Preloader/Preloader";

import { useAuth } from "@/routes/model/guards/AuthProvider";
import {
    useGetCurrentMembershipQuery,
    useGetPaymentStatusQuery,
} from "@/store/api/membershipApi";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    getMyOffersPageUrl,
    getMembershipPageUrl,
    getOffersMapPageUrl,
} from "@/shared/config/routes/AppUrls";

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
const POLL_TIMEOUT_MS = 60_000;

const FAIL_STATUSES = new Set(["CANCELLED", "FAILED", "REFUNDED"]);

const PaymentSuccessPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { myProfile, isAuth } = useAuth();

    const paymentId = searchParams.get("payment_id");

    const [shouldPoll, setShouldPoll] = useState(Boolean(paymentId));
    const [timedOut, setTimedOut] = useState(false);

    const { data: membership, isLoading: membershipLoading } = useGetCurrentMembershipQuery(
        undefined,
        {
            skip: !isAuth,
            pollingInterval: shouldPoll && isAuth ? POLL_INTERVAL_MS : 0,
        },
    );

    const { data: payment } = useGetPaymentStatusQuery(paymentId!, {
        skip: !paymentId || !isAuth,
        pollingInterval: shouldPoll && isAuth
            ? POLL_INTERVAL_MS
            : 0,
    });

    // Таймаут поллинга — если через 60 сек не пришёл webhook
    useEffect(() => {
        if (!shouldPoll) return undefined;
        const timer = setTimeout(() => {
            setShouldPoll(false);
            setTimedOut(true);
        }, POLL_TIMEOUT_MS);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Остановить поллинг при активном членстве
    useEffect(() => {
        if (membership?.isActive) {
            setShouldPoll(false);
        }
    }, [membership?.isActive]);

    // Редирект при отменённом или проваленном платеже
    useEffect(() => {
        if (!payment) return;
        if (FAIL_STATUSES.has(payment.status)) {
            navigate(`/${locale}/payment/fail?reason=cancelled`);
        }
    }, [payment, navigate, locale]);

    useEffect(() => {
        if (!isAuth) {
            navigate(`/${locale}/signin`);
        }
    }, [isAuth, navigate, locale]);

    if (!isAuth || !myProfile) {
        return <Preloader />;
    }

    // Первичная загрузка
    if (membershipLoading && !membership) {
        return (
            <MainPageLayout>
                <div className={styles.container}>
                    <Preloader />
                </div>
            </MainPageLayout>
        );
    }

    // Ждём подтверждения от платёжного провайдера
    if (shouldPoll && !membership?.isActive) {
        return (
            <MainPageLayout>
                <div className={styles.container}>
                    <Preloader />
                </div>
            </MainPageLayout>
        );
    }

    // Webhook не пришёл за 60 секунд
    if (timedOut && !membership?.isActive) {
        return (
            <MainPageLayout>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>Платёж обрабатывается</h1>
                        <p className={styles.subtitle}>
                            Подтверждение занимает дольше обычного.
                            Проверьте статус на странице членства через несколько минут
                            или обратитесь в службу поддержки.
                        </p>
                        <div className={styles.buttonWrapper}>
                            <Button
                                color="BLUE"
                                size="LARGE"
                                variant="FILL"
                                onClick={() => navigate(getMembershipPageUrl(locale))}
                            >
                                На страницу членства
                            </Button>
                        </div>
                    </div>
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
