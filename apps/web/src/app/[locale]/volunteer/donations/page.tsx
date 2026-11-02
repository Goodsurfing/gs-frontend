import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerDonations } from "@/components/cabinet/volunteer/VolunteerDonations";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerDonations(locale), "main.sidebar.Поддержать") : {};
}

/** Кабинет волонтёра: «Поддержать» (VolunteerDonationsPage старого фронта) */
export default async function VolunteerDonationsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, td] = await Promise.all([getTranslator(locale), getTranslator(locale, "donation")]);
    const r = (key: string) => td(`donationRecommendation.${key}`);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full">
                <VolunteerDonations
                    hrefs={{ fundraise: routes.fundraise(locale, "{id}"), pay: routes.donationPay(locale, "{id}") }}
                    labels={{
                        title: r("Поддержать другие проекты"),
                        empty: r("На данный момент проектов нет"),
                        loadError: r("Произошла ошибка загрузки пожертвований"),
                        support: r("Поддержать"),
                        successBadge: td("Успешный проект"),
                        collected: td("Собрано"),
                        projectCollected: td("Проект собрал"),
                        left: td("Осталось"),
                        noTitle: t("Без заголовка"),
                        noDescription: t("Без описания"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
