import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerDashboard } from "@/components/cabinet/volunteer/VolunteerDashboard";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { categoryLabels } from "@/lib/categories";
import { reviewReminderLabels } from "@/lib/reviewReminderLabels";
import { routes } from "@/lib/routes";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerDashboard(locale), "main.sidebar.Панель управления") : {};
}

/** Кабинет волонтёра: «Панель управления» (VolunteerDashboardPage старого фронта) */
export default async function VolunteerDashboardPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer")]);
    const d = (key: string) => tv(`volunteer-dashboard.${key}`);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full">
                <VolunteerDashboard
                    locale={locale}
                    hrefs={{
                        volunteer: routes.volunteerPublicTemplate(locale),
                        skills: routes.volunteerSkills(locale),
                        preferences: routes.profilePreferences(locale),
                        membership: routes.membership(locale),
                        offer: routes.offerTemplate(locale),
                        review: routes.volunteerReview(locale),
                    }}
                    categories={categoryLabels(t)}
                    labels={{
                        reviewReminders: reviewReminderLabels(t, "volunteer"),
                        fill: d("Заполненность профиля"),
                        viewProfile: d("Посмотреть свой профиль"),
                        edit: d("Редактировать профиль"),
                        points: {
                            about: t("stats-points.О себе"),
                            skills: t("stats-points.Навыки"),
                            photo: t("stats-points.Фотографии"),
                            video: t("stats-points.Видео"),
                            blog: t("stats-points.Публикации в блоге"),
                            membership: t("stats-points.Членство"),
                        },
                        quota: {
                            unlimited: t("freeApplicationsCounter.Без ограничений"),
                            left: t("freeApplicationsCounter.Откликов осталось"),
                            renew: t("freeApplicationsCounter.Не забудьте продлить членство, чтобы сохранить привилегии"),
                            more: t("freeApplicationsCounter.Нужно больше? Оформите членство!"),
                        },
                        offers: d("Вакансии, которые вам понравятся"),
                        settings: d("Настроить"),
                        banner: d("Оформи членство Гудсёрфинга и открой для себя бескрайний мир путешествий со смыслом!"),
                        bannerButton: d("Получить членство"),
                        notifications: d("Уведомления"),
                        welcome: tv("Добро пожаловать!"),
                        welcomeText: tv("Рады приветствовать вас на нашем сайте Для вашего удобства предлагаем максимально подробно заполнить свой профиль"),
                        favorite: { add: t("Добавить в избранное"), remove: t("Убрать из избранного") },
                        card: {
                            more: t("Подробнее"),
                            notOnMap: t("нет на карте"),
                            reviews: t("Отзывов"),
                            went: t("Отправились"),
                            noTitle: t("Без заголовка"),
                            noDescription: t("Без описания"),
                        },
                    }}
                />
            </main>
        </CabinetShell>
    );
}
