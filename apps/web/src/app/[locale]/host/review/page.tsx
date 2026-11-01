import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostReviews } from "@/components/cabinet/host/HostReviews";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostReview(locale), "main.sidebar.Отзывы") : {};
}

/** Кабинет организатора: отзывы (HostReviewPage старого фронта) */
export default async function HostReviewPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, tv, to] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), getTranslator(locale, "volunteer"), getTranslator(locale, "offer")]);
    const r = (key: string) => th(`hostReviews.${key}`);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main className="h-full">
                <HostReviews
                    volunteerHref={routes.volunteerPublicTemplate(locale)}
                    offerHref={routes.offer(locale, "{id}")}
                    labels={{
                        title: r("Отзывы"),
                        yourRating: r("Ваш рейтинг"),
                        aboutVolunteers: r("Отзывы про волонтёров"),
                        recentlyAccepted: r("Волонтёры, которых вы недавно принимали"),
                        aboutOffers: r("Отзывы о проектах"),
                        addReview: tv("volunteer-review.Добавить отзыв"),
                        // В старом «Без адреса» и «Без заголовка» были зашиты по-русски; ключей в словарях нет
                        noAddress: "Без адреса",
                        noTitle: "Без заголовка",
                        anonymous: t("Анонимный пользователь"),
                        showNext: to("personalOffer.Посмотреть следующие"),
                        up: t("slider.previous"),
                        down: t("slider.next"),
                        rating: r("Ваш рейтинг"),
                        gallery: { close: t("Закрыть"), prev: t("slider.previous"), next: t("slider.next"), photo: t("gallery.photo") },
                        dialog: {
                            title: r("Оставьте отзыв"),
                            write: th("host-dashboard.Напишите ваш отзыв"),
                            needRating: th("host-dashboard.Поставьте оценку, чтобы оставить отзыв"),
                            send: th("host-dashboard.Оставить отзыв"),
                            sent: r("Ваш отзыв был отправлен"),
                            error: th("hostDescription.Произошла ошибка"),
                            close: t("Закрыть"),
                            rating: r("Оставьте отзыв"),
                            anonymous: t("Анонимный пользователь"),
                            statuses: { new: t("notes.new"), accepted: t("notes.accepted"), canceled: t("notes.canceled") },
                            photo: {
                                add: t("Добавить фото"),
                                drop: t("Отпусти файлы здесь"),
                                remove: t("Удалить"),
                                photo: t("gallery.photo"),
                                tooMany: t("Нельзя загрузить больше 10 файлов"),
                                tooBig: t("Файл больше 5MB"),
                            },
                        },
                    }}
                />
            </main>
        </CabinetShell>
    );
}
