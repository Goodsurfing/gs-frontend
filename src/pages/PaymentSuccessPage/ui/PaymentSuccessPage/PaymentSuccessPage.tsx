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
import { TARIFF_CODE } from "@/shared/constants/membership";

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

const INTERNATIONAL_BENEFITS = [
    "Международный статус участника",
    "Доступ к закрытому международному клубу",
    "Приглашения на международные встречи",
    "Участие в международных образовательных программах",
    "Приоритетная информация о зарубежных проектах",
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

    // Останавливаем поллинг по статусу ИМЕННО ЭТОГО платежа (payment.status),
    // не по membership.isActive — тот смотрит на /membership/current, а с тех
    // пор как активных членств может быть несколько одновременно (REGULAR +
    // INTERNATIONAL), membership.isActive мог быть true с самого начала
    // (например, у юзера уже было активное host_4990, а сейчас оплачивается
    // international) — тогда поллинг завершился бы мгновенно, до того как
    // НОВЫЙ платёж реально подтвердится.
    useEffect(() => {
        if (payment?.status === "SUCCESS") {
            setShouldPoll(false);
        }
    }, [payment?.status]);

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
    if (shouldPoll && payment?.status !== "SUCCESS") {
        return (
            <MainPageLayout>
                <div className={styles.container}>
                    <Preloader />
                </div>
            </MainPageLayout>
        );
    }

    // Webhook не пришёл за 60 секунд
    if (timedOut && payment?.status !== "SUCCESS") {
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

    // Раньше "какой тариф купили" определяли по /membership/current — но с
    // тех пор как у юзера может быть больше одного активного членства
    // одновременно (REGULAR + INTERNATIONAL), "текущее активное" уже не
    // однозначно говорит, что именно только что оплатили. payment.tariffCode
    // привязан к конкретно ЭТОМУ платежу, поэтому однозначен всегда.
    const purchasedTariffCode = payment?.tariffCode ?? membership?.tariff?.code;
    const isInternational = purchasedTariffCode === TARIFF_CODE.INTERNATIONAL;
    const isHost = purchasedTariffCode === TARIFF_CODE.HOST;

    let purchaseKind: "international" | "host" | "volunteer" = "volunteer";
    if (isInternational) {
        purchaseKind = "international";
    } else if (isHost) {
        purchaseKind = "host";
    }

    // У international своя приветственная рамка ("вступили в клуб"), а не
    // общая транзакционная ("оплатили членство") — по замечанию бизнеса
    // международный клуб не должен читаться как рядовая оплата членства.
    const PURCHASE_KIND_CONFIG = {
        international: {
            title: "Добро пожаловать,",
            subtitle: "вы вступили в Международный клуб GoodSurfing",
            benefits: INTERNATIONAL_BENEFITS,
            ctaText: "На страницу членства",
            ctaUrl: getMembershipPageUrl(locale),
            callToAction: "Впереди — закрытые встречи и международные программы для участников клуба.",
        },
        host: {
            title: "Спасибо,",
            subtitle: "вы успешно оплатили членство в сообществе Гудсёрфинга",
            benefits: HOST_BENEFITS,
            ctaText: "Перейти к объявлениям",
            ctaUrl: getMyOffersPageUrl(locale),
            callToAction: "Самое время опубликовать объявление и принять волонтёров.",
        },
        volunteer: {
            title: "Спасибо,",
            subtitle: "вы успешно оплатили членство в сообществе Гудсёрфинга",
            benefits: VOLUNTEER_BENEFITS,
            ctaText: "Искать путешествия",
            ctaUrl: getOffersMapPageUrl(locale),
            callToAction: "Самое время подобрать для себя идеальное путешествие со смыслом в этом году.",
        },
    } as const;

    const {
        title, subtitle, benefits, ctaText, ctaUrl, callToAction,
    } = PURCHASE_KIND_CONFIG[purchaseKind];

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>
                        {title}
                        {" "}
                        <span className={styles.username}>{userName}</span>
                        {isInternational ? "!" : ","}
                    </h1>
                    <p className={styles.subtitle}>
                        {subtitle}
                    </p>

                    <div className={styles.info}>
                        {isInternational ? (
                            <p>
                                Международное членство — это отдельный статус, не связанный
                                {" "}
                                с обычными правами на платформе goodsurfing.org.
                            </p>
                        ) : (
                            <>
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
                            </>
                        )}
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
