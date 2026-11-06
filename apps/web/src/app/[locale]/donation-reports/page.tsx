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
const FULL_NAME = "АВТОНОМНАЯ НЕКОММЕРЧЕСКАЯ ОРГАНИЗАЦИЯ «ИНФОРМАЦИОННЫЙ ЦЕНТР РАЗВИТИЯ ДОБРОВОЛЬЧЕСТВА «ГУДСЁРФИНГ – ДОБРЫЕ ПУТЕШЕСТВИЯ»";
const REGISTRAR = "МЕЖРАЙОННАЯ ИНСПЕКЦИЯ ФЕДЕРАЛЬНОЙ НАЛОГОВОЙ СЛУЖБЫ № 18 ПО РЕСПУБЛИКЕ ТАТАРСТАН";
const BANK = "ТОЧКА ПАО БАНКА «ФК ОТКРЫТИЕ», г. Москва";

/**
 * Реквизиты организации (GS-227): подписи переведены, официальные наименования, адрес и номера
 * оставлены как в учредительных документах — так их ищут в реестрах и банке.
 */
const REQUISITES: Record<Locale, { legal: string[]; bank: string[] }> = {
    ru: {
        legal: [
            `Полное название: ${FULL_NAME}`,
            "Сокращенное название: АНО «Гудсёрфинг»",
            `Зарегистрирована 20 июля 2018 г. регистратором ${REGISTRAR}.`,
            "Руководитель организации: директор Попов Илья Александрович.",
            "Юридический адрес: 420043, республика Татарстан, город Казань, Бойничная улица, дом 5, помещение 25.",
            "Основным видом деятельности является «Деятельность по оказанию консультационных и информационных услуг», зарегистрировано 5 дополнительных видов деятельности.",
            "Организации присвоены ИНН 1655405070, ОГРН 1181690059682, ОКПО 31801426.",
        ],
        bank: ["Счёт (₽) 40703810207500000136", `Банк получателя ${BANK}`, "БИК 044525999, Корр. Счёт 30101810845250000999"],
    },
    en: {
        legal: [
            `Full name: ${FULL_NAME}`,
            "Short name: ANO Goodsurfing (АНО «Гудсёрфинг»)",
            `Registered on 20 July 2018 by ${REGISTRAR}.`,
            "Head of the organization: Director Ilya Popov (Попов Илья Александрович).",
            "Legal address: office 25, 5 Boinichnaya St., Kazan, Republic of Tatarstan, 420043, Russia.",
            "Main activity: consulting and information services; 5 additional activities are registered.",
            "TIN (INN) 1655405070, PSRN (OGRN) 1181690059682, OKPO 31801426.",
        ],
        bank: ["Account (RUB) 40703810207500000136", `Beneficiary bank: ${BANK}`, "BIC 044525999, correspondent account 30101810845250000999"],
    },
    es: {
        legal: [
            `Nombre completo: ${FULL_NAME}`,
            "Nombre abreviado: ANO Goodsurfing (АНО «Гудсёрфинг»)",
            `Registrada el 20 de julio de 2018 por ${REGISTRAR}.`,
            "Director de la organización: Ilya Popov (Попов Илья Александрович).",
            "Domicilio legal: oficina 25, calle Boinichnaya 5, Kazán, República de Tartaristán, 420043, Rusia.",
            "Actividad principal: servicios de consultoría e información; 5 actividades adicionales registradas.",
            "NIF (INN) 1655405070, OGRN 1181690059682, OKPO 31801426.",
        ],
        bank: ["Cuenta (RUB) 40703810207500000136", `Banco beneficiario: ${BANK}`, "BIC 044525999, cuenta corresponsal 30101810845250000999"],
    },
};

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
                        {/* Реквизиты: подписи на языке страницы, официальные названия и номера — как в документах */}
                        <p className={text}>
                            {REQUISITES[locale].legal.map((line, index) => <span key={index}>{line}<br /></span>)}
                            support@goodsurfing.org
                        </p>
                        <br />
                        <p className={title}>{t("Банковские реквизиты")}:</p>
                        <p className={text}>
                            {REQUISITES[locale].bank.map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>)}
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
