import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicShell } from "@/components/layout/PublicShell";
import { PaymentSuccessView } from "@/components/membership/PaymentSuccessView";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Тексты преимуществ — ключи словаря donation, как в старом фронте
const BENEFITS = {
    volunteer: ["Неограниченный доступ ко всем направлениям и видам путешествий", "Прямое общение с хостом", "Поддержка в путешествиях со стороны Гудсёрфинга", "Доступ к образовательным материалам", "Поддержка интересного и важного проекта"],
    host: ["Неограниченная публикация объявлений на платформе", "Доступ к уникальным чатам платформы", "Метка «Партнёр Гудсёрфинга» в профиле", "Доступ к Академии и офлайн-мероприятиям", "Скидки на платные размещения"],
    international: ["Международный статус участника", "Доступ к закрытому международному клубу", "Приглашения на международные встречи", "Участие в международных образовательных программах", "Приоритетная информация о зарубежных проектах"],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "donation");
    return pageMetadata({ locale, path: routes.paymentSuccess(locale), title: t("вы успешно оплатили членство в сообществе Гудсёрфинга"), description: t("Теперь для вас доступно"), noindex: true });
}

/** Возврат с ЮKassa после оплаты членства, ?payment_id= (PaymentSuccessPage старого фронта, GS-219) */
export default async function PaymentSuccessPage({ params, searchParams }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const { payment_id: paymentId } = await searchParams;
    const t = await getTranslator(locale, "donation");
    const thanks = { title: t("Спасибо,"), subtitle: t("вы успешно оплатили членство в сообществе Гудсёрфинга") };
    return (
        <PublicShell locale={locale} topGap>
            <PaymentSuccessView
                paymentId={typeof paymentId === "string" ? paymentId : null}
                signInHref={routes.signIn(locale)}
                failHref={`${routes.paymentFail(locale)}?reason=cancelled`}
                membershipHref={routes.membership(locale)}
                labels={{
                    kinds: {
                        volunteer: { ...thanks, benefits: BENEFITS.volunteer.map((key) => t(key)), cta: t("Искать путешествия"), ctaHref: routes.offersMap(locale), callToAction: t("Самое время подобрать для себя идеальное путешествие со смыслом в этом году") },
                        host: { ...thanks, benefits: BENEFITS.host.map((key) => t(key)), cta: t("Перейти к объявлениям"), ctaHref: routes.myOffers(locale), callToAction: t("Самое время опубликовать объявление и принять волонтёров") },
                        international: {
                            title: t("Добро пожаловать,"),
                            subtitle: t("вы вступили в Международный клуб GoodSurfing"),
                            benefits: BENEFITS.international.map((key) => t(key)),
                            cta: t("На страницу членства"),
                            ctaHref: routes.membership(locale),
                            callToAction: t("Впереди — закрытые встречи и международные программы для участников клуба"),
                        },
                    },
                    user: t("пользователь"),
                    available: t("Теперь для вас доступно"),
                    international: t("Международное членство — это отдельный статус, не связанный с обычными правами на платформе goodsurfing org"),
                    allFeatures: t("Теперь вы можете пользоваться всеми возможностями портала goodsurfing org"),
                    verifiedMark: t("Уже сейчас на вашем аккаунте появилась специальная метка верифицированного пользователя"),
                    processing: t("Платёж обрабатывается"),
                    processingText: t("Подтверждение занимает дольше обычного Проверьте статус на странице членства через несколько минут или обратитесь в службу поддержки"),
                    toMembership: t("На страницу членства"),
                }}
            />
        </PublicShell>
    );
}
