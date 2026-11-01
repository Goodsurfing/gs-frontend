import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageBanner } from "@/components/content/PageBanner";
import { PublicShell } from "@/components/layout/PublicShell";
import { ReportGroup } from "@/components/npo/ReportGroup";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { ACTIVITY_REPORTS, CHARTER_DOCUMENTS, MINISTRY_REPORTS } from "@/content/npo";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { mediaUrl } from "@/lib/media";
import { getDonationReports } from "@/lib/reports";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Отчёты из админки обновляются раз в 5 минут
export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "npo");
    return pageMetadata({
        locale,
        path: routes.npo(locale),
        title: t("seo.title"),
        description: t("seo.description"),
    });
}

/** «О некоммерческой организации»: реквизиты, уставные документы, отчёты (GS-219). */
export default async function NpoPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tCommon, reports] = await Promise.all([
        getTranslator(locale, "npo"),
        getTranslator(locale),
        getDonationReports(locale),
    ]);
    const charterTitle = t("Уставные документы");

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto max-w-[1920px]">
                <PageBanner title={t("О некоммерческой организации")} />
                <div className="mx-auto flex max-w-[1280px] flex-col gap-[60px] px-[150px] pt-[60px] pb-[100px] down-lg:px-5">
                    <section>
                        <h2 className="w-full text-center text-[1.625rem] font-normal">
                            {t("Гудсёрфинг – официально зарегистрированная")}
                            <br />
                            {t("некоммерческая организация")}
                        </h2>
                        <p className="mt-6 text-[0.875rem] font-medium">
                            {t("Реквизиты организации: АВТОНОМНАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ИНФОРМАЦИОННЫЙ ЦЕНТР РАЗВИТИЯ ДОБРОВОЛЬЧЕСТВА «ГУДСЁРФИНГ – ДОБРЫЕ ПУТЕШЕСТВИЯ»")}
                            <br />
                            <br />
                            {t("АНО «Гудсёрфинг» зарегистрирована 20 июля 2018 г.")}
                        </p>
                    </section>

                    <div>
                        <h2 className="text-center text-[1.625rem] font-normal">{charterTitle}</h2>
                        <div className="mt-[30px] flex flex-wrap justify-center gap-[60px] px-[180px] down-lg:px-5">
                            {CHARTER_DOCUMENTS.map((src, index) => (
                                <ImageLightbox
                                    key={src}
                                    src={src}
                                    alt={`${charterTitle} ${index + 1}`}
                                    closeLabel={tCommon("Закрыть")}
                                    className="max-w-[275px]"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-[30px] flex flex-col gap-[60px]">
                        <ReportGroup
                            title={t("Отчёты МинЮст")}
                            links={MINISTRY_REPORTS.map(({ year, href }) => ({ title: t("{{year}} год", { year }), href }))}
                        />
                        <ReportGroup
                            title={t("Отчёты о деятельности")}
                            links={ACTIVITY_REPORTS.map(({ year, href }) => ({ title: t("{{year}} год", { year }), href }))}
                        />
                    </div>

                    {/* Блок остаётся и пустым — как в старом фронте, отступ после отчётов тот же */}
                    <div>
                        {reports.map((report, index) => (
                            <ReportGroup
                                key={`${index}-${report.name}`}
                                title={report.name}
                                className="mt-[60px]"
                                links={report.files.flatMap((file) => {
                                    const href = mediaUrl(file.file);
                                    return href ? [{ title: file.name, href }] : [];
                                })}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PublicShell>
    );
}
