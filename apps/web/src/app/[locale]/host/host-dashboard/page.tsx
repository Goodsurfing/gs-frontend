import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostDashboard } from "@/components/cabinet/host/HostDashboard";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { applicationLabels } from "@/lib/hostApplications";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostDashboard(locale), "main.sidebar.Рабочий стол") : {};
}

/** Кабинет организатора: рабочий стол (HostDashboardPage старого фронта) */
export default async function HostDashboardPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, tv, common] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), getTranslator(locale, "volunteer"), applicationLabels(locale)]);
    const d = (key: string) => th(`host-dashboard.${key}`);
    const q = (key: string) => t(`publishedVacanciesCounter.${key}`);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main>
                <HostDashboard
                    locale={locale}
                    routes={{
                        info: routes.hostInfo(locale),
                        notes: routes.hostNotes(locale),
                        membership: routes.membership(locale),
                        volunteer: routes.volunteerPublicTemplate(locale),
                        offer: routes.offer(locale, "{id}"),
                        chat: routes.messengerChat(locale, "{id}"),
                    }}
                    labels={{
                        fillTitle: d("Заполненность профиля"),
                        // В старом в en/es подписи были пустыми (перевод искался по русской строке) — берём ключи напрямую
                        points: {
                            description: t("stats-points.Описание"),
                            vacancies: t("stats-points.Предложения"),
                            photo: t("stats-points.Фотографии"),
                            video: t("stats-points.Видео"),
                            reviews: t("stats-points.Отзывы"),
                        },
                        editProfile: d("Редактировать профиль"),
                        quota: { left: q("Вакансий осталось"), leftHint: q("Нужно больше? Оформите членство!"), unlimited: q("Без ограничений"), unlimitedHint: q("Не забудьте продлить членство, чтобы сохранить привилегии") },
                        requests: d("Заявки"),
                        newRequests: d("Новых заявок"),
                        loading: d("Загрузка..."),
                        empty: d("На данный момент заявки отсутсвуют"),
                        showAll: d("Посмотреть все"),
                        statusError: common.statusError,
                        memberTitle: d("Зарегистрируй членство организатора и получи больше возможностей для своего проекта!"),
                        memberButton: d("Получить членство"),
                        notifications: tv("volunteer-dashboard.Уведомления"),
                        welcome: tv("Добро пожаловать!"),
                        welcomeText: tv("Рады приветствовать вас на нашем сайте Для вашего удобства предлагаем максимально подробно заполнить свой профиль"),
                        reviewTitle: d("Оставьте отзыв"),
                        card: common.card,
                        dialog: common.dialog,
                    }}
                />
            </main>
        </CabinetShell>
    );
}
