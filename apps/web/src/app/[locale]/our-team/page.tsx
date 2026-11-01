import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageBanner } from "@/components/content/PageBanner";
import { PublicShell } from "@/components/layout/PublicShell";
import { TeamCard } from "@/components/team/TeamCard";
import { TeamSection } from "@/components/team/TeamSection";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator, type Translate } from "@/i18n/dictionary";
import { mediaUrl } from "@/lib/media";
import { fullName } from "@/lib/names";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { getTeam, type TeamMember } from "@/lib/team";

// Состав команды из админки обновляется раз в 5 минут
export const revalidate = 300;

const JOIN_FORM_URL = "https://forms.yandex.ru/u/696e118d84227c5fcdfb5933/";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "our-team");
    return pageMetadata({ locale, path: routes.ourTeam(locale), title: t("seo.title"), description: t("seo.description") });
}

const cards = (members: TeamMember[], locale: Locale, t: Translate) => members.map((member) => (
    <TeamCard
        key={member.id}
        locale={locale}
        userId={member.userId}
        image={mediaUrl(member.image, "large")}
        name={fullName(member.firstName, member.lastName, t)}
        description={member.position}
        vk={member.vkontakte}
        telegram={member.telegram}
    />
));

/** «Наша команда»: основатели и команда из админки (GS-219). */
export default async function OurTeamPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tCommon, founders, team] = await Promise.all([
        getTranslator(locale, "our-team"),
        getTranslator(locale),
        getTeam(locale, true),
        getTeam(locale, false),
    ]);

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto max-w-[1920px]">
                <PageBanner title={t("Наша команда")} />
                <div className="mx-auto flex max-w-[1280px] flex-col gap-[60px] px-[50px] pt-[60px] pb-[100px] down-lg:px-5">
                    <TeamSection title={t("Основатели")}>{cards(founders, locale, tCommon)}</TeamSection>
                    <TeamSection title={t("Команда Гудсёрфинга")}>{cards(team, locale, tCommon)}</TeamSection>
                    <a
                        href={JOIN_FORM_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="mx-auto inline-block max-w-[315px] cursor-pointer down-lg:w-full rounded-[10px] bg-primary px-[30px] py-3 text-center text-label text-white no-underline transition-colors duration-300 hover:bg-primary-hover"
                    >
                        {t("Хочу в команду")}
                    </a>
                </div>
            </div>
        </PublicShell>
    );
}
