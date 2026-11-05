import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageBanner } from "@/components/content/PageBanner";
import { PublicShell } from "@/components/layout/PublicShell";
import { isLocale } from "@/i18n/config";
import { getTranslator, type Translate } from "@/i18n/dictionary";
import { type Badge, getAchievementCatalog } from "@/lib/achievements";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Число получивших меняется раз в час (выдача — по расписанию)
export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "achievements");
    return pageMetadata({ locale, path: routes.achievements(locale), title: t("seo.title"), description: t("seo.description") });
}

/** «Все достижения»: какие бывают значки, за что и сколько человек их получили. */
export default async function AchievementsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, catalog] = await Promise.all([getTranslator(locale, "achievements"), getAchievementCatalog(locale)]);
    const volunteers = (catalog ?? []).filter((badge) => badge.audience !== "organization");
    const organizations = (catalog ?? []).filter((badge) => badge.audience === "organization");

    return (
        <PublicShell locale={locale}>
            <PageBanner title={t("title")} />
            <div className="mx-auto flex max-w-[1080px] flex-col gap-12 px-5 pt-10 pb-20">
                <p className="max-w-[760px] text-[17px] leading-[150%] text-ink-secondary">{t("intro")}</p>
                {catalog === null ? (
                    <p role="alert" className="rounded-[10px] bg-field p-5 text-ink-secondary">{t("error")}</p>
                ) : (
                    <>
                        <section aria-labelledby="for-volunteers" className="flex flex-col gap-8">
                            <h2 id="for-volunteers" className="text-[26px] font-bold">{t("volunteers")}</h2>
                            <BadgeGroup title={t("auto")} badges={volunteers.filter((badge) => badge.auto)} t={t} />
                            <BadgeGroup title={t("team")} badges={volunteers.filter((badge) => !badge.auto)} t={t} />
                        </section>
                        {organizations.length > 0 && (
                            <section aria-labelledby="for-organizations" className="flex flex-col gap-4">
                                <h2 id="for-organizations" className="text-[26px] font-bold">{t("organizations")}</h2>
                                <p className="text-ink-secondary">{t("organizationsHint")}</p>
                                <BadgeGroup badges={organizations} t={t} />
                            </section>
                        )}
                    </>
                )}
            </div>
        </PublicShell>
    );
}

function BadgeGroup({ title, badges, t }: { title?: string; badges: Badge[]; t: Translate }) {
    if (badges.length === 0) return null;
    return (
        <div className="flex flex-col gap-4">
            {title && <h3 className="text-[18px] font-semibold text-caption">{title}</h3>}
            <ul className="grid grid-cols-3 gap-5 down-md:grid-cols-2 down-sm:grid-cols-1">
                {badges.map((badge) => (
                    <li key={badge.id} className="flex gap-4 rounded-[12px] bg-field p-5">
                        {/* eslint-disable-next-line @next/next/no-img-element -- значок из справочника, место зарезервировано */}
                        <img src={badge.image} alt="" width={56} height={56} loading="lazy" className="h-14 w-14 shrink-0" />
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="text-[17px] font-semibold text-ink-secondary">{badge.name}</span>
                            {badge.description && <span className="text-[14px] leading-[140%] text-ink-secondary">{badge.description}</span>}
                            <span className="mt-1 text-[13px] text-caption">
                                {badge.holders ? t("holders", { count: badge.holders.toLocaleString("ru-RU") }) : t("none")}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
