import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DonationHeader } from "@/components/donation/DonationHeader";
import { PublicShell } from "@/components/layout/PublicShell";
import { ReportGroup } from "@/components/npo/ReportGroup";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { mediaUrl } from "@/lib/media";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const t = await getTranslator(locale, "seo");
    return pageMetadata({ locale, path: routes.donationReports(locale), title: t("donationReports.title"), description: t("donationReports.description") });
}

/** Отчёты, загруженные в админке; недоступны — раздел просто пустой, как в старом фронте */
async function getReports(locale: Locale) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/report", { signal: AbortSignal.timeout(5000) });
        return data ?? [];
    } catch {
        return [];
    }
}

const title = "w-full text-[18px] font-medium";
const text = "mt-2.5 text-[14px] font-medium";

/** «Публичная отчётность»: реквизиты АНО и отчёты (DonationReportsPage старого фронта, GS-219) */
export default async function DonationReportsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, reports] = await Promise.all([getTranslator(locale, "donation"), getReports(locale)]);

    return (
        <PublicShell locale={locale} topGap>
            <div className="mx-auto max-w-[1920px]">
                <DonationHeader title={t("Публичная отчётность")} />
                <div className="mx-auto flex max-w-[1280px] flex-col px-[150px] pt-[60px] pb-[100px] down-lg:px-5">
                    <section>
                        <h2 className={title}>
                            {t("Гудсёрфинг — официально зарегистрированная некоммерческая организация, осуществляющая свою деятельность с 2018 года Ниже можно ознакомиться с соответствующими отчётами о деятельности и реквизитами организации")}
                        </h2>
                        <br />
                        <p className={title}>{t("Реквизиты организации")}:</p>
                        {/* Реквизиты — юридический текст, в старом фронте не переводился */}
                        <p className={text}>
                            Полное название: АВТОНОМНАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ
                            «ИНФОРМАЦИОННЫЙ ЦЕНТР РАЗВИТИЯ ДОБРОВОЛЬЧЕСТВА «ГУДСЁРФИНГ – ДОБРЫЕ ПУТЕШЕСТВИЯ»
                            <br />
                            Сокращенное название: АНО «Гудсёрфинг»
                            <br />
                            Зарегистрирована 20 июля 2018 г. регистратором
                            МЕЖРАЙОННАЯ ИНСПЕКЦИЯ ФЕДЕРАЛЬНОЙ НАЛОГОВОЙ СЛУЖБЫ № 18 ПО РЕСПУБЛИКЕ ТАТАРСТАН.
                            <br />
                            Руководитель организации: директор Попов Илья Александрович.
                            <br />
                            Юридический адрес: 420043, республика Татарстан, город Казань,
                            Бойничная улица, дом 5, помещение 25.
                            <br />
                            Основным видом деятельности является «Деятельность по оказанию консультационных
                            и информационных услуг», зарегистрировано 5 дополнительных видов деятельности.
                            <br />
                            Организации присвоены ИНН 1655405070, ОГРН 1181690059682,
                            ОКПО 31801426.
                            <br />
                            support@goodsurfing.org
                        </p>
                        <br />
                        <p className={title}>{t("Банковские реквизиты")}:</p>
                        <p className={text}>
                            Счёт (₽) 40703810207500000136
                            <br />
                            Банк получателя ТОЧКА ПАО БАНКА «ФК ОТКРЫТИЕ», г. Москва
                            <br />
                            БИК 044525999, Корр. Счёт 30101810845250000999
                        </p>
                        <br />
                        <p className={text}>
                            {t("Годовые отчёты о деятельности и отчётность в Минюст —")}{" "}
                            <a href={routes.npo(locale)} className="text-primary hover:underline">{t("на странице «О некоммерческой организации»")}</a>
                        </p>
                    </section>
                    <div>
                        {reports.map((report, index) => (
                            <ReportGroup
                                key={`${report.name}-${index}`}
                                className="mt-[60px]"
                                title={report.name}
                                links={report.files.map((file) => ({ title: file.name, href: mediaUrl(file.file) ?? "" }))}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PublicShell>
    );
}
