import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerReviews } from "@/components/cabinet/volunteer/VolunteerReviews";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { galleryLabels, uploaderLabels } from "@/lib/cabinetLabels";
import { categoryLabels } from "@/lib/categories";
import { routes } from "@/lib/routes";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerReview(locale), "main.sidebar.Отзывы") : {};
}

/** Кабинет волонтёра: «Отзывы» (VolunteerReviewPage старого фронта) */
export default async function VolunteerReviewPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv, th] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer"), getTranslator(locale, "host")]);
    const r = (key: string) => tv(`volunteer-review.${key}`);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            {/* flex: обёртка растягивается и получает определённую высоту — от неё считается height: 100% колонок, как в старом PageLayout */}
            <main className="flex w-full">
                <VolunteerReviews
                    hrefs={{ offer: routes.offerTemplate(locale), volunteer: routes.volunteerPublicTemplate(locale) }}
                    categories={categoryLabels(t)}
                    labels={{
                        title: r("Отзывы"),
                        yourRating: r("Ваш рейтинг"),
                        aboutOffers: r("Отзывы о проектах"),
                        recent: r("Проекты, которые вы недавно посещали"),
                        aboutYou: r("Отзывы о вас"),
                        add: r("Добавить отзыв"),
                        anonymousOrganization: t("Анонимная организация"),
                        anonymousUser: t("Анонимный пользователь"),
                        noTitle: "Без заголовка",
                        noAddress: "Без адреса",
                        sendError: th("host-dashboard.Ошибка"),
                        statuses: { new: t("notes.new"), accepted: t("notes.accepted"), canceled: t("notes.canceled") },
                        slider: { prev: t("slider.previous"), next: t("slider.next") },
                        gallery: galleryLabels(t),
                        photos: uploaderLabels(t),
                        dialog: {
                            // Заголовок и сообщение об успехе в старом фронте не переводились
                            title: "Оставьте отзыв",
                            rating: th("host-dashboard.Оставьте отзыв"),
                            text: th("host-dashboard.Напишите ваш отзыв"),
                            hint: th("host-dashboard.Поставьте оценку, чтобы оставить отзыв"),
                            send: th("host-dashboard.Оставить отзыв"),
                            sent: "Ваш отзыв был отправлен",
                            close: t("Закрыть"),
                        },
                    }}
                />
            </main>
        </CabinetShell>
    );
}
