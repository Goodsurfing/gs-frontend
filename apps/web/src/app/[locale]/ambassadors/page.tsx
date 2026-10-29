import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageBanner } from "@/components/content/PageBanner";
import { PublicShell } from "@/components/layout/PublicShell";
import { TeamCard } from "@/components/team/TeamCard";
import { TeamSection } from "@/components/team/TeamSection";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { mediaUrl } from "@/lib/media";
import { fullAddress, fullName } from "@/lib/names";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { getAmbassadors } from "@/lib/team";

// Список из админки обновляется раз в 5 минут
export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "ambassadors");
    return pageMetadata({ locale, path: routes.ambassadors(locale), title: t("seo.title"), description: t("seo.description") });
}

/** «Амбассадоры ГудСёрфинга» (GS-219). */
export default async function AmbassadorsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tCommon, ambassadors] = await Promise.all([
        getTranslator(locale, "ambassadors"),
        getTranslator(locale),
        getAmbassadors(locale),
    ]);

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto max-w-[1920px]">
                <PageBanner title={t("Амбассадоры ГудСёрфинга")} gradient="ambassadors" />
                <div className="mx-auto flex max-w-[1280px] flex-col gap-[60px] px-[50px] pt-[60px] pb-[100px] down-lg:px-5">
                    <div className="flex flex-col justify-center gap-6 text-center">
                        <h2 className="text-[1.5rem] font-bold">{t("Эксперты в путешествиях со смыслом")}</h2>
                        <p>
                            {t("Амбассадоры Гудсёрфинга - люди, которые")}
                            <br />
                            {t("Если вы также готовы нести идеи Гудсёрфинга людям — вам предоставляется отличная возможность вступить в ряды Амбассадоров!")}
                        </p>
                    </div>
                    <TeamSection title={t("Наши Амбассадоры")}>
                        {ambassadors.map((person) => (
                            <TeamCard
                                key={person.id}
                                locale={locale}
                                image={mediaUrl(person.image, "medium")}
                                name={fullName(person.firstName, person.lastName, tCommon)}
                                description={person.description}
                                address={fullAddress(person.city, person.country)}
                            />
                        ))}
                    </TeamSection>
                </div>
            </div>
        </PublicShell>
    );
}
