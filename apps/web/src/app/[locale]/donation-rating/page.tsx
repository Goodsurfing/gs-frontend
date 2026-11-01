import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DonationHeader } from "@/components/donation/DonationHeader";
import { DonationRating, type RatingRow } from "@/components/donation/DonationRating";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "donation");
    return {
        ...pageMetadata({ locale, path: routes.donationRating(locale), title: t("ratingSeo.title"), description: t("ratingSeo.description") }),
        keywords: t("ratingSeo.keywords"),
    };
}

/** Сто первых жертвователей, как в старом фронте */
async function getRating(locale: Locale): Promise<RatingRow[]> {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/donation/rating", {
            params: { query: { limit: 100 } },
            signal: AbortSignal.timeout(5000),
        });
        return (data ?? []).map((item) => ({ id: item.userId, name: item.userName ?? "", count: item.donationCount, total: item.totalAmount }));
    } catch {
        return [];
    }
}

/** «Рейтинг жертвователей» (DonationRatingPage старого фронта, GS-219) */
export default async function DonationRatingPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, rows] = await Promise.all([getTranslator(locale, "donation"), getRating(locale)]);

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto max-w-[1920px]">
                <DonationHeader title={t("Рейтинг жертвователей")} />
                <div className="mx-auto flex max-w-[1280px] flex-col gap-[60px] px-[150px] pt-[60px] pb-[100px] down-lg:px-5">
                    <DonationRating
                        rows={rows}
                        volunteerHref={routes.volunteerPublicTemplate(locale)}
                        labels={{
                            sortLabel: t("Сортировка"),
                            byCount: t("По кол-ву пожертвований"),
                            byTotal: t("По общей сумме пожертвований"),
                            desc: t("По убыванию"),
                            asc: t("По возрастанию"),
                            search: t("Поиск участника"),
                            name: t("ФИО"),
                            count: t("Количество пожертвований, руб"),
                            total: t("Общая сумма пожертвований, руб"),
                            empty: t("Никого не найдено"),
                        }}
                    />
                </div>
            </div>
        </PublicShell>
    );
}
