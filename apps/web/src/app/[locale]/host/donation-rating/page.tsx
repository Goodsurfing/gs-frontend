import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostDonationsTable } from "@/components/cabinet/host/HostDonationsTable";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostDonationRating(locale), "main.sidebar.Пожертвования") : {};
}

/** Кабинет организатора: пожертвования в сборы организации (HostDonationsPage старого фронта) */
export default async function HostDonationRatingPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, td] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), getTranslator(locale, "donation")]);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main className="flex w-full max-w-[1200px] flex-col gap-5">
                <h2 className="text-[1.5em] font-bold">{th("hostDonations.Пожертвования")}</h2>
                <HostDonationsTable
                    volunteerHref={routes.volunteerPublicTemplate(locale)}
                    labels={{
                        sortLabel: td("Сортировка"),
                        byCount: td("По кол-ву пожертвований"),
                        byTotal: td("По общей сумме пожертвований"),
                        desc: td("По убыванию"),
                        asc: td("По возрастанию"),
                        searchFundraise: td("Название сбора"),
                        searchDonor: td("Поиск участника"),
                        name: td("ФИО"),
                        fundraise: td("Название сбора"),
                        amount: td("Сумма пожертвования, руб"),
                        date: td("Дата"),
                        empty: td("Никого не найдено"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
